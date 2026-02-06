'use client';

import { useState } from 'react';
import { IconRefreshStroke } from '../stroke';

export function StrokeRefreshButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 60);
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 border border-stone-300 rounded-3xl hover:bg-stone-300 transition-colors tracking-tighter"
    >
      <span className="text-neutral-900 font-medium">Refresh</span>
      <IconRefreshStroke size={20} isAnimating={isAnimating} />
    </button>
  );
}