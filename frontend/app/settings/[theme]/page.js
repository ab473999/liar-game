"use client";
import { useState, useEffect } from 'react';
import { useDatabase } from '../../../hooks/useDatabase';
import { AddNewWord } from '@/components/functional/AddNewWord';
import { WordsTable } from '@/components/functional/WordsTable';
import { LoadingState } from '@/components/functional/LoadingState';

export default function ThemePage({ params }) {
  const { 
    loading, 
    error, 
    getWordsByTheme, 
    createWord, 
    updateWord,
    deleteWord 
  } = useDatabase();

  const [words, setWords] = useState([]);

  const [saving, setSaving] = useState({});

  const themeType = params.theme;

  // Load words on component mount
  useEffect(() => {
    loadWords();
  }, [themeType]);

  const loadWords = async () => {
    try {
      const wordsData = await getWordsByTheme(themeType);
      setWords(wordsData);
    } catch (err) {
      console.error('Failed to load words:', err);
    }
  };

  const handleAddWord = async (newWord) => {
    try {
      await createWord({
        themeId: words[0]?.themeId || 1,
        wordEn: newWord  // databaseAPI.js will transform this to 'word'
      });
      loadWords();
    } catch (err) {
      console.error('Failed to create word:', err);
    }
  };

  const handleUpdateWord = async (wordId, newValue) => {
    if (!newValue.trim()) return;
    
    setSaving(prev => ({ ...prev, [wordId]: true }));
    try {
      await updateWord(wordId, { wordEn: newValue.trim() });  // databaseAPI.js will transform this to 'word'
      setWords(prev => prev.map(w => 
        w.id === wordId ? { ...w, wordEn: newValue.trim(), word: newValue.trim() } : w
      ));
    } catch (err) {
      console.error('Failed to update word:', err);
    } finally {
      setSaving(prev => ({ ...prev, [wordId]: false }));
    }
  };

  const handleDeleteWord = async (id) => {
    if (confirm('Are you sure you want to delete this word?')) {
      try {
        await deleteWord(id);
        setWords(prev => prev.filter(word => word.id !== id));
      } catch (err) {
        console.error('Failed to delete word:', err);
      }
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-textPrimary)' }}>
            {themeType}
          </h1>
        </div>

        {error && (
          <div className="px-4 py-3 rounded mb-4" style={{ 
            backgroundColor: 'var(--color-errorBg)', 
            border: '1px solid var(--color-errorBorder)',
            color: 'var(--color-errorText)'
          }}>
            {error}
          </div>
        )}

        {loading && <LoadingState />}

        {/* Add New Word */}
        <AddNewWord onSubmit={handleAddWord} />

        {/* Words List */}
        <WordsTable 
          words={words}
          onUpdate={handleUpdateWord}
          onDelete={handleDeleteWord}
          savingIds={saving}
        />
      </div>
    </div>
  );
}
