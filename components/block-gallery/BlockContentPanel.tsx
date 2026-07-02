"use client";

import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  DribbbleIcon,
  PinterestIcon,
  GlobeIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { BlockPreview } from "./BlockPreview";
import { CopyButton } from "@/components/icon-gallery/CopyButton";
import type { Block } from "@/types/block";

const RIGHT_PANEL_SHADOW =
  "shadow-[inset_1px_0_0_rgba(0,0,0,0.06),inset_4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06)]";

// ── Variation thumbnail card (overview grid) ──────────────────────────────────

function VariationThumbCard({
  block,
  variation,
  onSelect,
}: {
  block: Block;
  variation: Block["variations"][number];
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group border border-stone-200 dark:border-stone-700 rounded-xl text-left hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-sm transition-[border-color,box-shadow] duration-150 overflow-hidden"
    >
      <div className="bg-stone-50 dark:bg-stone-800 group-hover:bg-stone-100 dark:group-hover:bg-stone-700/60 transition-colors duration-150">
        <BlockPreview
          blockSlug={block.slug}
          variationName={variation.name}
          animationType={variation.animationType}
        />
      </div>
      <div className="p-4 flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">
            {variation.displayName}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
            {variation.description}
          </p>
        </div>
        <span className="shrink-0 px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded text-[10px] font-medium">
          {variation.tier}
        </span>
      </div>
      <p className="pb-4 px-4 text-xs text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-150">
        View details →
      </p>
    </button>
  );
}

// ── Block overview (full width — no right panel) ──────────────────────────────

function BlockOverview({
  block,
  onVariationSelect,
}: {
  block: Block;
  onVariationSelect: (variation: string) => void;
}) {
  return (
    <div className="overflow-y-auto py-10 px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-2">
          {block.category}
        </p>
        <h1 className="text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-2 text-wrap-balance">
          {block.name}
        </h1>
        <p className="text-stone-500 dark:text-stone-400 mb-8 text-wrap-pretty">
          {block.description}
        </p>

        {block.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-10">
            {block.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
          Variations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {block.variations.map((v) => (
            <VariationThumbCard
              key={v.name}
              block={block}
              variation={v}
              onSelect={() => onVariationSelect(v.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Variation detail — 2 inner columns ───────────────────────────────────────

function buildUsageSnippet(
  block: Block,
  variation: Block["variations"][number],
  baseUrl: string,
): string {
  const componentName = variation.componentName ?? "Component";
  const importPath = `@/components/craftui/blocks/${block.slug}/${variation.name}`;
  const simpleProps = (variation.props ?? []).filter(
    (p) =>
      !p.required &&
      p.default !== undefined &&
      (p.type === "string" || p.type === "number") &&
      !p.default.startsWith("[") &&
      !p.default.startsWith("{"),
  );
  const propsStr =
    simpleProps.length > 0
      ? "\n" +
        simpleProps
          .map((p) => {
            const val = p.type === "number" ? `{${p.default}}` : `${p.default}`;
            return `  ${p.name}=${val}`;
          })
          .join("\n") +
        "\n"
      : "";
  const tag =
    propsStr.length > 0
      ? `<${componentName}${propsStr}/>`
      : `<${componentName} />`;
  return `import ${componentName} from "${importPath}";\n\n${tag}`;
}

function VariationDetail({
  block,
  variation,
  panelKey,
  baseUrl,
}: {
  block: Block;
  variation: Block["variations"][number];
  panelKey: string;
  baseUrl: string;
}) {
  const installCommand = `npx shadcn@latest add ${baseUrl}/r/${block.slug}-${variation.name}.json`;
  const usageSnippet = buildUsageSnippet(block, variation, baseUrl);

  return (
    <>
      {/* ── Middle: header + preview + how to use ── */}
      <div className="min-h-0 overflow-y-auto py-10 px-8">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Preview */}
          <BlockPreview
            blockSlug={block.slug}
            variationName={variation.name}
            animationType={variation.animationType}
          />

          {/* Preview hint */}
          {variation.previewHint && (
            <p className="mt-3 text-center text-xs text-stone-400 font-mono tracking-tight">
              ↑ {variation.previewHint}
            </p>
          )}

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
                    <tr className="bg-linear-to-b from-primary/50 to-primary/90 dark:bg-stone-800">
                      <th className="text-left text-xs font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-4 py-2.5">
                        Prop
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Description
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Type
                      </th>
                      <th className="text-left font-mono font-semibold uppercase tracking-wide text-primary-foreground/90 px-3 py-2.5">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {variation.props.map((prop) => {
                      const depth = (prop.name.match(/\[\]\./g) ?? []).length;
                      return (
                        <tr
                          key={prop.name}
                          className="bg-white dark:bg-stone-900/40"
                        >
                          <td
                            className="py-3 pr-3 align-top whitespace-nowrap"
                            style={{ paddingLeft: `${16 + depth * 16}px` }}
                          >
                            <code className="font-mono font-semibold text-[12px] text-foreground dark:text-stone-200">
                              {prop.name}
                            </code>
                          </td>
                          <td className="px-3 py-3 align-top font-mono text-[11px] leading-relaxed text-foreground/60">
                            {prop.description ?? "—"}
                          </td>
                          <td className="px-3 py-3 align-top whitespace-nowrap">
                            <span className="inline-block rounded-md bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                              {prop.type}
                            </span>
                          </td>
                          <td className="px-3 py-3 align-top whitespace-nowrap">
                            {prop.required ? (
                              <span className="inline-block rounded-md bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 font-mono text-[11px] font-medium text-red-500 dark:text-red-400">
                                required
                              </span>
                            ) : (
                              <span className="inline-block rounded-md bg-stone-50 dark:bg-stone-800 px-1.5 py-0.5 font-mono text-[11px] text-stone-400">
                                optional
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Right: installation + deps + props ── */}
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
              {block.name}
            </p>
            <h2 className="text-xl font-mono text-primary/80 text-wrap-balance mb-2">
              {variation.displayName}
            </h2>
            <p className="text-sm text-foreground/90 font-mono tracking-tight leading-relaxed text-wrap-pretty">
              {variation.description}
            </p>
          </div>

          {/* Features */}
          {/* {variation.features && variation.features.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Features
              </h2>
              <ul className="flex flex-col gap-2">
                {variation.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={18}
                      strokeWidth={2}
                      className="shrink-0 mt-0.5 text-emerald-500"
                    />
                    <p className="text-foreground font-mono font-regular tracking-tight text-[12px] text-wrap-pretty">
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

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
                      className="shrink-0 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-150"
                    />
                    <span className="group-hover:underline underline-offset-2 text-foreground font-mono font-regular tracking-tight text-[12px] text-wrap-pretty">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {variation.features && variation.features.length > 0 && (
            <div>
              <h2 className="text-xl font-mono  tracking-wide text-primary/80 mb-3">
                Features
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
        </motion.div>
      </div>
    </>
  );
}

// ── Public panel ──────────────────────────────────────────────────────────────

interface BlockContentPanelProps {
  blocks: Block[];
  activeSlug?: string;
  activeVariation?: string;
  onVariationSelect: (slug: string, variation: string) => void;
}

export function BlockContentPanel({
  blocks,
  activeSlug,
  activeVariation,
  onVariationSelect,
}: BlockContentPanelProps) {
  const activeBlock = blocks.find((b) => b.slug === activeSlug);
  const activeVariationData = activeBlock?.variations.find(
    (v) => v.name === activeVariation,
  );
  const panelKey = `${activeSlug ?? ""}--${activeVariation ?? ""}`;
  const modeKey = activeVariationData ? "detail" : "overview";

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={modeKey}
          className="grid h-full"
          style={{
            gridTemplateColumns: activeVariationData ? "1fr 490px" : "1fr",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {!activeBlock ? null : activeVariationData ? (
            <VariationDetail
              block={activeBlock}
              variation={activeVariationData}
              panelKey={panelKey}
              baseUrl={baseUrl}
            />
          ) : (
            <BlockOverview
              block={activeBlock}
              onVariationSelect={(variation) =>
                onVariationSelect(activeBlock.slug, variation)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
