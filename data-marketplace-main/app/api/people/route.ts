import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Simple fuzzy matching function using Levenshtein distance
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

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const expertise = searchParams.get('expertise') || '';
    const department = searchParams.get('department') || '';

    // Use proper Neon serverless tagged template syntax
    let result;
    
    if (search && expertise && department) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE (name ILIKE ${`%${search}%`} OR title ILIKE ${`%${search}%`} OR bio ILIKE ${`%${search}%`} OR department ILIKE ${`%${search}%`})
          AND ${expertise} = ANY(expertise_areas)
          AND department ILIKE ${`%${department}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (search && expertise) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE (name ILIKE ${`%${search}%`} OR title ILIKE ${`%${search}%`} OR bio ILIKE ${`%${search}%`} OR department ILIKE ${`%${search}%`})
          AND ${expertise} = ANY(expertise_areas)
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (search && department) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE (name ILIKE ${`%${search}%`} OR title ILIKE ${`%${search}%`} OR bio ILIKE ${`%${search}%`} OR department ILIKE ${`%${search}%`})
          AND department ILIKE ${`%${department}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (expertise && department) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE ${expertise} = ANY(expertise_areas)
          AND department ILIKE ${`%${department}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (search) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE name ILIKE ${`%${search}%`} OR title ILIKE ${`%${search}%`} OR bio ILIKE ${`%${search}%`} OR department ILIKE ${`%${search}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (expertise) {
      // Handle multiple expertise terms separated by commas
      const expertiseTerms = expertise.split(',').map(term => term.trim());
      
      if (expertiseTerms.length === 1) {
        result = await sql`
          SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
                 years_experience, specializations, contact_preference, availability_status
          FROM people
          WHERE ${expertiseTerms[0]} = ANY(expertise_areas)
          ORDER BY years_experience DESC, name ASC
        `;
      } else {
        // For multiple terms, use OR logic to find people with any of the expertise areas
        const conditions = expertiseTerms.map(term => `'${term}' = ANY(expertise_areas)`).join(' OR ');
        result = await sql`
          SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
                 years_experience, specializations, contact_preference, availability_status
          FROM people
          WHERE ${sql.unsafe(conditions)}
          ORDER BY years_experience DESC, name ASC
        `;
      }
    } else if (department) {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE department ILIKE ${`%${department}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else {
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        ORDER BY years_experience DESC, name ASC
      `;
    }

    // If no exact results and we have a search term, try fuzzy matching
    let suggestions: Array<Record<string, unknown>> = [];
    if (result.length === 0 && search) {
      console.log('No exact matches found, trying fuzzy matching for:', search);
      
      // Get all people for fuzzy matching
      const allPeople = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        ORDER BY name ASC
      `;
      
      // Find similar names
      const similarPeople = allPeople
        .map((person: Record<string, unknown>) => ({
          ...person,
          similarity: calculateSimilarity(search, person.name)
        }))
        .filter((person: Record<string, unknown>) => {
          console.log(`Similarity between "${search}" and "${person.name}": ${person.similarity}`);
          return person.similarity > 0.5; // 50% similarity threshold
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.similarity as number) - (a.similarity as number))
        .slice(0, 3); // Top 3 suggestions
      
      suggestions = similarPeople;
      console.log('Found', suggestions.length, 'similar matches');
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      searchTerm: search,
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch people',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


export const dynamic = 'force-dynamic';

