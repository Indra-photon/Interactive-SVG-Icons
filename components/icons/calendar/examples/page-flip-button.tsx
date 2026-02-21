'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { IconCalendarPageFlip } from '../page-flip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function PageFlipButton() {
  const [currentMonth, setCurrentMonth] = useState(1); // February
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth((prev) => (prev + 1) % 12);
      setIsFlipping(false);
    }, 600);
  };

  const handlePrevious = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth((prev) => (prev - 1 + 12) % 12);
      setIsFlipping(false);
    }, 600);
  };

  return (
    <motion.div 
      layout
      className="flex flex-col gap-3 max-w-xs"
    >
      {/* Month Display Card */}
      <motion.div 
        layout
        className="p-6 bg-stone-100 border-2 border-stone-300 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevious}
            disabled={isFlipping}
            className="p-2 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-stone-700" />
          </button>

          <motion.div
            key={currentMonth}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <IconCalendarPageFlip size={32} isFlipping={isFlipping} />
            <motion.h3 
              layout
              className="text-lg font-semibold text-stone-900 mt-2"
            >
              {months[currentMonth]}
            </motion.h3>
          </motion.div>

          <button
            onClick={handleNext}
            disabled={isFlipping}
            className="p-2 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-stone-700" />
          </button>
        </div>
      </motion.div>

      <p className="text-xs text-stone-500 text-center">
        Use arrows to flip through months
      </p>
    </motion.div>
  );
}