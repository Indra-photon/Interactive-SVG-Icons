// 'use client';

// import { useState, useRef, useEffect } from 'react';

// export interface RefreshIconStrokeProps {
//   size?: number;
//   color?: string;
//   className?: string;
//   isAnimating?: boolean;
// }

// export function IconRefreshStroke({
//   size = 24,
//   color = 'currentColor',
//   className = '',
//   isAnimating = false
// }: RefreshIconStrokeProps) {
//   const pathRef = useRef<SVGPathElement>(null);
//   const bottompath = useRef<SVGPathElement>(null);
//   const [pathLength, setPathLength] = useState(0);
//   const [bottompathLength, setbottompathLength] = useState(0);

//   useEffect(() => {
//     if (pathRef.current && bottompath.current) {
//       const length = pathRef.current.getTotalLength();
//       const bottomlength = bottompath.current.getTotalLength();
//       setPathLength(length);
//       setbottompathLength(bottomlength);
//     }
//   }, []);

//   const totalLength = pathLength + bottompathLength;
//   const topDuration = pathLength / totalLength;
//   const bottomDuration = bottompathLength / totalLength;
//   const totalDuration = 1.3;

//   const topAnimDuration = topDuration * totalDuration;
//   const bottomAnimDuration = bottomDuration * totalDuration;

//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke={color}
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       {/* <style>
//         {`
//           @keyframes dash-top {
//             from {
//               stroke-dashoffset: ${pathLength};
//             }
//             to {
//               stroke-dashoffset: 0;
//             }
//           }

//           @keyframes dash-bottom {
//             from {
//               stroke-dashoffset: ${bottompathLength};
//             }
//             to {
//               stroke-dashoffset: 0;
//             }
//           }

//           .animate-top-infinite {
//             animation: dash-top ${topAnimDuration}s linear infinite;
//           }

//           .animate-bottom-infinite {
//             animation: dash-bottom ${bottomAnimDuration}s linear ${topAnimDuration}s infinite;
//           }
//         `}
//       </style> */}
//       <style>
//         {`
//           @keyframes dash-alternate {
//             0% {
//               stroke-dashoffset: ${pathLength};
//             }
//             ${(topAnimDuration / (topAnimDuration + bottomAnimDuration)) * 100}% {
//               stroke-dashoffset: 0;
//             }
//             100% {
//               stroke-dashoffset: 0;
//             }
//           }

//           @keyframes dash-alternate-bottom {
//             0% {
//               stroke-dashoffset: ${bottompathLength};
//             }
//             ${(topAnimDuration / (topAnimDuration + bottomAnimDuration)) * 100}% {
//               stroke-dashoffset: ${bottompathLength};
//             }
//             100% {
//               stroke-dashoffset: 0;
//             }
//           }

//           .animate-alternate-top {
//             animation: dash-alternate ${totalDuration}s linear infinite;
//           }

//           .animate-alternate-bottom {
//             animation: dash-alternate-bottom ${totalDuration}s linear infinite;
//           }
//         `}
//       </style>

//       <path stroke="none" d="M0 0h24v24H0z" fill="none" />

//       {/* Background paths */}
//       <path
//         d="M20 11a8.1 8.1 0 0 0 -15.5 -2"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//         opacity="0.15"
//       />

//       <path
//         d="M4 13a8.1 8.1 0 0 0 15.5 2"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//         opacity="0.15"
//       />

//       {/* Animated paths - alternating */}
//       <path
//         ref={pathRef}
//         d="M20 11a8.1 8.1 0 0 0 -15.5 -2"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//         strokeDasharray={pathLength}
//         strokeDashoffset={pathLength}
//         className={isAnimating ? "animate-alternate-top" : ""}
//       />

//       <path
//         ref={bottompath}
//         d="M4 13a8.1 8.1 0 0 0 15.5 2"
//         stroke={color}
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         fill="none"
//         strokeDasharray={bottompathLength}
//         strokeDashoffset={bottompathLength}
//         className={isAnimating ? "animate-alternate-bottom" : ""}
//       />
//     </svg>
//   );
// }


// 'use client';

// import { useState, useRef, useEffect } from 'react';

// export interface RefreshIconStrokeProps {
//   size?: number;
//   color?: string;
//   className?: string;
//   isAnimating?: boolean;
// }

// export function IconRefreshStroke({
//   size = 24,
//   color = 'currentColor',
//   className = '',
//   isAnimating = false
// }: RefreshIconStrokeProps) {
//   const pathRef = useRef<SVGPathElement>(null);
//   const bottompathRef = useRef<SVGPathElement>(null);

//   const [pathLength, setPathLength] = useState(0);
//   const [bottomPathLength, setBottomPathLength] = useState(0);
//   const [shouldAnimate, setShouldAnimate] = useState(false);

//   const TOTAL_DURATION = 1.5;

//   // Measure path lengths
//   useEffect(() => {
//     if (pathRef.current && bottompathRef.current) {
//       setPathLength(pathRef.current.getTotalLength());
//       setBottomPathLength(bottompathRef.current.getTotalLength());
//     }
//   }, []);

//   // Start animation and auto-stop after 1500ms
//   useEffect(() => {
//     if (!isAnimating) {
//       setShouldAnimate(false);
//       return;
//     }

//     setShouldAnimate(true);

//     const timeout = setTimeout(() => {
//       setShouldAnimate(false);
//     }, TOTAL_DURATION * 3000);

//     return () => clearTimeout(timeout);
//   }, [isAnimating]);

//   const totalLength = pathLength + bottomPathLength || 1;
//   const topRatio = pathLength / totalLength;

//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={size}
//       height={size}
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke={color}
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <style>
//         {`
//           /* Stroke draw animations */
//           @keyframes dash-top {
//             from { stroke-dashoffset: ${pathLength}; }
//             to   { stroke-dashoffset: 0; }
//           }

//           @keyframes dash-bottom {
//             from { stroke-dashoffset: ${bottomPathLength}; }
//             to   { stroke-dashoffset: 0; }
//           }

//           /* Smooth opacity animation */
//           @keyframes fade-in-out {
//             0%   { opacity: 0; }
//             15%  { opacity: 1; }
//             85%  { opacity: 1; }
//             100% { opacity: 0; }
//           }

//           .animate-top {
//             animation:
//               dash-top ${TOTAL_DURATION * topRatio}s linear forwards,
//               fade-in-out ${TOTAL_DURATION}s ease-in-out forwards;
//             will-change: stroke-dashoffset, opacity;
//           }

//           .animate-bottom {
//             animation:
//               dash-bottom ${TOTAL_DURATION * (1 - topRatio)}s linear ${TOTAL_DURATION * topRatio}s forwards,
//               fade-in-out ${TOTAL_DURATION}s ease-in-out forwards;
//             will-change: stroke-dashoffset, opacity;
//           }
//         `}
//       </style>

//       {/* Invisible reset path */}
//       <path stroke="none" d="M0 0h24v24H0z" />

//       {/* Background paths */}
//       <path
//         d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
//         opacity="0.15"
//       />
//       <path
//         d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
//         opacity="0.15"
//       />

//       {/* Animated top stroke */}
//       <path
//         ref={pathRef}
//         d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"
//         strokeDasharray={pathLength}
//         strokeDashoffset={pathLength}
//         opacity={shouldAnimate ? 1 : 0}
//         className={shouldAnimate ? 'animate-top' : ''}
//       />

//       {/* Animated bottom stroke */}
//       <path
//         ref={bottompathRef}
//         d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
//         strokeDasharray={bottomPathLength}
//         strokeDashoffset={bottomPathLength}
//         opacity={shouldAnimate ? 1 : 0}
//         className={shouldAnimate ? 'animate-bottom' : ''}
//       />
//     </svg>
//   );
// }

'use client';

import { useEffect, useState } from 'react';

export interface RefreshIconStrokeProps {
  size?: number;
  color?: string;
  isAnimating?: boolean;
}

export function IconRefreshStroke({
  size = 24,
  color = 'currentColor',
  isAnimating = false
}: RefreshIconStrokeProps) {
  const [animate, setAnimate] = useState(false);

  // trigger animation whenever isAnimating changes
  useEffect(() => {
    if (isAnimating) {
      setAnimate(true);

      const timeout = setTimeout(() => {
        setAnimate(false);
      }, 1500); // match the total animation duration

      return () => clearTimeout(timeout);
    } else {
      setAnimate(false);
    }
  }, [isAnimating]);

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
    >
      <style>
        {`
          /* Top stroke animation */
          @keyframes dash-top {
            0% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 0; }
          }

          /* Bottom stroke animation */
          @keyframes dash-bottom {
            0% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 0; }
          }

          /* Fade animation */
          @keyframes fade {
            0%, 100% { opacity: 0; }
            15%, 85% { opacity: 1; }
          }

          .animate-top {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: dash-top 0.7s linear forwards, fade 1.5s ease-in-out forwards;
          }

          .animate-bottom {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: dash-bottom 0.8s linear 0.7s forwards, fade 1.5s ease-in-out forwards;
          }
        `}
      </style>

      {/* Invisible reset path */}
      <path stroke="none" d="M0 0h24v24H0z" />

      {/* Background paths (faint) */}
      <path
        d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
        opacity="0.15"
      />
      <path
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        opacity="0.15"
      />

      {/* Animated top stroke */}
      <path
        d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
        className={animate ? 'animate-top' : ''}
        opacity={animate ? 1 : 0}
      />

      {/* Animated bottom stroke */}
      <path
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        className={animate ? 'animate-bottom' : ''}
        opacity={animate ? 1 : 0}
      />
    </svg>
  );
}


