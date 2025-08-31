// Theme configuration with all color definitions
export const themes = {
  dark: {
    name: 'Dark',
    colors: {
      // Background colors
      bgPrimary: '#1f2937', // gray-800
      bgSecondary: '#111827', // gray-900
      bgTertiary: '#374151', // gray-700
      bgHover: '#4b5563', // gray-600
      
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#9ca3af', // gray-400
      textMuted: '#6b7280', // gray-500
      
      // Border colors
      borderPrimary: '#374151', // gray-700
      borderSecondary: '#4b5563', // gray-600
      
      // Accent colors
      accentPrimary: '#3b82f6', // blue-500
      accentHover: '#2563eb', // blue-600
      accentSuccess: '#10b981', // green-500
      accentDanger: '#ef4444', // red-500
      
      // Component specific
      headerBg: '#111827', // gray-900
      cardBg: '#1f2937', // gray-800
      inputBg: '#374151', // gray-700
      buttonBg: '#374151', // gray-700
      buttonHoverBg: '#4b5563', // gray-600
    }
  },
  light: {
    name: 'Light',
    colors: {
      // Background colors
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb', // gray-50
      bgTertiary: '#f3f4f6', // gray-100
      bgHover: '#e5e7eb', // gray-200
      
      // Text colors
      textPrimary: '#111827', // gray-900
      textSecondary: '#4b5563', // gray-600
      textMuted: '#6b7280', // gray-500
      
      // Border colors
      borderPrimary: '#d1d5db', // gray-300
      borderSecondary: '#e5e7eb', // gray-200
      
      // Accent colors
      accentPrimary: '#3b82f6', // blue-500
      accentHover: '#2563eb', // blue-600
      accentSuccess: '#10b981', // green-500
      accentDanger: '#ef4444', // red-500
      
      // Component specific
      headerBg: '#ffffff',
      cardBg: '#f9fafb', // gray-50
      inputBg: '#f3f4f6', // gray-100
      buttonBg: '#e5e7eb', // gray-200
      buttonHoverBg: '#d1d5db', // gray-300
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      // Background colors
      bgPrimary: '#0f172a', // slate-900
      bgSecondary: '#020617', // slate-950
      bgTertiary: '#1e293b', // slate-800
      bgHover: '#334155', // slate-700
      
      // Text colors
      textPrimary: '#f1f5f9', // slate-100
      textSecondary: '#94a3b8', // slate-400
      textMuted: '#64748b', // slate-500
      
      // Border colors
      borderPrimary: '#334155', // slate-700
      borderSecondary: '#475569', // slate-600
      
      // Accent colors
      accentPrimary: '#8b5cf6', // violet-500
      accentHover: '#7c3aed', // violet-600
      accentSuccess: '#10b981', // green-500
      accentDanger: '#ef4444', // red-500
      
      // Component specific
      headerBg: '#020617', // slate-950
      cardBg: '#0f172a', // slate-900
      inputBg: '#1e293b', // slate-800
      buttonBg: '#1e293b', // slate-800
      buttonHoverBg: '#334155', // slate-700
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      // Background colors
      bgPrimary: '#083344', // cyan-950-ish
      bgSecondary: '#0c4a6e', // sky-900
      bgTertiary: '#075985', // sky-800
      bgHover: '#0369a1', // sky-700
      
      // Text colors
      textPrimary: '#f0f9ff', // sky-50
      textSecondary: '#7dd3c0', // teal-300
      textMuted: '#5eead4', // teal-300
      
      // Border colors
      borderPrimary: '#0e7490', // cyan-700
      borderSecondary: '#06b6d4', // cyan-500
      
      // Accent colors
      accentPrimary: '#06b6d4', // cyan-500
      accentHover: '#0891b2', // cyan-600
      accentSuccess: '#34d399', // emerald-400
      accentDanger: '#f87171', // red-400
      
      // Component specific
      headerBg: '#0c4a6e', // sky-900
      cardBg: '#083344', // cyan-950-ish
      inputBg: '#075985', // sky-800
      buttonBg: '#075985', // sky-800
      buttonHoverBg: '#0369a1', // sky-700
    }
  }
};

export const defaultTheme = 'dark';
