import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    // For now, get John Doe's profile
    // In a real app, you'd get the user ID from authentication
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM people WHERE name = $1 LIMIT 1',
        ['John Doe']
      );
      
      if (result.rows.length > 0) {
        const person = result.rows[0];
        return NextResponse.json({
          success: true,
          data: {
            id: person.id,
            name: person.name,
            email: person.email,
            phone: '', // Not in people table yet
            title: person.title,
            department: person.department,
            location: '', // Not in people table yet
            bio: person.bio || '',
            expertise: person.expertise_areas || [],
            yearsExperience: person.years_experience ? `${person.years_experience} years` : '',
            education: '', // Not in people table yet
            certifications: person.specializations || [],
            preferredTools: [], // Not in people table yet
            avatar: person.avatar_url,
            specializations: person.specializations || [],
            contactPreference: person.contact_preference || 'email',
            availabilityStatus: person.availability_status || 'available'
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Profile not found'
        }, { status: 404 });
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      title, 
      department, 
      location, 
      bio, 
      expertise, 
      yearsExperience, 
      education, 
      certifications, 
      preferredTools 
    } = body;

    console.log('Updating profile with data:', { name, title, department, expertise, bio });

    // Convert years experience to number
    let yearsExp = null;
    if (yearsExperience) {
      const match = yearsExperience.match(/(\d+)/);
      if (match) {
        yearsExp = parseInt(match[1]);
      }
    }

    const client = await pool.connect();
    
    try {
      // Update John Doe's record directly in the database
      const result = await client.query(
        `UPDATE people 
         SET name = $1, title = $2, department = $3, expertise_areas = $4, 
             bio = $5, email = $6, years_experience = $7, specializations = $8, 
             updated_at = CURRENT_TIMESTAMP
         WHERE name = 'John Doe'
         RETURNING *`,
        [
          name,
          title,
          department,
          expertise || [],
          bio || '',
          email,
          yearsExp,
          certifications || []
        ]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Profile not found or not updated'
        }, { status: 404 });
      }

      const updatedPerson = result.rows[0];
      console.log('Profile updated successfully:', updatedPerson);

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: updatedPerson.id,
          name: updatedPerson.name,
          email: updatedPerson.email,
          title: updatedPerson.title,
          department: updatedPerson.department,
          bio: updatedPerson.bio,
          expertise: updatedPerson.expertise_areas,
          yearsExperience: updatedPerson.years_experience,
          specializations: updatedPerson.specializations
        }
      });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
