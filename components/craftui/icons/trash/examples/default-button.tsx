'use client';

import { useState } from 'react';
import { TrashIcon } from '../default';
import {motion} from 'motion/react';

export function DefaultDeleteButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDelete = () => {
    setIsAnimating(true);
    
    // ⚠️ DEMO ONLY: Using setTimeout to simulate backend API call
    // In your real application, replace this with your actual backend logic:
    // 
    // Example with fetch:
    // const response = await fetch('/api/delete', { method: 'DELETE' });
    // setIsAnimating(false);
    //
    // Example with React Query:
    // const { mutate, isPending } = useMutation({ ... });
    // <TrashIcon isAnimating={isPending} />
    //
    setTimeout(() => {
      setIsAnimating(false);
      // Your success/error handling here
    }, 2000);
  };

  return (
    <motion.button 
      onClick={handleDelete}
      disabled={isAnimating}
      transition={{duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
      layout
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
    >
      <TrashIcon size={20} isAnimating={isAnimating} />
      <motion.span layoutId='delete-text'
      animate={{ opacity: isAnimating ? 0.5 : 1 }}
      transition={{ duration: 0.1, type: 'spring', stiffness: 300, damping: 25 }}>
        {isAnimating ? 'Deleting...' : 'Delete'}
      </motion.span>
    </motion.button>
  );
}