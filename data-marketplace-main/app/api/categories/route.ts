import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(_request: NextRequest) {
  try {
    // Execute the query using Neon serverless with template literals
    const result = await sql`
      SELECT 
        ds.category,
        COUNT(*) as count,
        ARRAY_AGG(DISTINCT ds.type) as types,
        AVG(ds.trust_score) as avg_trust_score
      FROM data_sources ds
      WHERE ds.status = 'ready'
      GROUP BY ds.category
      ORDER BY count DESC, ds.category ASC
    `;
    
    // Transform the results to match the expected format
    const categories = result.map(row => ({
      id: row.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: row.category,
      count: parseInt(row.count),
      types: row.types || [],
      avgTrustScore: Math.round(row.avg_trust_score || 0),
    }));

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
