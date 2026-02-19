'use client';

import { useState } from 'react';
import { IconLockUnlock } from '../unlock';

export function UnlockButton() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm">
      {/* Content Card */}
      <button
        onMouseEnter={() => setIsUnlocked(true)}
        onMouseLeave={() => setIsUnlocked(false)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 text-stone-900 rounded-lg font-medium tracking-tight text-sm cursor-pointer"
        
      >
        <IconLockUnlock size={18} isUnlocked={isUnlocked} />
        <span>Unlock Premium</span>
    </button>
    </div>
  );
}