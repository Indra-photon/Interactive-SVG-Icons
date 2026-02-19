'use client';

import { useState } from 'react';
import { IconAlarmTick } from '../tick';

export function TickAlarmButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm"
    >
      <IconAlarmTick
        size={18}
        isAnimating={isAnimating}
        onAnimationComplete={() => setIsAnimating(false)}
      />
      <span>Set Alarm</span>
    </button>
  );
}