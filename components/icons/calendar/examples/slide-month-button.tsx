'use client';

import { useState } from 'react';
import { IconCalendarSlideMonth } from '../slide-month';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function SlideMonthButton() {
  const [currentMonth, setCurrentMonth] = useState(1); // February

  const handleNext = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
  };

  const handlePrevious = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
  };

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      {/* Month Display Card */}
      <div className="p-6 bg-stone-100 border-2 border-stone-300 rounded-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-stone-700" />
          </button>

          <div className="flex flex-col items-center gap-2">
            <IconCalendarSlideMonth 
              size={36} 
              monthKey={currentMonth} 
            />
            <h3 className="text-lg font-semibold text-stone-900">
              {months[currentMonth]}
            </h3>
          </div>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-stone-700" />
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-500 text-center">
        Navigate months to see slide animation
      </p>
    </div>
  );
}