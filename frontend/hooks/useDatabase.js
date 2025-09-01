import { useState, useCallback } from 'react';
import DatabaseAPI from '../services/databaseAPI';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    console.error('Database operation error:', err);
    setError(err.message);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  }, []);

  // Theme operations
  const getThemes = useCallback(async (easterEgg = null) => {
    setLoading(true);
    setError(null);
    try {
      const themes = await DatabaseAPI.getThemes(easterEgg);
      return themes;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createTheme = useCallback(async (themeData) => {
    setLoading(true);
    setError(null);
    try {
      const theme = await DatabaseAPI.createTheme(themeData);
      return theme;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateTheme = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const theme = await DatabaseAPI.updateTheme(id, updateData);
      return theme;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Word operations
  const getWordsByTheme = useCallback(async (theme, lang = 'en') => {
    setLoading(true);
    setError(null);
    try {
      const words = await DatabaseAPI.getWordsByTheme(theme, lang);
      return words;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createWord = useCallback(async (wordData) => {
    setLoading(true);
    setError(null);
    try {
      const word = await DatabaseAPI.createWord(wordData);
      return word;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateWord = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const word = await DatabaseAPI.updateWord(id, updateData);
      return word;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteWord = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DatabaseAPI.deleteWord(id);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    loading,
    error,
    // Theme operations
    getThemes,
    createTheme,
    updateTheme,
    // Word operations
    getWordsByTheme,
    createWord,
    updateWord,
    deleteWord,
  };
};
