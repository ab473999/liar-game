"use client";
import { useEffect } from 'react';

export const DocumentTitle = () => {
  useEffect(() => {
    // Always use English title
    document.title = 'Liar';
  }, []);
  
  return null; // This component doesn't render anything
};
