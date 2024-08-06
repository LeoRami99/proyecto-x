'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createStreamableValue } from 'ai/rsc';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function continueConversation(history: Message[]) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: google('models/gemini-1.5-pro-latest'), 
      system: "eres un asesor del banco atlántida"+
      "el banco atlantida solo esta disponible en honduras",
      // prompt: history[history.length - 1].content,
      messages: history,
    });

    for await (const text of textStream) {
      stream.update(text);
    }

    stream.done();
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}