import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { shouldUseMockData } from '@/lib/runtime-config';
import { getMockTools } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const vendor = searchParams.get('vendor') || '';
    const access_level = searchParams.get('access_level') || '';

    if (shouldUseMockData()) {
      const result = getMockTools({ search, category, vendor, access_level });
      return NextResponse.json({
        success: true,
        data: result,
        count: result.length,
      });
    }

    // Create Neon serverless connection
    const sql = neon(process.env.DATABASE_URL!);

    // Use proper Neon serverless tagged template syntax
    let result;
    
    if (search && category && vendor && access_level) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR business_value ILIKE ${`%${search}%`})
          AND category ILIKE ${`%${category}%`}
          AND vendor ILIKE ${`%${vendor}%`}
          AND access_level = ${access_level}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else if (search && category) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR business_value ILIKE ${`%${search}%`})
          AND category ILIKE ${`%${category}%`}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else if (search) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR business_value ILIKE ${`%${search}%`} OR vendor ILIKE ${`%${search}%`}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else if (category) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE category ILIKE ${`%${category}%`}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else if (vendor) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE vendor ILIKE ${`%${vendor}%`}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else if (access_level) {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE access_level = ${access_level}
        ORDER BY trust_score DESC, user_count DESC
      `;
    } else {
      result = await sql`
        SELECT id, name, description, category, vendor, access_level, pricing_model, 
               integration_complexity, business_value, technical_requirements, 
               setup_time, user_count, trust_score, status, last_updated, created_at
        FROM tools
        WHERE status = 'active'
        ORDER BY trust_score DESC, user_count DESC
      `;
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tools',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
