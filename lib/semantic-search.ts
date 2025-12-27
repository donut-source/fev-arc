import { neon } from '@neondatabase/serverless';
import { embed, cosineSimilarity } from 'ai';
import { openai } from '@ai-sdk/openai';
import { shouldUseMockData } from './runtime-config';

// Create Neon serverless connection lazily
let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (shouldUseMockData() || !process.env.DATABASE_URL) {
    throw new Error('Semantic search requires a database connection');
  }
  
  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }
  
  return sql;
}

interface SearchResult {
  id: number;
  content_type: string;
  content_id: number;
  content_text: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

interface SemanticSearchParams {
  query: string;
  limit?: number;
  threshold?: number;
  content_types?: string[];
}

interface SemanticSearchResponse {
  success: boolean;
  results?: SearchResult[];
  total_found?: number;
  message?: string;
  error?: string;
}

export async function performSemanticSearch({
  query,
  limit = 10,
  threshold = 0.7,
  content_types
}: SemanticSearchParams): Promise<SemanticSearchResponse> {
  try {
    console.log(`Semantic search for: "${query}"`);

    // Generate embedding for the query
    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: query,
    });

    console.log('Generated query embedding, length:', queryEmbedding.length);

    // Execute SQL query with optional content type filtering
    let result;
    
    const sqlClient = getSql();
    
    if (content_types && content_types.length > 0) {
      console.log('Filtering by content types:', content_types);
      result = await sqlClient`
        SELECT 
          id,
          content_type,
          content_id,
          content_text,
          metadata,
          embedding
        FROM content_embeddings
        WHERE content_type = ANY(${content_types})
        ORDER BY id
      `;
    } else {
      console.log('Getting all content embeddings');
      result = await sqlClient`
        SELECT 
          id,
          content_type,
          content_id,
          content_text,
          metadata,
          embedding
        FROM content_embeddings
        ORDER BY id
      `;
    }
    console.log('Found embeddings:', result.length);

    if (result.length === 0) {
      return {
        success: true,
        results: [],
        total_found: 0,
        message: 'No content found in the database'
      };
    }

    // Calculate similarities and filter by threshold
    const similarities: SearchResult[] = [];
    
    for (const row of result) {
      try {
        // Parse the embedding (stored as JSON array)
        const storedEmbedding = typeof row.embedding === 'string' 
          ? JSON.parse(row.embedding) 
          : row.embedding;

        if (!Array.isArray(storedEmbedding)) {
          console.warn(`Invalid embedding format for content ${row.content_type}:${row.content_id}`);
          continue;
        }

        const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
        
        if (similarity >= threshold) {
          similarities.push({
            id: row.id,
            content_type: row.content_type,
            content_id: row.content_id,
            content_text: row.content_text,
            metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
            similarity: similarity
          });
        }
      } catch (error) {
        console.error(`Error processing embedding for ${row.content_type}:${row.content_id}:`, error);
      }
    }

    // Sort by similarity (highest first) and limit results
    const sortedResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    console.log(`Found ${sortedResults.length} results above threshold ${threshold}`);

    return {
      success: true,
      results: sortedResults,
      total_found: sortedResults.length,
      message: sortedResults.length > 0 
        ? `Found ${sortedResults.length} semantically similar items`
        : `No results found above similarity threshold ${threshold}`
    };

  } catch (error) {
    console.error('Semantic search error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
