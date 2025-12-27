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
    const teamId = id;

    const result = await sql`
      SELECT 
        tm.id as membership_id,
        tm.role,
        tm.joined_at,
        tm.is_active,
        p.id as person_id,
        p.name,
        p.title,
        p.department,
        p.email,
        p.avatar_url,
        p.expertise_areas,
        p.specializations,
        p.availability_status,
        p.contact_preference
      FROM team_memberships tm
      JOIN people p ON tm.person_id = p.id
      WHERE tm.team_id = ${teamId} AND tm.is_active = true
      ORDER BY tm.role DESC, p.name ASC
    `;

    const members = result.rows.map((member: Record<string, unknown>) => ({
      membershipId: member.membership_id,
      personId: member.person_id,
      name: member.name,
      title: member.title,
      department: member.department,
      email: member.email,
      avatarUrl: member.avatar_url,
      expertiseAreas: member.expertise_areas,
      specializations: member.specializations,
      availabilityStatus: member.availability_status,
      contactPreference: member.contact_preference,
      role: member.role,
      joinedAt: member.joined_at,
      isActive: member.is_active
    }));

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length
    });

  } catch (error) {
    console.error('Team members API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch team members',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = id;
    const body = await request.json();
    const { personId, role = 'member' } = body;

    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }

    // Check if membership already exists
    const existingMembership = await sql`
      SELECT id FROM team_memberships 
      WHERE team_id = ${teamId} AND person_id = ${personId}
    `;

    if (existingMembership.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Person is already a member of this team' },
        { status: 409 }
      );
    }

    const result = await sql`
      INSERT INTO team_memberships (team_id, person_id, role)
      VALUES (${teamId}, ${personId}, ${role})
      RETURNING *
    `;

    const newMembership = result.rows[0];

    // Fetch the person details to return complete information
    const personResult = await sql`
      SELECT name, title, department, email, avatar_url
      FROM people 
      WHERE id = ${personId}
    `;

    const person = personResult.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        membershipId: newMembership.id,
        personId: newMembership.person_id,
        teamId: newMembership.team_id,
        role: newMembership.role,
        joinedAt: newMembership.joined_at,
        isActive: newMembership.is_active,
        person: {
          name: person.name,
          title: person.title,
          department: person.department,
          email: person.email,
          avatarUrl: person.avatar_url
        }
      }
    });

  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add team member',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    if (!personId) {
      return NextResponse.json(
        { success: false, error: 'Person ID is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE team_memberships 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE team_id = ${teamId} AND person_id = ${personId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Team membership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to remove team member',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
