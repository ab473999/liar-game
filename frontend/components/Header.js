"use client";
import { SkinSwitcher } from '@/components/SkinSwitcher';
import { Settings2, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';
  const isThemePage = pathname.startsWith('/settings/');
  const isGamePage = pathname === '/game';

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'var(--color-headerBg)', borderBottom: '1px solid var(--color-borderPrimary)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Left side - Back button or empty space */}
        <div className="w-12 flex justify-start">
          {(isSettingsPage || isThemePage) && (
            <Link
              href={isSettingsPage ? "/" : "/settings"}
              className="p-2 rounded transition-colors hover:opacity-75"
              style={{ 
                color: 'var(--color-textPrimary)',
                backgroundColor: 'var(--color-inputBg)',
                border: '1px solid var(--color-borderSecondary)'
              }}
              aria-label={isSettingsPage ? "Back to home" : "Back to themes"}
            >
              <ArrowLeft size={20} />
            </Link>
          )}
        </div>

        {/* Center - Title */}
        <h1 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2" style={{ color: 'var(--color-textPrimary)' }}>Liar</h1>

        {/* Right side - Settings/Close button */}
        <div className="w-12 flex justify-end">
          {isSettingsPage && <SkinSwitcher inHeader={true} />}
          {!isSettingsPage && !isGamePage && (
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
