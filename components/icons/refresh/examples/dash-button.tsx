'use client';

import { useState } from 'react';
import { IconRefreshDash } from '../dash';

export function DashRefreshButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAnimating(true);
      // Auto-stop after 2 seconds (enough for several loops)
      setTimeout(() => setIsAnimating(false), 2000);
    }, 60);
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 border border-stone-300 rounded-3xl transition-colors tracking-tighter"
    >
      <span className={`font-medium tracking-tighter transition-colors duration-300 ${isAnimating ? 'text-stone-300' : 'text-stone-900'}`}>
        Refresh
      </span>
      <IconRefreshDash size={20} isAnimating={isAnimating} />
    </button>
  );
}