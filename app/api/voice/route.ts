// app/api/voice/route.ts
import { NextRequest } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

export async function POST(req: NextRequest) {
  const { text, member } = await req.json();

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const response = await openai.createSpeech(
    {
      input: text,
      voice: 'nova', // TODO: Later replace this with dynamic voice selection based on `member`
      model: 'tts-1',
    },
    { responseType: 'arraybuffer' }
  );

  return new Response(response.data, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
