import { NextRequest, NextResponse } from 'next/server';
import { performSemanticSearch } from '@/lib/semantic-search';
import { shouldUseMockData } from '@/lib/runtime-config';

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 10, threshold = 0.7, content_types } = await request.json();

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 });
    }

    // In mock mode, semantic search is not available
    if (shouldUseMockData()) {
      return NextResponse.json({
        success: true,
        results: [],
        total_found: 0,
        message: 'Semantic search is not available in mock data mode'
      });
    }

    // Use the shared semantic search function
    const result = await performSemanticSearch({
      query,
      limit,
      threshold,
      content_types
    });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('Semantic search API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}