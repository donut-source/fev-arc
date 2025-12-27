import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: convertToModelMessages(messages),
      system: 'You are a helpful assistant for the Data Marketplace.',
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat test error:', error);
    return new Response('Error', { status: 500 });
  }
}
