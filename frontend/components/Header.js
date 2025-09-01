"use client";
import { SkinSwitcher } from '@/components/SkinSwitcher';
import { Settings2, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--color-headerBg)', borderBottom: '1px solid var(--color-borderPrimary)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-left" style={{ color: 'var(--color-textPrimary)' }}>Liar</h1>
        <div className="flex items-center gap-4">
          {isSettingsPage && <SkinSwitcher inHeader={true} />}
          {isSettingsPage ? (
            <Link
              href="/"
              className="p-2 rounded transition-colors hover:opacity-75"
              style={{ 
                color: 'var(--color-textPrimary)',
                backgroundColor: 'var(--color-inputBg)',
                border: '1px solid var(--color-borderSecondary)'
              }}
              aria-label="Close settings"
            >
              <X size={20} />
            </Link>
          ) : (
            <Link
              href="/settings"
              className="p-2 rounded transition-colors hover:opacity-75"
              style={{ 
                color: 'var(--color-textPrimary)',
                backgroundColor: 'var(--color-inputBg)',
                border: '1px solid var(--color-borderSecondary)'
              }}
              aria-label="Settings"
            >
              <Settings2 size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
