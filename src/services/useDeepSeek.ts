import { useState, useCallback } from 'react';
import { generateMultipleIds } from '../services/deepseekApi';
import type { GeneratedIds } from '../types/subtask.types';

type GeneratedIdKey = keyof GeneratedIds;

interface GenerateIdsOptions {
  fixedFields?: GeneratedIdKey[];
}

interface UseDeepSeekReturn {
  generateIds: (fields: GeneratedIdKey[], count?: number, options?: GenerateIdsOptions) => Promise<GeneratedIds[]>;
  loading: boolean;
  error: string | null;
}

export const useDeepSeek = (): UseDeepSeekReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateIds = useCallback(async (fields: GeneratedIdKey[], count: number = 1, options: GenerateIdsOptions = {}): Promise<GeneratedIds[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const results: GeneratedIds[] = [];
      const fixedFields = options.fixedFields ?? [];
      const variableFields = fields.filter((field) => !fixedFields.includes(field));
      const usedWords: string[] = [];
      const fixedIds = fixedFields.length > 0 ? await generateMultipleIds(fixedFields, { avoidWords: usedWords }) : null;
      const usedValues: Record<GeneratedIdKey, Set<string>> = {
        bsid: new Set<string>(),
        bvid: new Set<string>(),
        hsid: new Set<string>(),
        hvid: new Set<string>()
      };

      if (fixedIds) {
        fixedFields.forEach((field) => {
          usedValues[field].add(fixedIds[field]);
          usedWords.push(fixedIds[field]);
        });
      }

      for (let i = 0; i < count; i += 1) {
        const ids: Partial<GeneratedIds> = fixedIds ? { ...fixedIds } : {};

        for (const field of variableFields) {
          let generatedValue = '';
          let attempts = 0;

          do {
            generatedValue = await generateMultipleIds([field], { avoidWords: usedWords }).then((generated) => generated[field]);
            attempts += 1;
          } while (usedValues[field].has(generatedValue) && attempts < 8);

          if (usedValues[field].has(generatedValue)) {
            throw new Error(`Failed to generate a unique value for ${field}`);
          }

          usedValues[field].add(generatedValue);
          usedWords.push(generatedValue);
          ids[field] = generatedValue;
        }

        results.push(ids as GeneratedIds);
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate IDs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateIds, loading, error };
};