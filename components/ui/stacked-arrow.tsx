"use client";

import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";

// ArrowUpDoubleIcon from @hugeicons/core-free-icons, inlined as its two raw
// paths rather than rendered through <HugeiconsIcon>. That component emits the
// pair as one node, so opacity could only be animated across both at once —
// and the whole point here is that the chevrons fade out of step.
const CHEVRON = {
  lead: "M18 11.5C18 11.5 13.5811 5.50001 12 5.5C10.4188 5.49999 6 11.5 6 11.5",
  trail: "M18 18.5C18 18.5 13.5811 12.5 12 12.5C10.4188 12.5 6 18.5 6 18.5",
};

// Where each chevron lands when the loop is off — the trailing one well under
// the leading one, so the pair still reads as an arrow with a shadow rather
// than as two equal marks.
const REST = { lead: 1, trail: 0.28 };

// Trail first, lead 0.14s behind: the bright band travels upward, which is the
// direction the arrow points. Reverse the delays and it reads as falling.
const PULSE_DELAY = { trail: 0, lead: 0.14 };

const pulse = (delay: number): TargetAndTransition => ({
  opacity: [0.25, 1, 0.25],
  transition: {
    duration: 0.9,
    delay,
    repeat: Infinity,
    repeatDelay: 0.15,
    ease: "easeInOut",
  },
});

const settle = (opacity: number): TargetAndTransition => ({
  opacity,
  transition: { duration: 0.25 },
});

interface StackedArrowProps {
  size?: number;
  className?: string;
}

// Runs on its own, not on hover — the pulse is what makes the arrow legible as
// an affordance before anyone points at it. There is deliberately no `isHovered`
// prop: the card's hover state and this loop are independent.
export function StackedArrow({ size = 28, className }: StackedArrowProps) {
  // A loop with no end is exactly the persistent motion that reduced motion is
  // meant to stop, and here it never pauses — so honouring it is not optional.
  // It resolves to the static rest state.
  const reduceMotion = useReducedMotion();
  const active = !reduceMotion;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={CHEVRON.trail}
        animate={active ? pulse(PULSE_DELAY.trail) : settle(REST.trail)}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <motion.path
        d={CHEVRON.lead}
        animate={active ? pulse(PULSE_DELAY.lead) : settle(REST.lead)}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
