"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * Component for adding new words to a theme
 * 
 * Props:
 * - onSubmit: Function - Called when form is submitted with the new word
 */
export const AddNewWord = ({ onSubmit }) => {
  const [newWord, setNewWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newWord.trim()) {
      onSubmit(newWord.trim());
      setNewWord(''); // Reset form
    }
  };

  return (
    <div 
      className="p-6 rounded-lg shadow mb-6" 
      style={{ backgroundColor: 'var(--color-cardBg)' }}
    >
      <h2 
        className="text-xl font-semibold mb-4" 
        style={{ color: 'var(--color-textPrimary)' }}
      >
        Add New Word
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
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
  );
};
