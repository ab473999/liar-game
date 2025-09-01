"use client";

export default function Settings() {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[400px]">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
        Settings
      </h1>
      <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>
        Placeholder settings to edit themes and words
      </p>
    </div>
  );
}
