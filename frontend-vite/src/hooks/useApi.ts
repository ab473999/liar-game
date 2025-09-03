import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import type { Theme, Word } from '@/types';

// Hook for fetching themes
export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getThemes();
      setThemes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return { themes, loading, error, refetch: fetchThemes };
};

// Hook for fetching words by theme
export const useWords = (theme: string | null, enabled = true) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    if (!theme || !enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getWordsByTheme(theme);
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch words');
    } finally {
      setLoading(false);
    }
  }, [theme, enabled]);

  useEffect(() => {
    if (theme && enabled) {
      fetchWords();
    }
  }, [theme, enabled, fetchWords]);

  return { words, loading, error, refetch: fetchWords };
};

// Hook for API mutations (create, update, delete)
export const useApiMutation = <T, P>(
  mutationFn: (params: P) => Promise<T>
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { mutate, loading, error, data };
};
