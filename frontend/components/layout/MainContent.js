"use client";

/**
 * Main content wrapper component
 * Provides consistent padding and spacing for page content
 * 
 * Props:
 * - children: React nodes to render
 */
export const MainContent = ({ children }) => {
  return (
    <main className="pt-16 min-h-screen flex flex-col items-center justify-center overflow-visible">
      <div className="max-w-lg mx-auto overflow-visible">{children}</div>
    </main>
  );
};
