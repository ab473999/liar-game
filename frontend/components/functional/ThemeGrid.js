"use client";
import { ThemeBox } from "@/components/ui/ThemeBox";

/**
 * Grid layout for theme selection
 * Always displays themes in a 3-column grid
 * 
 * Props:
 * - themes: Array<Theme> - Array of theme objects
 * - onThemeSelect?: Function - Handler when theme is selected
 * - linkTo?: string - Base path for theme links (e.g., "/settings/")
 */
export const ThemeGrid = ({ 
  themes, 
  onThemeSelect,
  linkTo
}) => {
  // Filter out invalid themes
  const validThemes = themes.filter(theme => 
    theme && theme.type && typeof theme.type === 'string'
  );

  return (
    <div className="w-full">
      {/* 
        Mobile: Break out of parent constraints with negative margins
        Desktop: Constrain to max-w-2xl (672px)
      */}
      <div className="relative -mx-8 px-4 sm:mx-0 sm:px-0">
        <div className="sm:max-w-2xl sm:mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">
            {validThemes.map((theme) => {
          // Determine the display name
          const themeName = theme.typeEn || theme.nameEn || theme.name || theme.type;
          
          // If linkTo is provided, create links
          if (linkTo) {
            return (
              <ThemeBox
                key={theme.id || theme.type}
                theme={theme}
                href={`${linkTo}${theme.type}`}
                displayName={themeName}
              />
            );
          }
          
          // Otherwise, handle onClick
          return (
            <ThemeBox
              key={theme.id || theme.type}
              theme={theme}
              href="/game"
              onClick={() => onThemeSelect && onThemeSelect(theme)}
              displayName={themeName}
            />
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
};
