'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconCopyCheck } from '../default';

export function DefaultButton() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    // Copy text to clipboard
    await navigator.clipboard.writeText('Hello, this is copied text!');
    
    setIsCopied(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      disabled={isCopied}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        transition-colors duration-200
        ${isCopied 
          ? 'bg-stone-600 text-white cursor-default' 
          : 'bg-stone-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      layout
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <IconCopyCheck 
        size={20} 
        isCopied={isCopied}
        color={isCopied ? 'white' : 'currentColor'}
      />
      <motion.span
        initial={{ opacity: 0.9, y: 5, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {isCopied ? 'Copied!' : 'Copy Text'}
      </motion.span>
    </motion.button>
  );
}