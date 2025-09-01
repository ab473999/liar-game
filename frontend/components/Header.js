"use client";
import { SkinSwitcher } from '@/components/SkinSwitcher';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--color-headerBg)', borderBottom: '1px solid var(--color-borderPrimary)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-left" style={{ color: 'var(--color-textPrimary)' }}>Liar</h1>
        <div className="flex items-center gap-4">
          <SkinSwitcher inHeader={true} />
        </div>
      </div>
    </header>
  );
};
