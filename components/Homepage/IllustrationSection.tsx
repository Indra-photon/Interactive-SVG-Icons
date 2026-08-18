"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Button } from "@/components/ui/button";
import { ToolConnectorSVG } from "@/components/craftui/illustrations/tool-connector/default";
import { NetworkDiagramSVG } from "@/components/Homepage/NetworkDiagramSVG";
import { FolderSVG } from "@/components/Homepage/FolderSVG";

// ─── Illustration cards data ───────────────────────────────────────────────────

const ILLUSTRATION_CARDS = [
  {
    id: "tool-connector",
    title: "Tool Connector",
    content: (
      <div className="w-full h-full flex items-center justify-center p-6">
        <ToolConnectorSVG />
      </div>
    ),
  },
  {
    id: "network-diagram",
    title: "Network Diagram",
    content: (
      <div className="w-full h-full flex items-center justify-center p-6">
        <NetworkDiagramSVG />
      </div>
    ),
  },
  {
    id: "folder-404",
    title: "Folder 404",
    content: (
      <div className="w-full h-full flex items-center justify-center p-6">
        <FolderSVG />
      </div>
    ),
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export function IllustrationSection() {
  return (
    <div className="relative px-6 py-24">
      {/* ── Top: heading + paragraph + CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col gap-4 mb-12 max-w-xl"
      >
        <Heading as="h2"> Illustrations</Heading>
        <Paragraph className="text-foreground/60">
          Production-ready SVG illustrations with hand-crafted motion. Drop into
          any project — each one is a single self-contained component.
        </Paragraph>
        <div className="mt-1">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="corner-squircle rounded-[10px] font-mono tracking-tighter"
          >
            <Link href="/illustrations">Browse Illustrations</Link>
          </Button>
        </div>
      </motion.div>

      {/* ── Bottom: three illustration cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ILLUSTRATION_CARDS.map(({ id, content }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="relative corner-squircle rounded-[10px] card-shadow bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_0px_0px_1px_rgba(0,0,0,0.04)] overflow-hidden"
            style={{ height: 320 }}
          >
            {content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
