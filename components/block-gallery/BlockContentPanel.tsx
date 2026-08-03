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
import { InstallCommand } from "@/components/InstallCommand";
import { PropsTable } from "@/components/PropsTable";
import { Paragraph } from "@/components/Paragraph";
import type { Block } from "@/types/block";
import { BLOCKS_CATALOG, type CatalogUIConfig } from "@/lib/catalog-config";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Variation thumbnail card (overview grid) ──────────────────────────────────

function VariationThumbCard({
  block,
  variation,
  catalog,
  onSelect,
}: {
  block: Block;
  variation: Block["variations"][number];
  catalog: CatalogUIConfig;
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
          responsive={variation.responsive}
          catalogDir={catalog.catalogDir}
          previewMode={catalog.previewMode}
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
  catalog,
  onVariationSelect,
}: {
  block: Block;
  catalog: CatalogUIConfig;
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
        <div className={`grid gap-6 ${catalog.overviewGridClass}`}>
          {block.variations.map((v) => (
            <VariationThumbCard
              key={v.name}
              block={block}
              variation={v}
              catalog={catalog}
              onSelect={() => onVariationSelect(v.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Variation detail — single column (breadcrumb → preview → props → more) ────

function VariationDetail({
  block,
  catalog,
  variation,
  panelKey,
  baseUrl,
}: {
  block: Block;
  catalog: CatalogUIConfig;
  variation: Block["variations"][number];
  panelKey: string;
  baseUrl: string;
}) {
  const installCommand = `npx shadcn@latest add ${baseUrl}/r/${block.slug}-${variation.name}.json`;

  return (
    <div
      className={`w-full ${catalog.detailWidthClass} overflow-y-auto py-12 px-4 sm:py-14 sm:px-10 md:py-16 md:px-16`}
    >
      <motion.div
        key={panelKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        {/* Breadcrumb + description */}
        <Paragraph variant="overview-Title" className="font-mono">
          <span className="text-muted-foreground">{catalog.breadcrumbRoot}</span>
          <span className="text-muted-foreground">{" / "}</span>
          <span className="text-muted-foreground">{block.category}</span>
          <span className="text-muted-foreground">{" / "}</span>
          <span className="text-foreground">{variation.displayName}</span>
        </Paragraph>
        <Paragraph variant="panel-Description" className="mb-8">
          {variation.description}
        </Paragraph>

        {/* Preview */}
        <BlockPreview
          blockSlug={block.slug}
          variationName={variation.name}
          animationType={variation.animationType}
          responsive={variation.responsive}
          catalogDir={catalog.catalogDir}
          previewMode={catalog.previewMode}
        />

        {/* Preview hint */}
        {variation.previewHint && (
          <p className="mt-3 text-center text-xs text-stone-400 font-mono tracking-tight">
            ↑ {variation.previewHint}
          </p>
        )}

        {/* Installation */}
        <InstallCommand command={installCommand} />

        {/* Props table */}
        {variation.props?.length > 0 && (
          <div className="mt-10">
            <Paragraph variant="Instruction-Heading" className="mb-3">
              Props
            </Paragraph>
            <PropsTable props={variation.props} showRequired />
          </div>
        )}

        {/* Inspiration */}
        {variation.inspiration && variation.inspiration.length > 0 && (
          <div className="mt-10">
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
                  <span className="group-hover:underline underline-offset-2 tracking-tight text-[12px] text-wrap-pretty">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {variation.features && variation.features.length > 0 && (
          <div className="mt-10">
            <Paragraph variant="Instruction-Heading" className="mb-3">
              Design decisions taken here
            </Paragraph>
            <ul className="flex flex-col gap-2">
              {variation.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="corner-squircle shrink-0 mt-1 flex items-center justify-center rounded-[4px] size-3.5 bg-foreground">
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={12}
                      strokeWidth={2.5}
                      className="text-background"
                    />
                  </span>
                  <Paragraph
                    variant="panel-Description"
                    className="text-foreground/70"
                  >
                    {feature}
                  </Paragraph>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ── Public panel ──────────────────────────────────────────────────────────────

interface BlockContentPanelProps {
  blocks: Block[];
  activeSlug?: string;
  activeVariation?: string;
  onVariationSelect: (slug: string, variation: string) => void;
  /** Which catalog is being rendered. Defaults to blocks. */
  catalog?: CatalogUIConfig;
}

export function BlockContentPanel({
  blocks,
  activeSlug,
  activeVariation,
  onVariationSelect,
  catalog = BLOCKS_CATALOG,
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

  // A catalog with nothing in it yet: the sidebar is empty and no slug can
  // resolve, so the panel would otherwise render a blank pane with no
  // explanation of what belongs here.
  if (blocks.length === 0) {
    return (
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8">
        <div className="max-w-sm text-center">
          <Paragraph variant="overview-Title">{catalog.empty.title}</Paragraph>
          <Paragraph
            variant="overview-Description"
            className="mt-2 text-center line-clamp-none"
          >
            {catalog.empty.body}
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={modeKey}
          className="grid h-full"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: "minmax(0, 1fr)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          {!activeBlock ? null : activeVariationData ? (
            <VariationDetail
              block={activeBlock}
              variation={activeVariationData}
              catalog={catalog}
              panelKey={panelKey}
              baseUrl={baseUrl}
            />
          ) : (
            <BlockOverview
              block={activeBlock}
              catalog={catalog}
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
