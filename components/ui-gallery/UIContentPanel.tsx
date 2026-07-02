"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  DribbbleIcon,
  PinterestIcon,
  GlobeIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { UIConfigurator } from "./UIConfigurator";
import { CopyButton } from "@/components/loader-gallery/CopyButton";
import type { UIComponent } from "@/types/ui-component";

const RIGHT_PANEL_SHADOW =
  "shadow-[inset_1px_0_0_rgba(0,0,0,0.06),inset_4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06)]";

// ── Usage block ───────────────────────────────────────────────────────────────

function UsageBlock({ snippet }: { snippet: string }) {
  return <CopyButton text={snippet} />;
}

function defaultSnippet(
  componentName: string,
  props: UIComponent["variations"][number]["props"],
) {
  return props.length === 0
    ? `<${componentName} items={ITEMS} />`
    : `<${componentName}\n  items={ITEMS}\n${props.map((p) => `  ${p.name}={${p.name}}`).join("\n")}\n/>`;
}

// ── Variation detail ──────────────────────────────────────────────────────────

function UIVariationDetail({
  component,
  variation,
  panelKey,
  baseUrl,
}: {
  component: UIComponent;
  variation: UIComponent["variations"][number];
  panelKey: string;
  baseUrl: string;
}) {
  const installCommand = `npx shadcn@latest add ${baseUrl}/r/${component.slug}-${variation.name}.json`;
  const fallback = useMemo(
    () => defaultSnippet(variation.componentName, variation.props),
    [variation.componentName, variation.props],
  );
  const [activeSnippet, setActiveSnippet] = useState(fallback);

  return (
    <>
      {/* ── Middle: configurator + installation + props ── */}
      <div className="min-h-0 overflow-y-auto py-10 px-8">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <UIConfigurator
            componentSlug={component.slug}
            variation={variation}
            onSnippetChange={setActiveSnippet}
          />

          {/* Installation */}
          <div className="mt-10">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
              Installation
            </h2>
            <CopyButton text={installCommand} />
          </div>

          {/* Props table */}
          {variation.props?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Props
              </h2>
              <div className="overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-linear-to-b from-primary/50 to-primary/90">
                      <th className="text-left text-xs font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-4 py-2.5">
                        Prop
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Type
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Default
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Values
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {variation.props.map((prop) => (
                      <tr
                        key={prop.name}
                        className="bg-white dark:bg-stone-900/40"
                      >
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <code className="font-mono font-semibold text-[12px] text-foreground dark:text-stone-200">
                            {prop.name}
                          </code>
                        </td>
                        <td className="px-3 py-3 align-top whitespace-nowrap">
                          <span className="inline-block rounded-md bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                            {prop.type}
                          </span>
                        </td>
                        <td className="px-3 py-3 align-top font-mono text-[11px] text-foreground/60 whitespace-nowrap">
                          {String(prop.default)}
                        </td>
                        <td className="px-3 py-3 align-top">
                          {prop.options?.length ? (
                            <span className="font-mono text-[11px] text-foreground/70">
                              {prop.options.map((o, i) => (
                                <span key={o}>
                                  {i > 0 && (
                                    <span className="mx-1 text-foreground/30">
                                      |
                                    </span>
                                  )}
                                  <code className="text-foreground/80">
                                    &ldquo;{o}&rdquo;
                                  </code>
                                </span>
                              ))}
                            </span>
                          ) : prop.min !== undefined &&
                            prop.max !== undefined ? (
                            <span className="font-mono text-[11px] text-foreground/60 whitespace-nowrap">
                              {prop.min}&thinsp;&ndash;&thinsp;{prop.max}
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-foreground/25">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Right: name + description + features + inspiration ── */}
      <div className={`overflow-y-auto py-10 px-6 ${RIGHT_PANEL_SHADOW}`}>
        <motion.div
          key={panelKey}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Name + description */}
          <div>
            <p className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-2">
              {component.name}
            </p>
            <h2 className="text-xl font-mono text-primary/80 text-wrap-balance mb-2">
              {variation.displayName}
            </h2>
            <p className="text-sm text-foreground/90 font-mono tracking-tight leading-relaxed text-wrap-pretty">
              {variation.description}
            </p>
          </div>

          {/* Features */}
          {variation.features && variation.features.length > 0 && (
            <div>
              <h2 className="text-xl font-mono  tracking-wide text-primary/80 mb-3">
                Design decisions taken here
              </h2>
              <ul className="flex flex-col gap-2">
                {variation.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="corner-squircle shrink-0 mt-0.5 flex items-center justify-center rounded-[4px] size-4 bg-linear-to-b from-primary/50 to-primary/90">
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={10}
                        strokeWidth={2.5}
                        className="text-white"
                      />
                    </span>
                    <p className="text-sm text-foreground/90 font-mono tracking-tight leading-relaxed text-wrap-pretty">
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inspiration */}
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
                      className="shrink-0 text-foreground/40 group-hover:text-foreground/70 transition-colors"
                    />
                    <span className="group-hover:underline underline-offset-2 font-mono text-[12px]">
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

interface UIContentPanelProps {
  components: UIComponent[];
  activeSlug?: string;
  activeVariation?: string;
}

export function UIContentPanel({
  components,
  activeSlug,
  activeVariation,
}: UIContentPanelProps) {
  const activeComponent = components.find((c) => c.slug === activeSlug);
  const activeVariationData = activeComponent?.variations.find(
    (v) => v.name === activeVariation,
  );
  const panelKey = `${activeSlug ?? ""}--${activeVariation ?? ""}`;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={panelKey}
          className="grid h-full"
          style={{ gridTemplateColumns: "1fr 490px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {activeComponent && activeVariationData && (
            <UIVariationDetail
              component={activeComponent}
              variation={activeVariationData}
              panelKey={panelKey}
              baseUrl={baseUrl}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
