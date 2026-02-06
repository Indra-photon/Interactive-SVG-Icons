'use client';

import { useState } from 'react';
import { IconRefreshStroke } from '../stroke';

export function StrokeRefreshButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAnimating(true);
      // Auto-reset after animation completes (1500ms)
      setTimeout(() => setIsAnimating(false), 1500);
    }, 60);
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 border border-stone-300 rounded-3xl transition-colors tracking-tighter"
    >
      <span className={` font-medium ${isAnimating ? 'text-neutral-300' : 'text-neutral-900'} transition-colors duration-300 ease-out`}>Refresh</span>
      <IconRefreshStroke size={20} isAnimating={isAnimating} />
    </button>
  );
}