"use client";
import { useState } from 'react';

/**
 * Theme creation form component
 * 
 * Props:
 * - onSubmit: Function - Called when form is submitted with theme data
 * - onCancel: Function - Called when cancel button is clicked
 */
export const ThemeForm = ({ onSubmit, onCancel }) => {
  const [nameEn, setNameEn] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameEn.trim()) {
      // Generate type from nameEn: lowercase and replace spaces with dashes
      const type = nameEn.toLowerCase().replace(/\s+/g, '-');
      onSubmit({ nameEn, type });
      setNameEn(''); // Reset form
    }
  };

  return (
    <div 
      className="p-6 rounded-lg shadow mb-6" 
      style={{ backgroundColor: 'var(--color-cardBg)' }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          <div className="w-full max-w-md">
            <label 
              className="block text-sm font-medium mb-1" 
              style={{ color: 'var(--color-textPrimary)' }}
            >
              Theme Name (required)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full p-2 border rounded"
              style={{ 
                backgroundColor: 'var(--color-inputBg)',
                color: 'var(--color-textPrimary)',
                borderColor: 'var(--color-borderPrimary)'
              }}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-textOnPrimary)'
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-textOnSecondary)'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
