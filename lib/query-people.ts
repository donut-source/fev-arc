import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

interface QueryPeopleParams {
  search?: string;
  expertise?: string;
  department?: string;
  limit?: number;
}

interface QueryPeopleResponse {
  success: boolean;
  data?: Array<Record<string, unknown>>;
  suggestions?: Array<Record<string, unknown>>;
  error?: string;
}

// Levenshtein distance calculation for fuzzy matching
function calculateSimilarity(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLength = Math.max(len1, len2);
  return maxLength === 0 ? 1 : (maxLength - matrix[len2][len1]) / maxLength;
}

export async function queryPeople({
  search,
  expertise,
  department,
  limit = 50
}: QueryPeopleParams): Promise<QueryPeopleResponse> {
  try {
    console.log('Query people params:', { search, expertise, department, limit });

    let result;

    if (search) {
      // Search by name, title, or bio in the people table (detailed profiles)
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE name ILIKE ${`%${search}%`} 
           OR title ILIKE ${`%${search}%`} 
           OR bio ILIKE ${`%${search}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (expertise) {
      // Search by expertise areas
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE expertise_areas::text ILIKE ${`%${expertise}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else if (department) {
      // Search by department
      result = await sql`
        SELECT id, name, title, department, expertise_areas, bio, email, slack_handle, 
               years_experience, specializations, contact_preference, availability_status
        FROM people
        WHERE department ILIKE ${`%${department}%`}
        ORDER BY years_experience DESC, name ASC
      `;
    } else {
      // Get all people
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
          similarity: calculateSimilarity(search, person.name as string)
        }))
        .filter((person: Record<string, unknown>) => {
          console.log(`Similarity between "${search}" and "${person.name}": ${person.similarity}`);
          return (person.similarity as number) > 0.5; // 50% similarity threshold
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.similarity as number) - (a.similarity as number))
        .slice(0, 3); // Top 3 suggestions
      
      suggestions = similarPeople;
      console.log('Found', suggestions.length, 'similar matches');
    }

    console.log('People query result count:', result.length);
    console.log('Suggestions count:', suggestions.length);

    return {
      success: true,
      data: result.slice(0, limit),
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };

  } catch (error) {
    console.error('Query people error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
