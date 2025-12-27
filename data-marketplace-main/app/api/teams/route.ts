import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type'); // team, circle, squad, guild
    const department = searchParams.get('department');
    const includeMembers = searchParams.get('includeMembers') === 'true';

    let query = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.team_type,
        t.department,
        t.is_active,
        t.created_at,
        t.updated_at,
        p.name as lead_name,
        p.title as lead_title,
        p.email as lead_email,
        COUNT(tm.person_id) as member_count
      FROM teams t
      LEFT JOIN people p ON t.lead_person_id = p.id
      LEFT JOIN team_memberships tm ON t.id = tm.team_id AND tm.is_active = true
      WHERE t.is_active = true
    `;

    const params: Array<string | number> = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (type) {
      query += ` AND t.team_type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (department) {
      query += ` AND t.department ILIKE $${paramIndex}`;
      params.push(`%${department}%`);
      paramIndex++;
    }

    query += `
      GROUP BY t.id, t.name, t.description, t.team_type, t.department, 
               t.is_active, t.created_at, t.updated_at, p.name, p.title, p.email
      ORDER BY t.name ASC
    `;

    const result = await sql.query(query, params);

    let teams = result.rows.map((team: Record<string, unknown>) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      teamType: team.team_type,
      department: team.department,
      isActive: team.is_active,
      createdAt: team.created_at,
      updatedAt: team.updated_at,
      lead: team.lead_name ? {
        name: team.lead_name,
        title: team.lead_title,
        email: team.lead_email
      } : null,
      memberCount: parseInt(team.member_count) || 0,
      members: []
    }));

    // If includeMembers is true, fetch detailed member information
    if (includeMembers && teams.length > 0) {
      const teamIds = teams.map(t => t.id);
      const membersQuery = `
        SELECT 
          tm.team_id,
          tm.role,
          tm.joined_at,
          p.id as person_id,
          p.name,
          p.title,
          p.department,
          p.email,
          p.avatar_url,
          p.expertise_areas,
          p.availability_status
        FROM team_memberships tm
        JOIN people p ON tm.person_id = p.id
        WHERE tm.team_id = ANY($1) AND tm.is_active = true
        ORDER BY tm.team_id, tm.role DESC, p.name ASC
      `;

      const membersResult = await sql.query(membersQuery, [teamIds]);
      
      // Group members by team
      const membersByTeam = membersResult.rows.reduce((acc: Record<string, unknown[]>, member: Record<string, unknown>) => {
        if (!acc[member.team_id]) {
          acc[member.team_id] = [];
        }
        acc[member.team_id].push({
          personId: member.person_id,
          name: member.name,
          title: member.title,
          department: member.department,
          email: member.email,
          avatarUrl: member.avatar_url,
          expertiseAreas: member.expertise_areas,
          availabilityStatus: member.availability_status,
          role: member.role,
          joinedAt: member.joined_at
        });
        return acc;
      }, {});

      // Add members to teams
      teams = teams.map(team => ({
        ...team,
        members: membersByTeam[team.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: teams,
      count: teams.length
    });

  } catch (error) {
    console.error('Teams API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch teams',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, teamType = 'team', department, leadPersonId } = body;

    if (!name || !department) {
      return NextResponse.json(
        { success: false, error: 'Name and department are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO teams (name, description, team_type, department, lead_person_id)
      VALUES (${name}, ${description}, ${teamType}, ${department}, ${leadPersonId})
      RETURNING *
    `;

    const newTeam = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: newTeam.id,
        name: newTeam.name,
        description: newTeam.description,
        teamType: newTeam.team_type,
        department: newTeam.department,
        leadPersonId: newTeam.lead_person_id,
        isActive: newTeam.is_active,
        createdAt: newTeam.created_at,
        updatedAt: newTeam.updated_at
      }
    });

  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create team',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
