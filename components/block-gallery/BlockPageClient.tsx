"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Copy, Check } from "lucide-react";
import type { Block } from "@/types/block";

interface BlockPageClientProps {
  block: Block;
  baseUrl: string;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

function InstallCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative group">
      <div className="bg-zinc-950 text-zinc-100 rounded-lg px-4 py-3 font-mono text-xs leading-relaxed overflow-x-auto pr-10">
        {command}
      </div>
      <button
        onClick={() => copy(command)}
        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-100 transition-colors"
        aria-label="Copy command"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function BlockFullPreview({
  blockSlug,
  variationName,
}: {
  blockSlug: string;
  variationName: string;
}) {
  const [PreviewComponent, setPreviewComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    import(
      `@/components/craftui/blocks/${blockSlug}/examples/${variationName}-preview.tsx`
    )
      .then((mod) => {
        const exported = mod.default ?? mod[Object.keys(mod)[0]];
        setPreviewComponent(() => exported);
      })
      .catch(console.error);
  }, [blockSlug, variationName]);

  if (!PreviewComponent) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-400 text-sm font-sans">
        Loading…
      </div>
    );
  }

  return <PreviewComponent />;
}

export function BlockPageClient({ block, baseUrl }: BlockPageClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeVariation, setActiveVariation] = useState(0);

  const variation = block.variations[activeVariation];
  const cliCommand = `npx shadcn@latest add ${baseUrl}/r/${block.slug}-${variation.name}.json`;

  return (
    <>
      {/* Full-screen preview — covers navbar and everything */}
      <div className="fixed inset-0 z-[100]">
        <BlockFullPreview
          blockSlug={block.slug}
          variationName={variation.name}
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
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Installation
                  </h3>
                  <InstallCommand command={cliCommand} />
                </div>

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
                    <div className="rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-muted border-b border-border">
                            <th className="px-3 py-2.5 text-left font-medium text-foreground">
                              Prop
                            </th>
                            <th className="px-3 py-2.5 text-left font-medium text-foreground">
                              Type
                            </th>
                            <th className="px-3 py-2.5 text-left font-medium text-foreground">
                              Req
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {variation.props.map((prop) => (
                            <tr
                              key={prop.name}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-3 py-2.5">
                                <code className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded text-[11px]">
                                  {prop.name}
                                </code>
                              </td>
                              <td className="px-3 py-2.5 font-mono text-muted-foreground text-[11px]">
                                {prop.type}
                              </td>
                              <td className="px-3 py-2.5 text-[11px]">
                                {prop.required ? (
                                  <span className="text-red-500 font-medium">
                                    yes
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    no
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Prop descriptions below the table */}
                    <div className="space-y-2 pt-1">
                      {variation.props.map((prop) => (
                        <div
                          key={prop.name}
                          className="flex gap-2 text-xs font-sans"
                        >
                          <code className="shrink-0 font-mono text-blue-600 dark:text-blue-400">
                            {prop.name}
                          </code>
                          <span className="text-muted-foreground">
                            {prop.description}
                          </span>
                        </div>
                      ))}
                    </div>
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
