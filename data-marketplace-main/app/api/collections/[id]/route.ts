import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, try to get from published collections in localStorage (simulated)
    // In a real app, this would be from the database
    
    // For now, let's fetch a collection from the database by ID
    const collectionResult = await sql`
      SELECT
        c.id,
        c.name,
        c.description,
        u.name as owner_name,
        c.visibility,
        c.is_published,
        c.created_at,
        c.updated_at
      FROM collections c
      JOIN users u ON c.owner_id = u.id
      WHERE c.id = ${id} AND c.is_published = true
    `;

    if (collectionResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collection not found'
        },
        { status: 404 }
      );
    }

    const collection = collectionResult[0];

    // Get the data sources in this collection
    const dataSourcesResult = await sql`
      SELECT
        ds.id,
        ds.title,
        ds.description,
        ds.business_description,
        ds.type,
        ds.category,
        g.name as game_title,
        g.genre,
        u1.name as data_owner,
        u2.name as steward,
        ds.trust_score,
        ds.status,
        ds.platform,
        tm.name as team_name,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
        ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack
      FROM collection_data_sources cds
      JOIN data_sources ds ON cds.data_source_id = ds.id
      LEFT JOIN games g ON ds.game_id = g.id
      LEFT JOIN users u1 ON ds.data_owner_id = u1.id
      LEFT JOIN users u2 ON ds.steward_id = u2.id
      LEFT JOIN teams tm ON ds.owner_team_id = tm.id
      LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
      LEFT JOIN tags t ON dst.tag_id = t.id
      LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
      LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
      WHERE cds.collection_id = ${id}
      GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre,
               u1.name, u2.name, ds.trust_score, ds.status, ds.platform, tm.name
      ORDER BY ds.trust_score DESC
    `;

    // Process the results to ensure arrays are properly handled
    const dataSources = dataSourcesResult.map(row => ({
      ...row,
      tags: row.tags || [],
      tech_stack: row.tech_stack || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...collection,
        data_sources: dataSources,
        data_source_count: dataSources.length,
      },
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch collection',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

