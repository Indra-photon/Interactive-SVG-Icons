'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconDownload } from '../default';

export function DownloadButton() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDownload = () => {
    setIsAnimating(true);

    // ⚠️ DEMO ONLY: Using setTimeout to simulate a download trigger.
    // In your real application, replace this with your actual download logic:
    //
    // Example with fetch:
    //   const response = await fetch('/api/file');
    //   const blob = await response.blob();
    //   setIsAnimating(false);
    //
    // Example with React Query:
    //   const { mutate, isPending } = useMutation({ ... });
    //   <IconDownload isAnimating={isPending} />
    //
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isAnimating}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-2 px-5 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
    >
      <IconDownload size={20} isAnimating={isAnimating} />
      Download
    </motion.button>
  );
}
