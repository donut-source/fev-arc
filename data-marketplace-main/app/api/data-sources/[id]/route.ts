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
        { error: 'Data source ID is required' },
        { status: 400 }
      );
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
    "Killshot Marketing": "Gaming Marketing Division",
    "Velocity Racing Team": "Racing Games Division", 
    "Cosmic Analytics Team": "Games Analytics Division",
    "Dragon Empire Studios": "Fantasy Games Studio",
    "Stellar Conflict Labs": "Sci-Fi Games Laboratory",
    "Shadow Strike Ops": "Tactical Games Division",
    "MetroVision Dev Team": "Simulation Studios",
    "Mystic Realms Guild": "RPG Content Division",
    "Customer Success": "Customer Experience Division",
    "Marketing Intelligence": "Global Marketing Division",
    "Operations Analytics": "Infrastructure Division",
    "Quality Assurance": "Quality Engineering Division",
    "Public Data Initiative": "Open Data Initiative",
    "Financial Analytics": "Financial Systems Division"
  };

  return publisherMap[teamName] || `${department} Division`;
}

function getPublisherDescription(teamName: string, teamDescription: string, department: string): string {
  if (!teamName) return "The Data Analytics Division provides comprehensive data solutions across all gaming properties.";
  
  // Create contextual descriptions based on team and department
  const baseDescriptions: { [key: string]: string } = {
    "Killshot Marketing": "The Gaming Marketing Division specializes in FPS game marketing analytics, preorder campaigns, and player acquisition strategies for tactical shooter franchises.",
    "Velocity Racing Team": "The Racing Games Division focuses on racing game monetization, player engagement, and competitive racing analytics across all racing titles.",
    "Cosmic Analytics Team": "The Games Analytics Division provides player retention and engagement analytics for casual and party games, focusing on community-driven experiences.",
    "Dragon Empire Studios": "The Fantasy Games Studio develops and analyzes strategy games, providing economic modeling and player behavior insights for fantasy gaming experiences.",
    "Stellar Conflict Labs": "The Sci-Fi Games Laboratory specializes in multiplayer systems, match analytics, and performance optimization for science fiction gaming franchises.",
    "Shadow Strike Ops": "The Tactical Games Division focuses on FPS performance optimization, server analytics, and competitive gaming infrastructure.",
    "MetroVision Dev Team": "The Simulation Studios creates comprehensive analytics for city-building and simulation games, providing urban planning and player decision insights.",
    "Mystic Realms Guild": "The RPG Content Division specializes in character progression analytics, quest balancing, and narrative-driven gaming experiences.",
    "Customer Success": "The Customer Experience Division analyzes support interactions, customer satisfaction, and user experience across all products and services.",
    "Marketing Intelligence": "The Global Marketing Division provides multi-channel marketing attribution, customer acquisition analytics, and conversion optimization across all brands.",
    "Operations Analytics": "The Infrastructure Division monitors and optimizes cloud infrastructure, server performance, and operational efficiency across the global gaming platform.",
    "Quality Assurance": "The Quality Engineering Division analyzes application stability, crash reports, and quality metrics to ensure exceptional gaming experiences.",
    "Public Data Initiative": "The Open Data Initiative integrates external datasets and public information to enhance game development and market research capabilities.",
    "Financial Analytics": "The Financial Systems Division provides revenue forecasting, financial reporting, and business intelligence across all gaming and entertainment properties."
  };

  return baseDescriptions[teamName] || `The ${department} Division ${teamDescription?.toLowerCase() || 'provides specialized data solutions'} to support the gaming ecosystem.`;
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
