'use client';

import { useState } from 'react';
import { IconMessagesWiggle } from '../wiggle';

export function WiggleButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <div className="flex flex-col gap-3">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setUnreadCount(0)}
        className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 border-2 border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm hover:bg-stone-200 transition-colors"
      >
        <IconMessagesWiggle size={20} isHovered={isHovered} />
        <span>Messages</span>
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <p className="text-xs text-stone-500">
        Hover to see wiggle animation • Click to clear unread
      </p>
    </div>
  );
}