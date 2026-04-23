import type { GeneratedIds } from '../types/subtask.types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

type GenerateUniqueIdOptions = {
  avoidWords?: string[];
};

const WORD_PREFIXES = [
  'Nova', 'Luma', 'Vanta', 'Aria', 'Zeno', 'Mira', 'Sol', 'Astra', 'Cinder', 'Orion',
  'Kairo', 'Vel', 'Quill', 'Brio', 'Echo', 'Flux', 'Rune', 'Sage', 'Thorn', 'Vale'
];

const WORD_SUFFIXES = [
  'Bloom', 'Forge', 'Peak', 'Wave', 'Echo', 'Drift', 'Stone', 'Spark', 'Field', 'Wing',
  'Cliff', 'Grove', 'Comet', 'Ray', 'Hollow', 'Harbor', 'Pulse', 'Shade', 'Fable', 'Bloom'
];

const WORD_BANK = [
  'Aurora', 'Cobalt', 'Ember', 'Marble', 'Harbor', 'Juniper', 'Lattice', 'Meadow', 'Nimbus', 'Quartz',
  'Ridge', 'Saffron', 'Tundra', 'Velvet', 'Willow', 'Zephyr', 'Atlas', 'Basil', 'Coral', 'Delta'
];

const normalizeWord = (value: string): string => value.replace(/[^a-zA-Z0-9\s]/g, '').trim();

const createLocalFallbackWord = (avoidWords: string[] = []): string => {
  const usedWords = new Set(avoidWords.map((word) => word.toLowerCase()));

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const sourcePool = attempt % 3 === 0 ? WORD_BANK : attempt % 3 === 1 ? WORD_PREFIXES : WORD_SUFFIXES;
    const randomWord = sourcePool[Math.floor(Math.random() * sourcePool.length)];
    const pairedWord = WORD_SUFFIXES[Math.floor(Math.random() * WORD_SUFFIXES.length)];
    const candidate = attempt % 3 === 0 ? randomWord : `${randomWord}${pairedWord}`;
    const normalizedCandidate = candidate.toLowerCase();

    if (!usedWords.has(normalizedCandidate)) {
      return candidate;
    }
  }

  return `Nova${Math.random().toString(36).slice(2, 6)}`;
};

export const generateUniqueId = async (fieldType: string, options: GenerateUniqueIdOptions = {}): Promise<string> => {
  const avoidWords = options.avoidWords ?? [];
  const avoidText = avoidWords.length > 0 ? `Avoid these words: ${avoidWords.join(', ')}.` : '';

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
          content: 'You are a creative identifier generator. Generate exactly one uncommon, vivid, pronounceable word or 2-word phrase. Prefer different semantic families on each call: nature, astronomy, minerals, mythology, weather, animals, architecture, ocean, or abstract concepts. Output ONLY the name, nothing else. Do not reuse obvious common words.',
        },
        {
          role: 'user',
          content: `Generate one unique name for this field type: ${fieldType}. ${avoidText} It should feel fresh, random, and not repeat other generated words. Output only the name.`,
        },
      ],
      max_completion_tokens: 20,
      temperature: 1.15,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`Groq error ${response.status}: ${errorBody?.error?.message}`);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content ?? '';

  const cleaned = normalizeWord(content);

  // Take only first "word group" (handles cases like "Golden River")
  const id = cleaned.split('\n')[0].trim();

  if (!id || avoidWords.some((word) => word.toLowerCase() === id.toLowerCase())) {
    return createLocalFallbackWord(avoidWords);
  }

  return id;
};

export const generateMultipleIds = async (fields: string[], options: GenerateUniqueIdOptions = {}): Promise<GeneratedIds> => {
  const result: Partial<GeneratedIds> = {};
  const avoidWords = [...(options.avoidWords ?? [])];

  for (const field of fields) {
    const generatedValue = await generateUniqueId(field, { avoidWords });
    result[field as keyof GeneratedIds] = generatedValue;
    avoidWords.push(generatedValue);
    await new Promise(resolve => setTimeout(resolve, 100)); // rate limit safety
  }

  return result as GeneratedIds;
};