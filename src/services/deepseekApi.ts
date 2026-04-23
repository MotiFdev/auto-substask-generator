import type { GeneratedIds } from '../types/subtask.types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const generateUniqueId = async (fieldType: string): Promise<string> => {

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a creative identifier generator. Generate exactly one unique meaningful name (1–2 words max). It must be readable, like a name of an animal, place, object, or concept. Output ONLY the name, nothing else.',
        },
        {
          role: 'user',
          content: `Generate one unique name for this field type: ${fieldType}. It should be a real word or a natural-sounding name. Output only the name.`,
        },
      ],
      max_completion_tokens: 20,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Groq error ${response.status}: ${errorBody?.error?.message}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? '';

  // Clean output
  const cleaned = content.trim();

  // Take only first "word group" (handles cases like "Golden River")
  const id = cleaned.split('\n')[0].trim();

  if (!id) {
    throw new Error(`Groq returned an unexpected response: "${content}"`);
  }

  return id;
};

export const generateMultipleIds = async (fields: string[]): Promise<GeneratedIds> => {
  const result: Partial<GeneratedIds> = {};

  for (const field of fields) {
    result[field as keyof GeneratedIds] = await generateUniqueId(field);
    await new Promise(resolve => setTimeout(resolve, 100)); // rate limit safety
  }

  return result as GeneratedIds;
};