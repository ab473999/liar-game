"use client";
import { useState, useEffect } from 'react';
import { useDatabase } from '../../hooks/useDatabase';
import { Plus } from 'lucide-react';
import { ThemeForm } from '@/components/functional/ThemeForm';
import { ThemeGrid } from '@/components/functional/ThemeGrid';
import { LoadingState } from '@/components/functional/LoadingState';

export default function Settings() {
  const { 
    loading, 
    error, 
    getThemes, 
    createTheme
  } = useDatabase();

  const [themes, setThemes] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);



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

  const handleCreateTheme = async (themeData) => {
    try {
      await createTheme(themeData);
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

        {loading && <LoadingState />}

        {/* Create Theme Form */}
        {showCreateForm && (
          <ThemeForm 
            onSubmit={handleCreateTheme}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Themes List */}
        <div className="rounded-lg" style={{ backgroundColor: 'var(--color-cardBg)' }}>
          <div className="p-6">
            <ThemeGrid 
              themes={themes}
              linkTo="/settings/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
