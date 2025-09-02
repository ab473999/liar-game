"use client";
import { SkinSwitcher } from '@/components/functional/skin_switcher/SkinSwitcher';
import { IconButton } from '@/components/ui/IconButton';
import { Settings2, X, ArrowLeft } from 'lucide-react';
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
            <IconButton
              href={isSettingsPage ? "/" : "/settings"}
              icon={<ArrowLeft size={20} />}
              ariaLabel={isSettingsPage ? "Back to home" : "Back to themes"}
              size="sm"
            />
          )}
        </div>

        {/* Center - Title */}
        <h1 className="text-2xl font-thin absolute left-1/2 transform -translate-x-1/2" style={{ color: 'var(--color-textPrimary)' }}>LIAR</h1>

        {/* Right side - Settings/Close button */}
        <div className="w-12 flex justify-end">
          {isSettingsPage && <SkinSwitcher inHeader={true} />}
          {!isSettingsPage && !isGamePage && (
            <IconButton
              href="/settings"
              icon={<Settings2 size={20} />}
              ariaLabel="Settings"
              size="sm"
            />
          )}
        </div>
      </div>
    </header>
  );
};
