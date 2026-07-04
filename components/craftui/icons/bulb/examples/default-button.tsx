'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconBulb } from '../default';

export function DefaultButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
        className="
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-amber-50 text-amber-900 hover:bg-amber-100
          border border-amber-200
          transition-colors duration-200
        "
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        <IconBulb
          size={20}
          isActive={isHovered}
          color="#f59e0b"
        />
        <motion.span
        initial={{ opacity: 0.9, y: 5, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="font-bold">
          Show Tip
        </motion.span>
      </motion.button>
    </div>
  );
}