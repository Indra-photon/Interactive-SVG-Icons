'use client';

import { useState, useRef, useEffect } from 'react';

export interface RefreshIconDashProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconRefreshDash({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: RefreshIconDashProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const bottompath = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [bottompathLength, setbottompathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current && bottompath.current) {
      const length = pathRef.current.getTotalLength();
      const bottomlength = bottompath.current.getTotalLength();
      setPathLength(length);
      setbottompathLength(bottomlength);
    }
  }, []);

  const DASH_LENGTH = 10;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <style>
        {`
          @keyframes dash-travel-top {
            from {
              stroke-dashoffset: ${DASH_LENGTH};
            }
            to {
              stroke-dashoffset: ${-pathLength};
            }
          }

          @keyframes dash-travel-bottom {
            from {
              stroke-dashoffset: ${DASH_LENGTH};
            }
            to {
              stroke-dashoffset: ${-bottompathLength};
            }
          }

          .animate-dash-top {
            animation: dash-travel-top 0.9s linear infinite;
          }

          .animate-dash-bottom {
            animation: dash-travel-bottom 0.6s linear infinite;
          }
        `}
      </style>

      <path stroke="none" d="M0 0h24v24H0z" fill="none" />

      {/* Background paths */}
      <path
        d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
        opacity="0.2"
      />

      <path
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        opacity="0.2"
      />

      {/* Animated dashed paths */}
      <path
        ref={pathRef}
        d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
        strokeDasharray={`${DASH_LENGTH} ${pathLength}`}
        strokeDashoffset={DASH_LENGTH}
        className={isAnimating ? "animate-dash-top" : ""}
      />

      <path
        ref={bottompath}
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        strokeDasharray={`${DASH_LENGTH} ${bottompathLength}`}
        strokeDashoffset={DASH_LENGTH}
        className={isAnimating ? "animate-dash-bottom" : ""}
      />
    </svg>
  );
}