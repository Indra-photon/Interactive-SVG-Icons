'use client';

import { useEffect, useRef } from 'react';

export interface AlarmTickProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
}

const LONG_ARM  = 'M11 13 L11 10 A1 1 0 0 1 13 10 L13 13 Z';
const SHORT_ARM = 'M12 12 L15 12 Q16 12 16 13 Q16 14 15 14 L12 14 Z';

const PIVOT_X = 12;
const PIVOT_Y = 13;

const randomDelta = () => Math.floor(Math.random() * 280) + 40;

export function IconAlarmTick({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false,
  onAnimationComplete,
}: AlarmTickProps) {
  const animRef    = useRef<SVGAnimateTransformElement>(null);
  const totalAngle = useRef(0);
  const duration   = useRef(0.7);

  useEffect(() => {
    if (!isAnimating || !animRef.current) return;

    const delta = randomDelta();
    const from  = totalAngle.current;
    totalAngle.current += delta;
    duration.current = 0.6 + delta / 600;

    const el = animRef.current;
    el.setAttribute('from', `${from} ${PIVOT_X} ${PIVOT_Y}`);
    el.setAttribute('to',   `${totalAngle.current} ${PIVOT_X} ${PIVOT_Y}`);
    el.setAttribute('dur',  `${duration.current}s`);
    el.beginElement();

    const timeout = setTimeout(() => {
      onAnimationComplete?.();
    }, duration.current * 1000);

    return () => clearTimeout(timeout);
  }, [isAnimating]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <defs>
        <mask id="alarm-tick-mask">
          <rect width="24" height="24" fill="white" />

          {/* stroke="black" + strokeWidth is required for strokeLinejoin to render */}
          <path
            d={LONG_ARM}
            fill="black"
            stroke="black"
            strokeWidth="0.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <animateTransform
              ref={animRef}
              attributeName="transform"
              type="rotate"
              from={`0 ${PIVOT_X} ${PIVOT_Y}`}
              to={`0 ${PIVOT_X} ${PIVOT_Y}`}
              dur="0.7s"
              begin="indefinite"
              fill="freeze"
              calcMode="spline"
              keyTimes="0;1"
              keySplines="0.4 0 0.2 1"
            />
          </path>

          <path
            d={SHORT_ARM}
            fill="black"
            stroke="black"
            strokeWidth="0.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <path stroke="none" d="M0 0h24v24H0z" fill="none" />

      <path
        mask="url(#alarm-tick-mask)"
        d="M16 6.072a8 8 0 1 1 -11.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 11.995 -6.643z"
      />
      <path d="M6.412 3.191a1 1 0 0 1 1.273 1.539l-.097 .08l-2.75 2a1 1 0 0 1 -1.273 -1.54l.097 -.08l2.75 -2z" />
      <path d="M16.191 3.412a1 1 0 0 1 1.291 -.288l.106 .067l2.75 2a1 1 0 0 1 -1.07 1.685l-.106 -.067l-2.75 -2a1 1 0 0 1 -.22 -1.397z" />
    </svg>
  );
}