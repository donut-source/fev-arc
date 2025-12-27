import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { shouldUseMockData } from '@/lib/runtime-config';
import { getMockDataSourceById } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Data source ID is required' },
        { status: 400 }
      );
    }

    if (shouldUseMockData()) {
      const ds = getMockDataSourceById(id);
      if (!ds) {
        return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
      }

      const transformedDataSource = {
        ...ds,
        // Publisher information based on team data
        publisher_name: 'ARC – Data Products',
        publisher_description:
          'ARC publishes governed alternative-data products for private equity diligence and portfolio monitoring.',
        publisher_type: 'Analytics Team',
        department: 'Private Equity',
        team_description:
          'Alternative-data products for deal teams, IC memos, and portfolio monitoring.',
      };

      return NextResponse.json({ success: true, data: transformedDataSource });
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      SELECT 
        ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category,
        g.name as game_title, g.genre,
        u1.name as data_owner, u2.name as steward,
        ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
        ds.platform, tm.name as team_name, tm.description as team_description, tm.department,
        ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
        ARRAY_AGG(DISTINCT ts.name) FILTER (WHERE ts.name IS NOT NULL) as tech_stack,
        ds.created_at, ds.updated_at
      FROM data_sources ds
      LEFT JOIN games g ON ds.game_id = g.id
      LEFT JOIN users u1 ON ds.data_owner_id = u1.id
      LEFT JOIN users u2 ON ds.steward_id = u2.id
      LEFT JOIN teams tm ON ds.owner_team_id = tm.id
      LEFT JOIN data_source_tags dst ON ds.id = dst.data_source_id
      LEFT JOIN tags t ON dst.tag_id = t.id
      LEFT JOIN data_source_tech_stack dsts ON ds.id = dsts.data_source_id
      LEFT JOIN tech_stack ts ON dsts.tech_stack_id = ts.id
      WHERE ds.id = ${id}
      GROUP BY ds.id, ds.title, ds.description, ds.business_description, ds.type, ds.category, g.name, g.genre,
               u1.name, u2.name, ds.trust_score, ds.status, ds.access_level, ds.sla_percentage,
               ds.platform, tm.name, tm.description, tm.department, ds.created_at, ds.updated_at
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Data source not found' },
        { status: 404 }
      );
    }

    const dataSource = result[0];

    // Transform the data to match the expected format
    const transformedDataSource = {
      id: dataSource.id,
      title: dataSource.title,
      description: dataSource.description,
      business_description: dataSource.business_description,
      type: dataSource.type,
      category: dataSource.category,
      game_title: dataSource.game_title,
      genre: dataSource.genre,
      data_owner: dataSource.data_owner,
      steward: dataSource.steward,
      trust_score: dataSource.trust_score,
      status: dataSource.status,
      access_level: dataSource.access_level,
      sla_percentage: dataSource.sla_percentage,
      platform: dataSource.platform,
      team_name: dataSource.team_name,
      team_description: dataSource.team_description,
      department: dataSource.department,
      tags: dataSource.tags || [],
      tech_stack: dataSource.tech_stack || [],
      created_at: dataSource.created_at,
      updated_at: dataSource.updated_at,
      // Publisher information based on team data
      publisher_name: getPublisherName(dataSource.team_name, dataSource.department),
      publisher_description: getPublisherDescription(dataSource.team_name, dataSource.team_description, dataSource.department),
      publisher_type: getPublisherType(dataSource.department)
    };

    return NextResponse.json({
      success: true,
      data: transformedDataSource
    });

  } catch (error) {
    console.error('Error fetching data source:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data source' },
      { status: 500 }
    );
  }
}

function getPublisherName(teamName: string, department: string): string {
  if (!teamName) return "Data Analytics Division";
  
  // Map team names to publisher divisions
  const publisherMap: { [key: string]: string } = {
    "ARC – Private Equity Analytics": "Alternatives AI Ready Catalog (ARC)",
    "Private Equity Analytics": "Alternatives AI Ready Catalog (ARC)"
  };

  return publisherMap[teamName] || `${department} Division`;
}

function getPublisherDescription(teamName: string, teamDescription: string, department: string): string {
  if (!teamName) return "ARC provides governed alternative-data products for private equity diligence and portfolio monitoring.";
  
  // Create contextual descriptions based on team and department
  const baseDescriptions: { [key: string]: string } = {
    "ARC – Private Equity Analytics": "ARC publishes governed alternative-data products for private equity diligence, valuation, and portfolio monitoring."
  };

  return baseDescriptions[teamName] || `The ${department} team ${teamDescription?.toLowerCase() || 'publishes governed data products'} to support private equity workflows.`;
}

function getPublisherType(department: string): string {
  const typeMap: { [key: string]: string } = {
    "Marketing": "Marketing Team",
    "Game Development": "Development Studio", 
    "Content": "Content Team",
    "Engineering": "Engineering Team",
    "Data Science": "Analytics Team",
    "Customer Success": "Experience Team",
    "Operations": "Operations Team",
    "Finance": "Finance Team"
  };

  return typeMap[department] || "Data Team";
}
