"use client";

import { EaseAccordion } from "../ease";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

const ITEMS = [
  {
    value: "item-1",
    trigger: "What is CraftUI?",
    content:
      "CraftUI is a collection of animated React components built on top of shadcn/ui. Every component uses Framer Motion for smooth, physics-based interactions — copy and paste ready.",
  },
  {
    value: "item-2",
    trigger: "How do I install a component?",
    content:
      "Run npx shadcn@latest add [url] in your terminal. The component and its dependencies are added to your project automatically. No extra config needed.",
  },
  {
    value: "item-3",
    trigger: "Can I customise the animation?",
    content:
      "Yes — every animated component exposes its motion parameters as props. Use the DialKit panel to dial in the exact easing curve and duration you want.",
  },
  {
    value: "item-4",
    trigger: "Is it free to use?",
    content:
      "Completely free. No paywalls, no sign-up, no licence restrictions. Use it in personal and commercial projects.",
  },
];

export default function EasePreview() {
  const { duration = 0.35, ease = [0.215, 0.61, 0.355, 1] } = useUIProps();

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-background p-10 antialiased">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          FAQ
        </p>
        <h2 className="mb-6 text-lg font-semibold text-foreground text-balance">
          Frequently asked questions
        </h2>
        <EaseAccordion items={ITEMS} duration={duration} ease={ease} />
      </div>
    </div>
  );
}
