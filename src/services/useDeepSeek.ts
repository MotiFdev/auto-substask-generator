import { useState, useCallback } from 'react';
import { generateMultipleIds } from '../services/deepseekApi';
import type { GeneratedIds } from '../types/subtask.types';

interface UseDeepSeekReturn {
  generateIds: (fields: string[], count?: number) => Promise<GeneratedIds[]>;
  loading: boolean;
  error: string | null;
}

export const useDeepSeek = (): UseDeepSeekReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateIds = useCallback(async (fields: string[], count: number = 1): Promise<GeneratedIds[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const results: GeneratedIds[] = [];

      for (let i = 0; i < count; i += 1) {
        const ids = await generateMultipleIds(fields);
        results.push(ids);
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