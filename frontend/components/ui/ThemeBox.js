"use client";
import Link from 'next/link';

/**
 * Individual theme button component
 * 
 * Props:
 * - theme: Object with type, typeEn, typeKr, etc.
 * - onClick?: Function - Click handler
 * - href?: string - Link destination
 * - displayName?: string - Override display name
 */
export const ThemeBox = ({ 
  theme, 
  onClick, 
  href,
  displayName
}) => {
  // Determine the display name
  const name = displayName || theme.typeEn || theme.nameEn || theme.type;
  
  const baseClasses = "inline-block border border-white text-xs hover:opacity-75 h-16 flex items-center justify-center rounded-2xl px-2";
  
  // If it's a link
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={baseClasses}
      >
        {name}
      </Link>
    );
  }
  
  // If it's just a clickable div
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} cursor-pointer`}
    >
      {name}
    </div>
  );
};
