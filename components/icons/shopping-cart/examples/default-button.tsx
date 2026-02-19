'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconShoppingCart } from '../default';

export function DefaultButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  const handleAddToCart = () => {
    setIsAdding(true);
    setItemCount(prev => prev + 1);
  };

  useEffect(() => {
    if (isAdding) {
      const timer = setTimeout(() => {
        setIsAdding(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAdding]);

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handleAddToCart}
        disabled={isAdding}
        layout
        className="
          relative
          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          bg-stone-50 border-2 border-stone-300 
          text-stone-800 font-medium
          hover:bg-stone-100 hover:border-stone-400
          disabled:opacity-60 disabled:cursor-not-allowed
        "
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          duration: 0.8
        }}
      >
        <IconShoppingCart 
          size={20} 
          isAdding={isAdding}
        />
        <motion.span layout className="tracking-tight">
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </motion.span>
        
        {/* Item count badge */}
        {/* <AnimatePresence mode='wait'>
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            layout
            initial={{ scale: 0.8, opacity: 0.8, filter: 'blur(4px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0, opacity: 0, filter: 'blur(4px)' }}
            transition={{ ease: "easeOut", duration: 0.4, delay: 0.8 }}
            className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 bg-stone-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
          >
            {itemCount}
          </motion.span>
        )}
        </AnimatePresence> */}
      </motion.button>
    </div>
  );
}