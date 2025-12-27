import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { shouldUseMockData } from '@/lib/runtime-config';
import { getMockDataSources } from '@/lib/mock-data';

// Simple fuzzy matching function
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || undefined;
    const type = searchParams.get('type') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    console.log('Data sources API called with params:', { search, type, category, status });

    if (shouldUseMockData()) {
      const data = getMockDataSources({ search, type, category, status });
      return NextResponse.json({
        success: true,
        data,
        count: data.length,
        suggestions: undefined,
        searchTerm: search,
      });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Use proper Neon serverless tagged template syntax like people and tools APIs
    let result;
    
    if (search && type && category && status && type !== 'All Types' && category !== 'All Categories' && status !== 'All Status') {
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        WHERE (ds.title ILIKE ${`%${search}%`} OR ds.description ILIKE ${`%${search}%`} OR g.name ILIKE ${`%${search}%`} OR g.genre ILIKE ${`%${search}%`})
          AND ds.type = ${type}
          AND ds.category = ${category}
          AND ds.status = ${status}
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    } else if (search && type && category && type !== 'All Types' && category !== 'All Categories') {
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        WHERE (ds.title ILIKE ${`%${search}%`} OR ds.description ILIKE ${`%${search}%`} OR g.name ILIKE ${`%${search}%`} OR g.genre ILIKE ${`%${search}%`})
          AND ds.type = ${type}
          AND ds.category = ${category}
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    } else if (search && type && type !== 'All Types') {
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        WHERE (ds.title ILIKE ${`%${search}%`} OR ds.description ILIKE ${`%${search}%`} OR g.name ILIKE ${`%${search}%`} OR g.genre ILIKE ${`%${search}%`})
          AND ds.type = ${type}
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    } else if (search) {
      console.log('Filtering data sources by search term:', search);
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        WHERE (ds.title ILIKE ${`%${search}%`} OR ds.description ILIKE ${`%${search}%`} OR g.name ILIKE ${`%${search}%`} OR g.genre ILIKE ${`%${search}%`})
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    } else if (type && category && type !== 'All Types' && category !== 'All Categories') {
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        WHERE ds.type = ${type} AND ds.category = ${category}
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    } else {
      result = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name,
          ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
          ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
          ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
        LEFT JOIN tags t ON dst.tag_id = t.id
        LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
        LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
        GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre, 
                 u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
                 ds.platform, tm.name, ds.created_at, ds.updated_at
        ORDER BY ds.trust_score DESC, ds.created_at DESC
      `;
    }

    console.log('Data sources query result count:', result.length);

    // If no exact results and we have a search term, try fuzzy matching
    let suggestions: Array<Record<string, unknown>> = [];
    if (result.length === 0 && search) {
      console.log('No exact matches found for data sources, trying fuzzy matching for:', search);
      
      // Get all data sources for fuzzy matching
      const allDataSources = await sql`
        SELECT 
          ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
          g.name as game_title, g.genre,
          u1.name as data_owner, u2.name as steward,
          ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
          ds.platform, tm.name as team_name, ds.created_at, ds.updated_at
        FROM data_sources ds
        LEFT JOIN games g ON ds.game_id = g.id
        LEFT JOIN users u1 ON ds.data_owner_id = u1.id
        LEFT JOIN users u2 ON ds.steward_id = u2.id
        LEFT JOIN teams tm ON ds.owner_team_id = tm.id
        ORDER BY ds.title ASC
      `;
      
      // Find similar titles, game names, or categories
      const similarDataSources = allDataSources
        .map((ds: Record<string, unknown>) => {
          const titleSim = calculateSimilarity(search, ds.title || '');
          const gameSim = calculateSimilarity(search, ds.game_title || '');
          const categorySim = calculateSimilarity(search, ds.category || '');
          const genreSim = calculateSimilarity(search, ds.genre || '');
          
          const maxSimilarity = Math.max(titleSim, gameSim, categorySim, genreSim);
          
          return {
            ...ds,
            similarity: maxSimilarity,
            matchType: titleSim === maxSimilarity ? 'title' : 
                      gameSim === maxSimilarity ? 'game' :
                      categorySim === maxSimilarity ? 'category' : 'genre'
          };
        })
        .filter((ds: Record<string, unknown>) => {
          console.log(`Similarity for "${ds.title}": ${ds.similarity} (${ds.matchType})`);
          return ds.similarity > 0.4; // 40% similarity threshold for data sources
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.similarity as number) - (a.similarity as number))
        .slice(0, 3); // Top 3 suggestions
      
      suggestions = similarDataSources;
      console.log('Found', suggestions.length, 'similar data source matches');
    }

    // Transform the result to match expected format
    const transformedData = result.map((row: Record<string, unknown>) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      business_description: row.business_description,
      type: row.type,
      category: row.category,
      game_title: row.game_title,
      genre: row.genre,
      data_owner: row.data_owner,
      steward: row.steward,
      trust_score: row.trust_score,
      status: row.status,
      access_level: row.access_level,
      sla_percentage: row.sla_percentage,
      platform: row.platform,
      team_name: row.team_name,
      tags: row.tags || [],
      tech_stack: row.tech_stack || [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      searchTerm: search,
    });
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data sources',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}