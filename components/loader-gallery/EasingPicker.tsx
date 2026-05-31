'use client';

import { useEffect, useRef, useState } from 'react';
import { EASINGS, EASING_GROUPS, easingPath, findEasingByValue, type EasingEntry } from '@/lib/easings';

interface EasingPickerProps {
  value: any;
  onChange: (value: any) => void;
}

function EasingCurve({ points, size = 40, className = '' }: {
  points: readonly [number, number, number, number];
  size?: number;
  className?: string;
}) {
  const H = size * 0.8;
  const W = size;
  const [x1, y1, x2, y2] = points;
  const d = `M 0,${H} C ${x1 * W},${(1 - y1) * H} ${x2 * W},${(1 - y2) * H} ${W},0`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={className} fill="none">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EasingPicker({ value, onChange }: EasingPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = findEasingByValue(value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-colors text-left group"
      >
        {selected ? (
          <>
            <span className="text-stone-600 shrink-0">
              <EasingCurve points={selected.points} size={28} />
            </span>
            <span className="text-sm font-mono text-stone-800 flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-sm text-stone-400 flex-1">custom</span>
        )}
        <svg className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden min-w-[320px]">
          {EASING_GROUPS.map(group => {
            const items = EASINGS.filter(e => e.group === group.key);
            return (
              <div key={group.key}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400 bg-stone-50 border-b border-stone-100">
                  {group.label}
                </div>
                <div className="grid grid-cols-4 p-1 gap-0.5">
                  {items.map(entry => {
                    const isSelected = selected?.name === entry.name;
                    return (
                      <button
                        key={entry.name}
                        onClick={() => { onChange(entry.value); setOpen(false); }}
                        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all hover:bg-stone-50 ${
                          isSelected ? 'bg-stone-900 text-white hover:bg-stone-800' : 'text-stone-600'
                        }`}
                        title={entry.name}
                      >
                        <EasingCurve
                          points={entry.points}
                          size={36}
                          className={isSelected ? 'text-white' : 'text-stone-700'}
                        />
                        <span className="text-[10px] font-medium truncate w-full text-center leading-none">
                          {entry.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
