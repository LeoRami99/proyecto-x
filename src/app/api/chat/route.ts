import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('models/gemini-1.5-pro-latest'),
    system: 'conoces el banco atlantida?.',
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}