"use client";
import { WordBox } from "@/components/ui/WordBox";

/**
 * Table/list of words for a theme
 * 
 * Props:
 * - words: Array - Array of word objects with id and wordEn
 * - onUpdate: Function - Called when a word is updated
 * - onDelete: Function - Called when a word is deleted
 * - savingIds?: Object - Object with word ids as keys, boolean as values for saving state
 */
export const WordsTable = ({ 
  words, 
  onUpdate, 
  onDelete,
  savingIds = {}
}) => {
  return (
    <div 
      className="rounded-lg shadow" 
      style={{ backgroundColor: 'var(--color-cardBg)' }}
    >
      <div className="p-6">
        <h2 
          className="text-xl font-semibold mb-4" 
          style={{ color: 'var(--color-textPrimary)' }}
        >
          Words ({words.length})
        </h2>
        <div className="space-y-3">
          {words.map((word) => (
            <WordBox
              key={word.id}
              word={word}
              onUpdate={onUpdate}
              onDelete={onDelete}
              saving={savingIds[word.id] || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
