// 'use client';

// import { useEffect, useState } from 'react';

// export interface RefreshIconStrokeProps {
//   size?: number;
//   color?: string;
//   isAnimating?: boolean;
// }

// export function IconRefreshStroke({
//   size = 24,
//   color = 'currentColor',
//   isAnimating = false
// }: RefreshIconStrokeProps) {
//   const [animate, setAnimate] = useState(false);

//   // trigger animation whenever isAnimating changes
//   useEffect(() => {
//     if (isAnimating) {
//       setAnimate(true);

//       const timeout = setTimeout(() => {
//         setAnimate(false);
//       }, 1500); // match the total animation duration

//       return () => clearTimeout(timeout);
//     } else {
//       setAnimate(false);
//     }
//   }, [isAnimating]);

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
//     >
//       <style>
//         {`
//           /* Top stroke animation */
//           @keyframes dash-top {
//             0% { stroke-dashoffset: 50; }
//             100% { stroke-dashoffset: 0; }
//           }

//           /* Bottom stroke animation */
//           @keyframes dash-bottom {
//             0% { stroke-dashoffset: 50; }
//             100% { stroke-dashoffset: 0; }
//           }

//           /* Fade animation */
//           @keyframes fade {
//             0%, 100% { opacity: 0; }
//             15%, 85% { opacity: 1; }
//           }

//           .animate-top {
//             stroke-dasharray: 50;
//             stroke-dashoffset: 50;
//             animation: dash-top 0.7s linear forwards, fade 1.5s ease-in-out forwards;
//           }

//           .animate-bottom {
//             stroke-dasharray: 50;
//             stroke-dashoffset: 50;
//             animation: dash-bottom 0.8s linear 0.7s forwards, fade 1.5s ease-in-out forwards;
//           }
//         `}
//       </style>

//       {/* Invisible reset path */}
//       <path stroke="none" d="M0 0h24v24H0z" />

//       {/* Background paths (faint) */}
//       <path
//         d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
//         opacity="0.15"
//       />
//       <path
//         d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
//         opacity="0.15"
//       />

//       {/* Animated top stroke */}
//       <path
//         d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
//         className={animate ? 'animate-top' : ''}
//         opacity={animate ? 1 : 0}
//       />

//       {/* Animated bottom stroke */}
//       <path
//         d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
//         className={animate ? 'animate-bottom' : ''}
//         opacity={animate ? 1 : 0}
//       />
//     </svg>
//   );
// }




'use client';

export interface RefreshIconStrokeProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
  duration?: number;
}

export function IconRefreshStroke({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false,
  duration = 0.7,
}: RefreshIconStrokeProps) {
  // All phases keep their original ratios to the 0.7s top-stroke draw
  const bottomDur = duration * (0.8 / 0.7);
  const fadeDur = duration * (1.5 / 0.7);
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
          @keyframes dash-top {
            0% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 0; }
          }

          @keyframes dash-bottom {
            0% { stroke-dashoffset: 50; }
            100% { stroke-dashoffset: 0; }
          }

          @keyframes fade {
            0%, 100% { opacity: 0; }
            15%, 85% { opacity: 1; }
          }

          .animate-stroke-top {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: dash-top ${duration}s linear forwards, fade ${fadeDur}s ease-in-out forwards;
          }

          .animate-stroke-bottom {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: dash-bottom ${bottomDur}s linear ${duration}s forwards, fade ${fadeDur}s ease-in-out forwards;
          }
        `}
      </style>

      <path stroke="none" d="M0 0h24v24H0z" />

      {/* Background paths */}
      <path
        d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
        opacity="0.15"
      />
      <path
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        opacity="0.15"
      />

      {/* Animated paths - controlled by parent */}
      <path
        d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4"
        className={isAnimating ? 'animate-stroke-top' : ''}
        opacity={isAnimating ? 1 : 0}
      />

      <path
        d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"
        className={isAnimating ? 'animate-stroke-bottom' : ''}
        opacity={isAnimating ? 1 : 0}
      />
    </svg>
  );
}