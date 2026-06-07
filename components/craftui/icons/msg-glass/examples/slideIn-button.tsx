'use client';

import { useState } from 'react';
import { IconMessagesSlideIn } from '../slideIn';

export function SlideInButton() {
  const [isVisible, setIsVisible] = useState(true);

  const handleToggle = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleToggle}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 border-2 border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm hover:bg-stone-200 transition-colors"
      >
        <IconMessagesSlideIn size={20} isVisible={isVisible} />
        <span>Open Chat</span>
      </button>

      <p className="text-xs text-stone-500">
        Click to replay slide-in animation
      </p>
    </div>
  );
}