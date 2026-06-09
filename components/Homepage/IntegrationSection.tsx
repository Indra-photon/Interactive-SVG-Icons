"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { ToolConnectorSVG } from "@/components/Homepage/ToolConnectorSVG";

const INTEGRATION_POINTS = [
  {
    label: "Any React framework",
    detail: "Next.js, Vite, Remix, CRA — import and go.",
  },
  {
    label: "Design-system ready",
    detail: "Reads currentColor and CSS variables out of the box.",
  },
  {
    label: "Zero runtime deps",
    detail: "Only peer dep is Framer Motion — nothing else ships.",
  },
];

export function IntegrationSection() {
  return (
    <div className="relative mx-auto max-w-7xl px-6 py-28 flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
        {/* ── Left: illustration ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-full flex items-center justify-center"
        >
          <div className="w-full max-w-sm lg:max-w-none aspect-[310/235.5]">
            <ToolConnectorSVG />
          </div>
        </motion.div>

        {/* ── Right: copy + list ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <Heading as="h2">Plugs into your stack</Heading>
            <Paragraph className="text-foreground/60 max-w-md">
              Every component is a single self-contained file. No wrappers, no
              providers, no global config — drop it in and it runs.
            </Paragraph>
          </div>

          <ul className="flex flex-col gap-5">
            {INTEGRATION_POINTS.map(({ label, detail }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.08,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="flex items-start gap-3"
              >
                <span className="mt-1 flex-shrink-0 size-[6px] rounded-full bg-primary translate-y-[5px]" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <Paragraph
                    variant="muted"
                    className="text-foreground/50 text-sm"
                  >
                    {detail}
                  </Paragraph>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
