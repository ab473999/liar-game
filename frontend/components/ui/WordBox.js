"use client";
import { Trash2 } from 'lucide-react';

/**
 * Individual word row component for the words table
 * 
 * Props:
 * - word: Object with id and (wordEn or word field)
 * - onUpdate: Function - Called when word is updated
 * - onDelete: Function - Called when delete button is clicked
 * - saving: boolean - Whether this word is currently being saved
 */
export const WordBox = ({ 
  word, 
  onUpdate, 
  onDelete,
  saving = false
}) => {
  const handleBlur = (e) => {
    const currentValue = word.wordEn || word.word;
    if (onUpdate && e.target.value !== currentValue) {
      onUpdate(word.id, e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="flex items-center gap-3 group">
      <input
        type="text"
        defaultValue={word.wordEn || word.word}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 p-3 border rounded-lg text-lg transition-colors"
        style={{ 
          backgroundColor: 'var(--color-inputBg)',
          color: 'var(--color-textPrimary)',
          borderColor: saving ? 'var(--color-primary)' : 'var(--color-borderPrimary)'
        }}
        disabled={saving}
      />
      
      {saving && (
        <div 
          className="animate-spin rounded-full h-5 w-5 border-b-2" 
          style={{ borderColor: 'var(--color-primary)' }}
        />
      )}
      
      <button
        onClick={() => onDelete(word.id)}
        className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100 p-2"
        title="Delete word"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
