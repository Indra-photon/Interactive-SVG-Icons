'use client';

import { useState } from 'react';
import { IconCalendarOpen } from '../picker-open';
import { Calendar as CalendarIcon } from 'lucide-react';

export function PickerOpenButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    // In a real app, this would trigger a date picker modal/popover
  };

  return (
    <div className="flex flex-col gap-3 max-w-xs">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 border-2 border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm hover:bg-stone-200 transition-colors"
      >
        <IconCalendarOpen size={20} isHovered={isHovered} />
        <span>Select Date</span>
      </button>

      {isOpen && (
        <div className="p-4 bg-stone-100 border-2 border-stone-300 rounded-lg">
          <p className="text-sm text-stone-700 text-center">
            📅 Date picker would open here
          </p>
        </div>
      )}

      <p className="text-xs text-stone-500 text-center">
        Hover to preview opening • Click to toggle picker
      </p>
    </div>
  );
}