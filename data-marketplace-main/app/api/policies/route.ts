import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const policy_type = searchParams.get('policy_type') || '';
    const compliance_level = searchParams.get('compliance_level') || '';

    // Use proper Neon serverless tagged template syntax
    let result;
    
    if (search && category && policy_type && compliance_level) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR scope ILIKE ${`%${search}%`})
          AND category ILIKE ${`%${category}%`}
          AND policy_type ILIKE ${`%${policy_type}%`}
          AND compliance_level = ${compliance_level}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else if (search && category) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR scope ILIKE ${`%${search}%`})
          AND category ILIKE ${`%${category}%`}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else if (search) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`} OR scope ILIKE ${`%${search}%`} OR policy_type ILIKE ${`%${search}%`}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else if (category) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE category ILIKE ${`%${category}%`}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else if (policy_type) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE policy_type ILIKE ${`%${policy_type}%`}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else if (compliance_level) {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE compliance_level = ${compliance_level}
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    } else {
      result = await sql`
        SELECT id, name, description, category, policy_type, compliance_level, 
               effective_date, review_date, enforcement_level, scope, exceptions, 
               related_regulations, status, last_updated, created_at
        FROM policies
        WHERE status = 'active'
        ORDER BY compliance_level DESC, effective_date DESC
      `;
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch policies',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
