import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { shouldUseMockData } from '@/lib/runtime-config';
import { mockDataSources } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    if (shouldUseMockData()) {
      // In ARC, we repurpose this route as "coverage areas/entities" for PE alternative data. Provide a lightweight list for demo.
      const uniqueDomains = Array.from(new Set(mockDataSources.map((d) => d.game_title)));
      const data = uniqueDomains.map((name, idx) => ({
        id: `domain-${idx + 1}`,
        name,
        genre: 'Alternative Data',
        studio: 'ARC Demo',
        business_unit: 'Private Equity',
        release_date: '2025-01-01',
        location: 'Remote',
        specialization: 'Alternative Data',
        founded_year: 2024,
        bu_description: 'Alternative AI Ready Catalog (ARC) demo business unit',
        target_audience: 'Deal Team / Portfolio Ops',
        monetization_model: 'Internal',
      }));

      return NextResponse.json({ success: true, data, count: data.length });
    }

    // Create Neon serverless connection
    const sql = neon(process.env.DATABASE_URL!);

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
    console.error('Error fetching coverage areas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch coverage areas',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
