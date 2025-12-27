import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(_request: NextRequest) {
  try {
    // Execute the query using Neon serverless with template literals
    const result = await sql`
      SELECT 
        c.id,
        c.name,
        c.description,
        u.name as owner_name,
        c.visibility,
        c.is_published,
        c.created_at,
        c.updated_at,
        COUNT(cds.data_source_id) as data_source_count
      FROM collections c
      JOIN users u ON c.owner_id = u.id
      LEFT JOIN collection_data_sources cds ON c.id = cds.collection_id
      WHERE c.is_published = true AND c.visibility = 'public'
      GROUP BY c.id, c.name, c.description, u.name, c.visibility, c.is_published, c.created_at, c.updated_at
      ORDER BY c.updated_at DESC
    `;
    
    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch collections',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';