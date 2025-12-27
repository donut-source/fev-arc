import { NextRequest, NextResponse } from 'next/server';
import { performSemanticSearch } from '@/lib/semantic-search';

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 10, threshold = 0.7, content_types } = await request.json();

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 });
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