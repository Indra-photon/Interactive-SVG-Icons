'use client';

import dynamic from 'next/dynamic';
import React, { useState, useCallback, useMemo } from 'react';
import type { PropDefinition } from '@/types/icon';

interface IconPreviewProps {
  iconSlug: string;
  variationName: string;
  animationType: string;
  props: PropDefinition[];
  propValues: Record<string, any>;
}

export function IconPreview({
  iconSlug,
  variationName,
  animationType,
  props,
  propValues,
}: IconPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = useMemo(
    () =>
      dynamic(
        () =>
          import(`@/components/craftui/icons/${iconSlug}/${variationName}.tsx`)
            .then(mod => {
              const exported = mod[Object.keys(mod)[0]];
              return { default: exported as React.ComponentType<Record<string, any>> };
            })
            .catch(() => ({
              default: (() => <div className="text-4xl">📦</div>) as React.ComponentType<Record<string, any>>,
            })),
        {
          ssr: false,
          loading: () => (
            <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-700 animate-pulse" />
          ),
        }
      ) as React.ComponentType<Record<string, any>>,
    [iconSlug, variationName],
  );

  const handleClick = useCallback(() => {
    if (animationType !== 'hover') {
      setIsAnimating(false);
      // two rAFs ensure React flushes the false before setting true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    }
  }, [animationType]);

  // Detect which trigger boolean props the icon accepts and inject local state.
  // Booleans are excluded from DialKit so propValues won't contain them.
  const hasProp = (name: string) => props.some(p => p.name === name);

  const triggerProps: Record<string, boolean> = {};
  if (hasProp('isHovered')) triggerProps.isHovered = isHovered;
  if (hasProp('isAnimating')) triggerProps.isAnimating = isAnimating;
  if (hasProp('isActive')) triggerProps.isActive = isHovered || isAnimating;
  if (hasProp('isOpen')) triggerProps.isOpen = isHovered;
  if (hasProp('isSelected')) triggerProps.isSelected = isAnimating;
  if (hasProp('isLoading')) triggerProps.isLoading = isAnimating;
  if (hasProp('isAdding')) triggerProps.isAdding = isAnimating;
  if (hasProp('isFlipping')) triggerProps.isFlipping = isAnimating;
  if (hasProp('hasNotification')) triggerProps.hasNotification = isAnimating;
  if (hasProp('isVisible')) triggerProps.isVisible = true;
  if (hasProp('isUnlocked')) triggerProps.isUnlocked = isAnimating;
  if (hasProp('isTyping')) triggerProps.isTyping = isAnimating;

  // Key-driven icons (e.g. calendar slide-month) re-animate when the key changes
  const keyProps: Record<string, number> = {};
  if (hasProp('monthKey')) keyProps.monthKey = isAnimating ? 1 : 0;

  const hint =
    animationType === 'hover'
      ? 'hover to animate'
      : animationType === 'click' || animationType === 'select'
      ? 'click to animate'
      : animationType === 'notification' || animationType === 'loading'
      ? 'click to trigger'
      : '';

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 cursor-pointer select-none"
      onClick={handleClick}
      onMouseEnter={() => animationType === 'hover' && setIsHovered(true)}
      onMouseLeave={() => animationType === 'hover' && setIsHovered(false)}
    >
      <IconComponent
        {...propValues}
        {...triggerProps}
        {...keyProps}
        className=""
      />
      {hint && (
        <p className="text-[11px] font-mono text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
