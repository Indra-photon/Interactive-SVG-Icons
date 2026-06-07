'use client';

import { useState } from 'react';
import { IconRefresh } from '../default';

export function DefaultRefreshButton() {
  const [isAnimating, setIsAnimating] = useState(false);

//   Integrate your real function here 
  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // fake async action duration
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 border border-stone-300 rounded-3xl hover:bg-stone-300 transition-colors tracking-tighter"
    >
      <span className="text-neutral-900 font-medium">Refresh</span>
      <IconRefresh size={20} isAnimating={isAnimating} />
    </button>
  );
}