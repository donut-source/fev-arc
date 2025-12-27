import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const visibility = searchParams.get('visibility');
    const status = searchParams.get('status') || 'published';

    const sql = neon(process.env.DATABASE_URL!);
    
    // Build the base query
    let result;
    
    if (!search && (!type || type === 'all') && (!visibility || visibility === 'all')) {
      // Simple query without filters
      result = await sql`
        SELECT 
          i.id,
          i.title,
          i.description,
          i.insight_type,
          i.status,
          i.visibility,
          i.metrics,
          i.chart_config,
          i.thumbnail_url,
          i.view_count,
          i.favorite_count,
          i.created_at,
          i.updated_at,
          u.name as publisher_name,
          t.name as team_name,
          t.department as team_department,
          COALESCE(
            (SELECT ARRAY_AGG(ds.title) 
             FROM insight_data_sources ids 
             JOIN data_sources ds ON ids.data_source_id = ds.id 
             WHERE ids.insight_id = i.id), 
            '{}'::text[]
          ) as data_sources,
          COALESCE(
            (SELECT ARRAY_AGG(c.name) 
             FROM insight_collections ic 
             JOIN collections c ON ic.collection_id = c.id 
             WHERE ic.insight_id = i.id), 
            '{}'::text[]
          ) as collections
        FROM insights i
        LEFT JOIN users u ON i.publisher_id = u.id
        LEFT JOIN teams t ON i.team_id = t.id
        WHERE i.status = ${status}
        ORDER BY i.view_count DESC, i.created_at DESC
      `;
    } else {
      // Use query method for complex filtering
      let query = `
        SELECT 
          i.id,
          i.title,
          i.description,
          i.insight_type,
          i.status,
          i.visibility,
          i.metrics,
          i.chart_config,
          i.thumbnail_url,
          i.view_count,
          i.favorite_count,
          i.created_at,
          i.updated_at,
          u.name as publisher_name,
          t.name as team_name,
          t.department as team_department,
          COALESCE(
            (SELECT ARRAY_AGG(ds.title) 
             FROM insight_data_sources ids 
             JOIN data_sources ds ON ids.data_source_id = ds.id 
             WHERE ids.insight_id = i.id), 
            '{}'::text[]
          ) as data_sources,
          COALESCE(
            (SELECT ARRAY_AGG(c.name) 
             FROM insight_collections ic 
             JOIN collections c ON ic.collection_id = c.id 
             WHERE ic.insight_id = i.id), 
            '{}'::text[]
          ) as collections
        FROM insights i
        LEFT JOIN users u ON i.publisher_id = u.id
        LEFT JOIN teams t ON i.team_id = t.id
        WHERE i.status = $1
      `;
      
      const params: any[] = [status];
      let paramIndex = 2;

      if (search) {
        query += ` AND (
          LOWER(i.title) LIKE LOWER($${paramIndex}) OR 
          LOWER(i.description) LIKE LOWER($${paramIndex}) OR
          LOWER(t.name) LIKE LOWER($${paramIndex})
        )`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (type && type !== 'all') {
        query += ` AND i.insight_type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
      }

      if (visibility && visibility !== 'all') {
        query += ` AND i.visibility = $${paramIndex}`;
        params.push(visibility);
        paramIndex++;
      }

      query += ` ORDER BY i.view_count DESC, i.created_at DESC`;
      
      result = await sql.query(query, params);
    }

    // Transform the results to ensure proper data types
    const insights = result.map(row => ({
      ...row,
      metrics: row.metrics || {},
      chart_config: row.chart_config || {},
      view_count: Number(row.view_count) || 0,
      favorite_count: Number(row.favorite_count) || 0,
    }));

    return NextResponse.json({
      success: true,
      data: insights,
      count: insights.length
    });

  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch insights',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
