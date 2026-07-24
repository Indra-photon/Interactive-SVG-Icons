"use client";

import * as React from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Link01Icon,
  Mail01Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";

// ── Types ─────────────────────────────────────────────────────────────────────

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"];

type ContactField = {
  key: string;
  icon: HugeIcon;
  label: string;
  /** [start, end) character range of `text` this field highlights. */
  highlight: [number, number];
};

export interface ContactRevealCardProps {
  /** The full identity string all fields highlight a slice of. */
  text?: string;
  fields?: ContactField[];
  className?: string;
}

// ── Default content ──────────────────────────────────────────────────────────

const DEFAULT_TEXT = "kumail@creatifly.co";

const DEFAULT_FIELDS: ContactField[] = [
  { key: "profile", icon: UserIcon, label: "Profile", highlight: [0, 6] },
  { key: "website", icon: Link01Icon, label: "Website", highlight: [7, 20] },
  { key: "email", icon: Mail01Icon, label: "Email", highlight: [0, 20] },
  {
    key: "instagram",
    icon: InstagramIcon,
    label: "Instagram",
    highlight: [7, 16],
  },
];

/**
 * Splits `text` into a fixed set of segments once, at the union of every
 * field's highlight boundaries. The DOM never changes shape after this —
 * switching fields only recolors existing segments, no reflow.
 */
function getSegments(text: string, fields: ContactField[]) {
  const points = new Set<number>([0, text.length]);
  for (const field of fields) {
    points.add(field.highlight[0]);
    points.add(field.highlight[1]);
  }
  const sorted = Array.from(points).sort((a, b) => a - b);
  return sorted.slice(0, -1).map((start, i) => ({
    start,
    end: sorted[i + 1],
    text: text.slice(start, sorted[i + 1]),
  }));
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ContactRevealCard({
  text = DEFAULT_TEXT,
  fields = DEFAULT_FIELDS,
  className,
}: ContactRevealCardProps = {}) {
  const scopeId = React.useId().replace(/:/g, "");
  const [selectedKey, setSelectedKey] = React.useState(
    fields[1]?.key ?? fields[0].key,
  );
  const [previewKey, setPreviewKey] = React.useState<string | null>(null);

  const activeKey = previewKey ?? selectedKey;
  const active = fields.find((f) => f.key === activeKey) ?? fields[0];
  const [start, end] = active.highlight;
  const segments = React.useMemo(
    () => getSegments(text, fields),
    [text, fields],
  );

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-6 sm:gap-8 rounded-[20px] sm:rounded-[28px] bg-white px-5 py-8 sm:px-8 sm:py-10 ${className ?? ""}`}
    >
      <style>
        {`
          .icon-row-${scopeId} button:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        `}
      </style>

      {/* Text + caption */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-baseline whitespace-pre text-8xl font-medium tracking-tight sm:text-8xl md:text-6xl">
          {segments.map((segment) => {
            const isActive = segment.start >= start && segment.end <= end;
            return (
              <motion.span
                key={`${segment.start}-${segment.end}`}
                animate={{ color: isActive ? "#4f46e5" : "rgba(0,0,0,0.28)" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{
                  borderBottom: isActive
                    ? "2px dashed rgba(79,70,229,0.4)"
                    : "2px dashed transparent",
                  transition: "border-color 0.2s ease-in-out",
                }}
              >
                {segment.text}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Icon row — hover-dim handled entirely by :has/:not/:hover, no JS listeners needed for it */}
      <div className={`icon-row-${scopeId} flex items-center gap-2`}>
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            aria-label={field.label}
            aria-pressed={field.key === selectedKey}
            onMouseEnter={() => setPreviewKey(field.key)}
            onMouseLeave={() => setPreviewKey(null)}
            onClick={() => setSelectedKey(field.key)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-black/40 transition-colors data-[active=true]:text-indigo-600"
            data-active={field.key === selectedKey}
          >
            <HugeiconsIcon
              icon={field.icon}
              size={18}
              color="currentColor"
              strokeWidth={1.6}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
