import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { shouldUseMockData } from '@/lib/runtime-config';
import { CURRENT_USER_ID, getMockUserAccess } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataSourceIds = searchParams.get('data_source_ids')?.split(',') || [];

    if (dataSourceIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No data source IDs provided'
      });
    }

    if (shouldUseMockData()) {
      const accessMap = getMockUserAccess(dataSourceIds);
      return NextResponse.json({
        success: true,
        data: accessMap,
        user_id: CURRENT_USER_ID,
      });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Get user access for the specified data sources
    const result = await sql`
      SELECT 
        uda.data_source_id,
        uda.access_level,
        uda.granted_at,
        uda.expires_at,
        u.name as granted_by_name
      FROM user_data_access uda
      LEFT JOIN users u ON uda.granted_by = u.id
      WHERE uda.user_id = ${CURRENT_USER_ID}
      AND uda.data_source_id = ANY(${dataSourceIds})
    `;

    // Create a map of access levels
    const accessMap: Record<string, { 
      access_level: string; 
      granted_at: string; 
      expires_at?: string; 
      granted_by_name?: string; 
    }> = {};

    result.forEach(row => {
      accessMap[row.data_source_id] = {
        access_level: row.access_level,
        granted_at: row.granted_at,
        expires_at: row.expires_at,
        granted_by_name: row.granted_by_name,
      };
    });

    // For data sources not in the result, they have no access
    dataSourceIds.forEach(id => {
      if (!accessMap[id]) {
        accessMap[id] = {
          access_level: 'none',
          granted_at: '',
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: accessMap,
      user_id: CURRENT_USER_ID,
    });
  } catch (error) {
    console.error('Error fetching user access:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user access',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

