'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconHome } from '../default';

export interface DefaultButtonProps {
  selectedIconColor?: string;
}

export function DefaultButton({ 
  selectedIconColor = '#ffffff'
}: DefaultButtonProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <motion.button
      onClick={() => setIsSelected(!isSelected)}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        transition-colors duration-100
        ${isSelected 
          ? 'bg-stone-300 text-neutral-900' 
          : 'bg-stone-100 text-neutral-700'
        }
      `}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <IconHome 
        size={20} 
        isSelected={isSelected}
        color={isSelected ? selectedIconColor : 'currentColor'}
      />
      <motion.span
        animate={{ opacity: isSelected ? 1 : 0.8 }}
        transition={{ duration: 0.1 }}
      >
        Home
      </motion.span>
    </motion.button>
  );
}