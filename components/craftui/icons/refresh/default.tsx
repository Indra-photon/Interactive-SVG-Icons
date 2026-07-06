'use client';

export interface RefreshIconProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
  duration?: number;
}

export function IconRefresh({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false,
  duration = 1,
}: RefreshIconProps) {
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
      style={{ animationDuration: `${duration}s` }}
      className={`transition-all duration-300 ${
        isAnimating ? 'opacity-100 animate-spin' : 'opacity-30'
      } ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  );
}