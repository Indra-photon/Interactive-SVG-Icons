'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconMail } from '../default';

export function DefaultButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-blue-50 text-blue-900 hover:bg-blue-100
        border border-blue-200
        transition-colors duration-200
      "
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
    >
      <IconMail 
        size={20} 
        isOpen={isHovered}
        color="#3b82f6" // blue-500
      />
      <span className="font-medium">
        Inbox
      </span>
    </motion.button>
  );
}