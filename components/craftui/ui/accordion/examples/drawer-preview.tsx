"use client";

import { DrawerAccordion } from "../drawer";
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
  {
    value: "item-4",
    trigger: "Is it free to use?",
    content:
      "Completely free. No paywalls, no sign-up, no licence restrictions. Use it in personal and commercial projects.",
  },
];

export default function DrawerPreview() {
  const { stiffness = 220, damping = 22 } = useUIProps();

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-neutral-100 p-10 antialiased">
      <div className="w-full max-w-lg">
        <DrawerAccordion items={ITEMS} spring={{ stiffness, damping }} />
      </div>
    </div>
  );
}
