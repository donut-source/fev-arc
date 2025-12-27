import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Insight ID is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
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
        t.department as team_department
      FROM insights i
      LEFT JOIN users u ON i.publisher_id = u.id
      LEFT JOIN teams t ON i.team_id = t.id
      WHERE i.id = ${id}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Insight not found' },
        { status: 404 }
      );
    }

    const insight = result[0];

    // Transform the result to ensure proper data types
    const transformedInsight = {
      ...insight,
      metrics: insight.metrics || {},
      chart_config: insight.chart_config || {},
      view_count: Number(insight.view_count) || 0,
      favorite_count: Number(insight.favorite_count) || 0,
    };

    // Increment view count (fire and forget)
    sql`UPDATE insights SET view_count = view_count + 1 WHERE id = ${id}`.catch(console.error);

    return NextResponse.json({ success: true, data: transformedInsight });
  } catch (error: any) {
    console.error('Error fetching insight:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch insight' },
      { status: 500 }
    );
  }
}
