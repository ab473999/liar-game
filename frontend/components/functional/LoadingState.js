"use client";
import { Loader2 } from "lucide-react";

/**
 * Reusable loading state component
 * 
 * Props:
 * - title?: string - Main loading text (default: "Loading...")
 * - subtitle?: string - Secondary text (default: "Getting things ready for you...")
 */
export const LoadingState = ({ 
  title = "Loading...",
  subtitle = "Getting things ready for you..."
}) => {
  return (
    <section className="text-center flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 
        className="w-12 h-12 animate-spin" 
        style={{ color: 'var(--color-accentPrimary)' }} 
      />
      <div>
        <h2 
          className="text-xl font-semibold mb-2" 
          style={{ color: 'var(--color-textPrimary)' }}
        >
          {title}
        </h2>
        <p 
          className="text-sm" 
          style={{ color: 'var(--color-textMuted)' }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};
