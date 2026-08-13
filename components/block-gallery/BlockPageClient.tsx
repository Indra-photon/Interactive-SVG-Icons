"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight } from "lucide-react";
import { PropsTable } from "@/components/PropsTable";
import { InstallCommand } from "@/components/InstallCommand";
import type { Block } from "@/types/block";
import { BLOCKS_CATALOG, type CatalogUIConfig } from "@/lib/catalog-config";
import { installCommand, registryItemName } from "@/lib/registry";

interface BlockPageClientProps {
  block: Block;
  baseUrl: string;
  /** Which catalog is being rendered. Defaults to blocks. */
  catalog?: CatalogUIConfig;
}

function BlockFullPreview({
  blockSlug,
  variationName,
  catalogDir,
}: {
  blockSlug: string;
  variationName: string;
  /** Directory under components/craftui to import the preview from. */
  catalogDir: string;
}) {
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Kept as one template literal for the same reason as BlockPreview: a
    // literal per-catalog path can't resolve while a catalog directory is
    // empty, because the bundler has no matches to build a context from.
    import(
      `@/components/craftui/${catalogDir}/${blockSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch(console.error);
  }, [catalogDir, blockSlug, variationName]);

  if (!PreviewComponent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400 text-sm font-sans">
        Loading…
      </div>
    );
  }

  return <PreviewComponent />;
}

export function BlockPageClient({
  block,
  baseUrl,
  catalog = BLOCKS_CATALOG,
}: BlockPageClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeVariation, setActiveVariation] = useState(0);

  const variation = block.variations[activeVariation];
  const cliCommand = installCommand(
    registryItemName(block.slug, variation.name),
    baseUrl
  );

  return (
    <>
      {/* Full-screen preview — covers navbar and everything */}
      <div className="fixed inset-0 z-[100]">
        <BlockFullPreview
          blockSlug={block.slug}
          variationName={variation.name}
          catalogDir={catalog.catalogDir}
        />
      </div>

      {/* Floating top bar */}
      {/* <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-sans">
        <span className="text-white/60 text-xs">blocks</span>
        <span className="text-white/30">/</span>
        <span className="font-medium">{block.name}</span>
        {block.variations.length > 1 && (
          <>
            <span className="text-white/30">/</span>
            <div className="flex items-center gap-1">
              {block.variations.map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => setActiveVariation(i)}
                  className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                    i === activeVariation
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {v.displayName}
                </button>
              ))}
            </div>
          </>
        )}
      </div> */}

      {/* Floating Details button */}
      <motion.button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-[110] flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-xl hover:bg-zinc-100 transition-colors"
        whileTap={{ scale: 0.97 }}
      >
        How to Install
        <ChevronRight size={15} />
      </motion.button>

      {/* Sidebar + backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[130] w-[440px] bg-background border-l border-border flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
                <div>
                  <h2 className="font-sans font-semibold text-foreground text-base">
                    {block.name}
                  </h2>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {variation.displayName}
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Tier badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      variation.tier === "free"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                        : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800"
                    }`}
                  >
                    {variation.tier}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans">
                    {variation.animationType} animation
                  </span>
                </div>

                {/* Description */}
                <div>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {variation.description}
                  </p>
                </div>

                {/* Installation */}
                <InstallCommand command={cliCommand} className="" />

                {/* Dependencies */}
                {variation.dependencies?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Dependencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variation.dependencies.map((dep) => (
                        <code
                          key={dep}
                          className="text-xs font-mono bg-muted text-foreground px-2.5 py-1 rounded border border-border"
                        >
                          {dep}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {block.tags?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {block.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-sans bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Props table */}
                {variation.props?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Props
                    </h3>
                    <PropsTable props={variation.props} showRequired />
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
