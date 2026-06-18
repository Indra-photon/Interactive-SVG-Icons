"use client";

import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  DribbbleIcon,
  PinterestIcon,
  GlobeIcon,
} from "@hugeicons/core-free-icons";
import { LoaderConfigurator } from "./LoaderConfigurator";
import { CopyButton } from "./CopyButton";
import type { Loader } from "@/types/loader";

// ── Right panel shadow (inset from left edge, shadows over border) ────────────
const RIGHT_PANEL_SHADOW =
  "shadow-[inset_1px_0_0_rgba(0,0,0,0.06),inset_4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06)]";

// ── Loader detail — 2 inner columns ──────────────────────────────────────────

function LoaderDetail({ loader, panelKey }: { loader: Loader; panelKey: string }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  // All loaders currently have one variation; the layout handles multiples naturally.
  const variation = loader.variations[0];
  const installCommand = `npx shadcn@latest add ${baseUrl}/r/${loader.slug}-${variation.name}.json`;

  return (
    <>
      {/* ── Middle: name + tags + configurator ── */}
      <div className="overflow-y-auto py-10 px-8">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <p className="text-xs font-mono text-foreground/80 uppercase tracking-widest mb-2">
            {loader.category}
          </p>
          <h1 className="text-2xl font-sans text-foreground text-wrap-balance">
            {loader.name}
          </h1>
          <p className="text-foreground/80 font-sans tracking-tighter mb-6 text-wrap-pretty">
            {loader.description}
          </p>

          {loader.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {loader.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <LoaderConfigurator loaderSlug={loader.slug} variation={variation} />
      </div>

      {/* ── Right: installation + props + inspiration ── */}
      <div className={`overflow-y-auto py-10 px-6 ${RIGHT_PANEL_SHADOW}`}>
        <motion.div
          key={panelKey}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
              Installation
            </h2>
            <CopyButton text={installCommand} />
          </div>

          {variation.props?.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Props
              </h2>
              <div className="overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-linear-to-b from-primary/50 to-primary/90 dark:bg-stone-800">
                      <th className="text-left text-xs font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2">
                        Prop
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2">
                        Type
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2">
                        Default
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {variation.props.map((prop) => (
                      <tr
                        key={prop.name}
                        className="bg-white dark:bg-stone-900/40"
                      >
                        <td className="px-3 py-2 align-top">
                          <code className="font-mono font-semibold text-foreground dark:text-stone-200">
                            {prop.name}
                          </code>
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-foreground/80 whitespace-nowrap">
                          {prop.type === "ease"
                            ? "string | number[]"
                            : prop.type}
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-foreground/80 whitespace-nowrap">
                          {Array.isArray(prop.default)
                            ? `[${(prop.default as number[]).join(", ")}]`
                            : typeof prop.default === "string"
                              ? `"${prop.default}"`
                              : String(prop.default)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {variation.inspiration && variation.inspiration.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Inspiration
              </h2>
              <div className="flex flex-col gap-1">
                {variation.inspiration.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-foreground/70 hover:text-foreground transition-colors duration-150 group py-1"
                  >
                    <HugeiconsIcon
                      icon={
                        link.type === "twitter"
                          ? NewTwitterIcon
                          : link.type === "dribbble"
                            ? DribbbleIcon
                            : link.type === "pinterest"
                              ? PinterestIcon
                              : GlobeIcon
                      }
                      size={13}
                      strokeWidth={1.5}
                      className="shrink-0 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-150"
                    />
                    <span className="group-hover:underline underline-offset-2">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

// ── Public panel ──────────────────────────────────────────────────────────────

interface LoaderContentPanelProps {
  loaders: Loader[];
  activeSlug?: string;
}

export function LoaderContentPanel({
  loaders,
  activeSlug,
}: LoaderContentPanelProps) {
  const activeLoader = loaders.find((l) => l.slug === activeSlug);
  const panelKey = activeSlug ?? "";

  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key="loader-detail"
          className="grid h-full"
          style={{ gridTemplateColumns: "1fr 490px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {activeLoader && <LoaderDetail loader={activeLoader} panelKey={panelKey} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
