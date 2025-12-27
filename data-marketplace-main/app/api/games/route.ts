import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Create Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studio = searchParams.get('studio');
    const genre = searchParams.get('genre');
    const business_unit = searchParams.get('business_unit');
    const status = searchParams.get('status');

    let result;
    
    if (studio || genre || business_unit || status) {
      // Filtered query
      if (studio && !genre && !business_unit && !status) {
        result = await sql`
          SELECT g.*, s.location, s.specialization, s.founded_year, bu.description as bu_description, gen.target_audience, gen.monetization_model
          FROM games g
          LEFT JOIN studios s ON g.studio = s.name
          LEFT JOIN business_units bu ON g.business_unit = bu.name
          LEFT JOIN genres gen ON g.genre = gen.name
          WHERE g.studio ILIKE ${'%' + studio + '%'}
          ORDER BY g.release_date DESC
        `;
      } else {
        // For now, just return all games for complex filters
        result = await sql`
          SELECT g.*, s.location, s.specialization, s.founded_year, bu.description as bu_description, gen.target_audience, gen.monetization_model
          FROM games g
          LEFT JOIN studios s ON g.studio = s.name
          LEFT JOIN business_units bu ON g.business_unit = bu.name
          LEFT JOIN genres gen ON g.genre = gen.name
          ORDER BY g.release_date DESC
        `;
      }
    } else {
      // All games
      result = await sql`
        SELECT g.*, s.location, s.specialization, s.founded_year, bu.description as bu_description, gen.target_audience, gen.monetization_model
        FROM games g
        LEFT JOIN studios s ON g.studio = s.name
        LEFT JOIN business_units bu ON g.business_unit = bu.name
        LEFT JOIN genres gen ON g.genre = gen.name
        ORDER BY g.release_date DESC
      `;
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch games',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
