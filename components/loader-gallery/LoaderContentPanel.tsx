"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  DribbbleIcon,
  PinterestIcon,
  GlobeIcon,
} from "@hugeicons/core-free-icons";
import { LoaderConfigurator } from "./LoaderConfigurator";
import { LoaderPreview } from "./LoaderPreview";
import { InstallCommand } from "@/components/InstallCommand";
import { PropsTable } from "@/components/PropsTable";
import { MorphArrow } from "@/components/ui/morph-arrow";
import { Paragraph } from "@/components/Paragraph";
import { resolveLoaderGroup } from "@/lib/sidebar-data";
import type { Loader } from "@/types/loader";

// ── Loader preview card (group overview grid) ─────────────────────────────────

function LoaderPreviewCard({
  loader,
  onSelect,
}: {
  loader: Loader;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const variation = loader.variations[0];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group corner-squircle rounded-[10px] border border-border p-2.5 sm:p-3 text-left bg-card text-card-foreground hover:border-foreground/25 hover:shadow-sm transition-[border-color,box-shadow] duration-150"
    >
      <div className="aspect-square bg-muted corner-squircle rounded-[8px] mb-2.5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-150">
        <div className="scale-[0.65]">
          <LoaderPreview
            loaderSlug={loader.slug}
            variationName={variation.name}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <Paragraph variant="title" className="truncate">
            {loader.name}
          </Paragraph>
          <Paragraph variant="caption" className="mt-0.5 line-clamp-2">
            {loader.description}
          </Paragraph>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-foreground/50 group-hover:text-foreground transition-colors duration-150">
        Configure
        <MorphArrow isHovered={isHovered} size={11} />
      </p>
    </button>
  );
}

// ── Group overview (full width — no right panel) ──────────────────────────────

function LoaderGroupOverview({
  label,
  loaders,
  onSelect,
}: {
  label: string;
  loaders: Loader[];
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="overflow-y-auto py-12 px-4 sm:py-14 sm:px-6 md:py-16 md:px-8">
      <div className="w-full">
        <Paragraph variant="title" className="font-mono">
          <Paragraph as="span" variant="crumb">
            loaders
          </Paragraph>
          <Paragraph as="span" variant="crumb">
            {" / "}
          </Paragraph>
          <span className="text-foreground">{label}</span>
        </Paragraph>

        <Paragraph as="p" variant="lead" className="mb-8 mt-1">
          Check out all the loaders in this group below.
        </Paragraph>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-3">
          {loaders.map((loader) => (
            <LoaderPreviewCard
              key={loader.slug}
              loader={loader}
              onSelect={() => onSelect(loader.slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Loader detail — 2 inner columns ──────────────────────────────────────────

function LoaderDetail({
  loader,
  panelKey,
}: {
  loader: Loader;
  panelKey: string;
}) {
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
      <div className="w-full max-w-5xl overflow-y-auto py-12 px-4 sm:py-14 sm:px-10 md:py-16 md:px-16">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <Paragraph variant="title" className="font-mono">
            <Paragraph as="span" variant="crumb">
              loaders
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {" / "}
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {loader.category}
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {" / "}
            </Paragraph>
            <span className="text-foreground">{loader.name}</span>
          </Paragraph>
          <Paragraph variant="lead" className="mb-6 mt-1">
            {loader.description}
          </Paragraph>

          {loader.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {loader.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <LoaderConfigurator loaderSlug={loader.slug} variation={variation} />

        {/* ── Installation + props + inspiration (below the example) ── */}
        <div className="mt-10 space-y-8">
          <InstallCommand command={installCommand} className="" />

          {variation.props?.length > 0 && (
            <div>
              <Paragraph variant="display" className="mb-3">
                Props
              </Paragraph>
              <PropsTable
                props={variation.props.map((prop) => ({
                  ...prop,
                  type: prop.type === "ease" ? "string | number[]" : prop.type,
                }))}
              />
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
        </div>
      </div>
    </>
  );
}

// ── Public panel ──────────────────────────────────────────────────────────────

interface LoaderContentPanelProps {
  loaders: Loader[];
  activeSlug?: string;
  onSelect: (slug: string) => void;
}

export function LoaderContentPanel({
  loaders,
  activeSlug,
  onSelect,
}: LoaderContentPanelProps) {
  const activeGroup = resolveLoaderGroup(activeSlug ?? "", loaders);
  const activeLoader = activeGroup
    ? undefined
    : loaders.find((l) => l.slug === activeSlug);
  const panelKey = activeSlug ?? "";
  const modeKey = activeGroup ? `group--${activeGroup.id}` : "detail";

  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={modeKey}
          className="grid h-full"
          style={{ gridTemplateColumns: "1fr" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {activeGroup ? (
            <LoaderGroupOverview
              label={activeGroup.label}
              loaders={activeGroup.loaders}
              onSelect={onSelect}
            />
          ) : (
            activeLoader && (
              <LoaderDetail loader={activeLoader} panelKey={panelKey} />
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
