import type { GeneratedIds } from '../types/subtask.types';

const WORDLIST_URL = '/wordlist-eff-large.txt';

let wordlistPromise: Promise<string[]> | null = null;

type GenerateUniqueIdOptions = {
  avoidWords?: string[];
};

const normalizeWord = (value: string): string => value.replace(/[^a-zA-Z0-9\s]/g, '').trim();

const loadWordlist = async (): Promise<string[]> => {
  if (!wordlistPromise) {
    wordlistPromise = fetch(WORDLIST_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load wordlist (${response.status})`);
        }

        const text = await response.text();
        const words = text
          .split(/\r?\n/)
          .map(normalizeWord)
          .filter(Boolean)
          .filter((word) => !word.startsWith('#'));

        return [...new Set(words)];
      })
      .catch((error: unknown) => {
        wordlistPromise = null;
        throw error;
      });
  }

  return wordlistPromise;
};

const getSecureRandomInt = (maxExclusive: number): number => {
  if (maxExclusive <= 0) {
    throw new Error('Cannot generate a random index from an empty list');
  }

  const cryptoObject = globalThis.crypto;

  if (!cryptoObject?.getRandomValues) {
    throw new Error('Cryptographically secure randomness is not available in this environment');
  }

  const maxUint32 = 0x1_0000_0000;
  const limit = Math.floor(maxUint32 / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);

  while (true) {
    cryptoObject.getRandomValues(buffer);
    const candidate = buffer[0];

    if (candidate < limit) {
      return candidate % maxExclusive;
    }
  }
};

const pickWord = (words: string[], avoidWords: string[] = []): string => {
  const usedWords = new Set(avoidWords.map((word) => word.toLowerCase()));
  const availableWords = words.filter((word) => !usedWords.has(word.toLowerCase()));

  if (availableWords.length === 0) {
    throw new Error('No unused words remain in the wordlist');
  }

  const randomIndex = getSecureRandomInt(availableWords.length);
  return availableWords[randomIndex];
};

export const generateUniqueId = async (fieldType: string, options: GenerateUniqueIdOptions = {}): Promise<string> => {
  const wordlist = await loadWordlist();
  const selectedWord = pickWord(wordlist, options.avoidWords ?? []);

  if (!selectedWord) {
    throw new Error(`Failed to generate a wordlist ID for ${fieldType}`);
  }

  return selectedWord.charAt(0).toUpperCase() + selectedWord.slice(1);
};

export const generateMultipleIds = async (fields: string[], options: GenerateUniqueIdOptions = {}): Promise<GeneratedIds> => {
  const result: Partial<GeneratedIds> = {};
  const avoidWords = [...(options.avoidWords ?? [])];

  for (const field of fields) {
    const generatedValue = await generateUniqueId(field, { avoidWords });
    result[field as keyof GeneratedIds] = generatedValue;
    avoidWords.push(generatedValue);
  }

  return result as GeneratedIds;
};