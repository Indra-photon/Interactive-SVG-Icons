'use client';

import { useState } from 'react';
import { IconMessagesTyping } from '../typing';
import {motion} from 'motion/react';

export function TypingButton() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex flex-col gap-3 max-w-sm">
      <motion.button
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        onClick={() => setIsTyping(!isTyping)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 border-2 border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm hover:bg-stone-200 transition-colors"
      >
        <IconMessagesTyping size={20} isTyping={isTyping} />
        <motion.span
          initial={{ filter: 'blur(4px)' }}
          animate={{ filter: 'blur(0px)' }}
          transition={{ duration: 0.2 }}
          className={`text-sm font-medium ${isTyping ? 'text-stone-400' : 'text-stone-800'}`}
        >
          {isTyping ? 'Someone is typing...' : 'Start Typing'}
        </motion.span>
      </motion.button>

      <p className="text-xs text-stone-500">
        Click to toggle typing indicator
      </p>
    </div>
  );
}