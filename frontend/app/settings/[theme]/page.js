"use client";
import { useState, useEffect } from 'react';
import { useDatabase } from '../../../hooks/useDatabase';
import { Plus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

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
  const [newWord, setNewWord] = useState('');
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

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    
    try {
      await createWord({
        themeId: words[0]?.themeId || 1,
        wordEn: newWord.trim()
      });
      setNewWord('');
      loadWords();
    } catch (err) {
      console.error('Failed to create word:', err);
    }
  };

  const handleUpdateWord = async (wordId, newValue) => {
    if (!newValue.trim()) return;
    
    setSaving(prev => ({ ...prev, [wordId]: true }));
    try {
      await updateWord(wordId, { wordEn: newValue.trim() });
      setWords(prev => prev.map(word => 
        word.id === wordId ? { ...word, wordEn: newValue.trim() } : word
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

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
          </div>
        )}

        {/* Add New Word */}
        <div className="p-6 rounded-lg shadow mb-6" style={{ backgroundColor: 'var(--color-cardBg)' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>Add New Word</h2>
          <form onSubmit={handleAddWord} className="flex gap-3">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Enter a new word..."
              className="flex-1 p-3 border rounded-lg text-lg"
              style={{ 
                backgroundColor: 'var(--color-inputBg)',
                color: 'var(--color-textPrimary)',
                borderColor: 'var(--color-borderPrimary)'
              }}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-textOnPrimary)'
              }}
            >
              <Plus size={20} />
              Add
            </button>
          </form>
        </div>

        {/* Words List */}
        <div className="rounded-lg shadow" style={{ backgroundColor: 'var(--color-cardBg)' }}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Words ({words.length})
            </h2>
            <div className="space-y-3">
              {words.map((word) => (
                <div key={word.id} className="flex items-center gap-3 group">
                  <input
                    type="text"
                    defaultValue={word.wordEn}
                    onBlur={(e) => handleUpdateWord(word.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur();
                      }
                    }}
                    className="flex-1 p-3 border rounded-lg text-lg transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-inputBg)',
                      color: 'var(--color-textPrimary)',
                      borderColor: saving[word.id] ? 'var(--color-primary)' : 'var(--color-borderPrimary)'
                    }}
                    disabled={saving[word.id]}
                  />
                  {saving[word.id] && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
                  )}
                  <button
                    onClick={() => handleDeleteWord(word.id)}
                    className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-2"
                    title="Delete word"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
