import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { shouldUseMockData } from '@/lib/runtime-config';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (shouldUseMockData() && !process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not set. Chat is disabled in mock mode.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: convertToModelMessages(messages),
      system: 'You are a helpful assistant for ARC (Alternatives AI Ready Catalog).',
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat test error:', error);
    return new Response('Error', { status: 500 });
  }
}
