'use client';

import { useState } from 'react';
import { IconAlarmRing } from '../default';

export function RingAlarmButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-300 text-stone-800 rounded-lg font-medium tracking-tight text-sm"
    >
      <IconAlarmRing size={18} isHovered={isHovered} />
      <span>Set Alarm</span>
    </button>
  );
}