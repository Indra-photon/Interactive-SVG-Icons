'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconHome } from '../draw';

export function DrawButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-gray-100 text-gray-700 hover:bg-gray-200
        transition-colors duration-200
      "
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        ease: "easeOut",
        duration: 0.2
      }}
    >
      <IconHome 
        size={20} 
        color="currentColor"
        isHovered={isHovered}
      />
      <span>Go Home</span>
    </motion.button>
  );
}