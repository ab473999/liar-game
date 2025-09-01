"use client";
import { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Settings() {
  const { 
    loading, 
    error, 
    getThemes, 
    createTheme
  } = useDatabase();

  const [themes, setThemes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [themeForm, setThemeForm] = useState({
    nameEn: ''
  });

  // Load themes on component mount
  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const themesData = await getThemes();
      setThemes(themesData);
    } catch (err) {
      console.error('Failed to load themes:', err);
    }
  };

  const handleCreateTheme = async (e) => {
    e.preventDefault();
    try {
      // Generate type from nameEn: lowercase and replace spaces with dashes
      const type = themeForm.nameEn.toLowerCase().replace(/\s+/g, '-');
      
      await createTheme({
        ...themeForm,
        type
      });
      setThemeForm({ nameEn: '' });
      setShowCreateForm(false);
      loadThemes();
    } catch (err) {
      console.error('Failed to create theme:', err);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto">
        {!showCreateForm && (
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                color: 'var(--color-textOnPrimary)' 
              }}
            >
              <Plus size={20} />
              Add Theme
            </button>
          </div>
        )}

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

        {/* Create Theme Form */}
        {showCreateForm && (
          <div className="p-6 rounded-lg shadow mb-6" style={{ backgroundColor: 'var(--color-cardBg)' }}>
            <form onSubmit={handleCreateTheme}>
              <div className="flex justify-center mb-4">
                <div className="w-full max-w-md">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-textPrimary)' }}>Theme Name (required)</label>
                  <input
                    type="text"
                    value={themeForm.nameEn}
                    onChange={(e) => setThemeForm({...themeForm, nameEn: e.target.value})}
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
                  onClick={() => setShowCreateForm(false)}
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
        )}

        {/* Themes List */}
        <div className="rounded-lg" style={{ backgroundColor: 'var(--color-cardBg)' }}>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/settings/${theme.type}`}
                  className="inline-block border border-white text-xs hover:opacity-75 h-16 flex items-center justify-center rounded-2xl px-2"
                >
                  {theme.nameEn}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
