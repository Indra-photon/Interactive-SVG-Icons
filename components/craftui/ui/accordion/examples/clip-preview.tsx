"use client";

import { ClipAccordion } from "../clip";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

const ITEMS = [
  {
    value: "item-1",
    trigger: "What is your refund policy?",
    content:
      "We offer a 30-day refund period on all plans. Contact our support team and we'll process your request within 48 hours — no questions asked.",
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
      "Yes — every animated component exposes its motion parameters as props. Use the DialKit panel to dial in the exact spring stiffness and damping you want.",
  },
];

export default function ClipPreview() {
  const {
    duration = 0.45,
    ease = [0.32, 0.72, 0, 1],
    direction = "horizontal",
  } = useUIProps();

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-background p-10 antialiased">
      <div className="w-full max-w-lg">
        <h2 className="mb-6 text-xl font-regular text-foreground text-balance">
          Frequently asked questions
        </h2>
        <ClipAccordion
          items={ITEMS}
          direction={direction}
          duration={duration}
          ease={ease}
        />
      </div>
    </div>
  );
}
