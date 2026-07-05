"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NewTwitterIcon,
  DribbbleIcon,
  PinterestIcon,
  GlobeIcon,
} from "@hugeicons/core-free-icons";
import { IconConfigurator } from "./IconConfigurator";
import { ButtonCodeDisplay } from "./ButtonCodeDisplay";
import { CopyButton } from "./CopyButton";
import { MorphArrow } from "@/components/ui/morph-arrow";
import type { Icon, InspirationLink } from "@/types/icon";

// ── Right panel shadow (inset from left edge, shadows over border) ─────────────
const RIGHT_PANEL_SHADOW =
  "shadow-[inset_1px_0_0_rgba(0,0,0,0.06),inset_4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06)]";

// ── Variation preview card (overview grid) ────────────────────────────────────

function VariationPreviewCard({
  iconSlug,
  variation,
  onSelect,
}: {
  iconSlug: string;
  variation: Icon["variations"][number];
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const VariationComponent = dynamic(
    () =>
      import(`@/components/craftui/icons/${iconSlug}/${variation.name}.tsx`)
        .then((mod) => ({
          default: mod[Object.keys(mod)[0]] as React.ComponentType<
            Record<string, any>
          >,
        }))
        .catch(() => ({
          default: () => <div className="text-4xl">📦</div>,
        })),
    { ssr: false },
  ) as React.ComponentType<Record<string, any>>;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group corner-squircle rounded-[10px] border border-stone-200 dark:border-stone-700 p-3 text-left hover:border-stone-400 dark:hover:border-stone-500 hover:shadow-sm transition-[border-color,box-shadow] duration-150"
    >
      <div className="aspect-square bg-stone-50 dark:bg-stone-800 corner-squircle rounded-[8px] mb-2.5 flex items-center justify-center group-hover:bg-stone-100 dark:group-hover:bg-stone-700/60 transition-colors duration-150">
        <VariationComponent size={32} />
      </div>
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <p className="font-sans font-medium text-foreground text-xs truncate">
            {variation.displayName}
          </p>
          <p className="text-[11px] text-foreground/60 tracking-tighter mt-0.5 line-clamp-2">
            {variation.description}
          </p>
        </div>
        <span className="shrink-0 px-1 py-0.5 bg-primary/10 text-primary rounded-[4px] text-[9px] font-mono uppercase tracking-wide">
          {variation.tier}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-foreground/50 group-hover:text-foreground transition-colors duration-150">
        Configure
        <MorphArrow isHovered={isHovered} size={11} />
      </p>
    </button>
  );
}

// ── Icon overview (full width — no right panel) ───────────────────────────────

function IconOverview({
  icon,
  onVariationSelect,
}: {
  icon: Icon;
  onVariationSelect: (variation: string) => void;
}) {
  return (
    <div className="overflow-y-auto py-10 px-8">
      <div className="w-full">
        <p className="text-xs font-mono text-foreground/80 uppercase tracking-widest mb-2">
          {icon.category}
        </p>
        <h1 className="text-2xl font-sans text-foreground text-wrap-balance">
          {icon.name.replace(/ Icon$/i, "")}
        </h1>
        <p className="text-foreground/80 font-sans tracking-tighter mb-8 text-wrap-pretty">
          {icon.description}
        </p>

        {icon.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-10">
            {icon.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
          Variations
        </h2>
        <div className="grid grid-cols-4 w-full gap-3">
          {icon.variations.map((v) => (
            <VariationPreviewCard
              key={v.name}
              iconSlug={icon.slug}
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

function VariationDetail({
  icon,
  variation,
  buttonCode,
  panelKey,
}: {
  icon: Icon;
  variation: Icon["variations"][number];
  buttonCode?: string;
  panelKey: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");
  const registryUrl = `${baseUrl}/r/${icon.slug}-${variation.name}.json`;
  const installCommand = `npx shadcn@latest add ${registryUrl}`;

  return (
    <>
      {/* ── Middle: header + configurator + example component ── */}
      <div className="overflow-y-auto py-10 px-8">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <p className="text-xs font-mono text-foreground/80 uppercase tracking-widest mb-2">
            {icon.name.replace(/ Icon$/i, "")}
          </p>
          <h1 className="text-2xl font-sans text-foreground text-wrap-balance">
            {variation.displayName}
          </h1>
          <p className="text-foreground/80 font-sans tracking-tighter mb-8 text-wrap-pretty">
            {variation.description}
          </p>

          {variation.designNote && (
            <div className="mb-8 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 corner-squircle rounded-[10px] p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Design Note:</strong> {variation.designNote}
              </p>
            </div>
          )}
        </motion.div>

        {variation.props && variation.props.length > 0 && (
          <IconConfigurator
            iconSlug={icon.slug}
            iconName={icon.name}
            variation={{
              name: variation.name,
              displayName: variation.displayName,
              tier: variation.tier,
              description: variation.description,
              animationType: variation.animationType,
              props: variation.props,
            }}
          />
        )}

        {buttonCode && buttonCode !== "// Button example not available" && (
          <div className="mt-10">
            <ButtonCodeDisplay
              iconSlug={icon.slug}
              variationName={variation.name}
              buttonCode={buttonCode}
            />
          </div>
        )}
      </div>

      {/* ── Right: installation + props ── */}
      <div className={`overflow-y-auto py-10 px-6 ${RIGHT_PANEL_SHADOW}`}>
        <motion.div
          key={panelKey}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
              Installation
            </h2>

            <CopyButton text={installCommand} />
          </div>

          {variation.props && variation.props.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Props
              </h2>
              <div className="overflow-hidden corner-squircle rounded-[10px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_2px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-linear-to-b from-primary/50 to-primary/90  dark:bg-stone-800">
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
                          {/* {prop.description && (
                            <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">
                              {prop.description}
                            </p>
                          )} */}
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-foreground/80 whitespace-nowrap">
                          {prop.type}
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-foreground/80 whitespace-nowrap">
                          {typeof prop.default === "string" &&
                          prop.default !== ""
                            ? `${prop.default}`
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

interface IconContentPanelProps {
  icons: Icon[];
  buttonCodes: Record<string, string>;
  activeSlug?: string;
  activeVariation?: string;
  onVariationSelect: (slug: string, variation: string) => void;
}

export function IconContentPanel({
  icons,
  buttonCodes,
  activeSlug,
  activeVariation,
  onVariationSelect,
}: IconContentPanelProps) {
  const activeIcon = icons.find((i) => i.slug === activeSlug);
  const activeVariationData = activeIcon?.variations.find(
    (v) => v.name === activeVariation,
  );
  const panelKey = `${activeSlug ?? ""}--${activeVariation ?? ""}`;
  const modeKey = activeVariationData ? "detail" : "overview";

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
          {!activeIcon ? null : activeVariationData ? (
            <VariationDetail
              icon={activeIcon}
              variation={activeVariationData}
              buttonCode={buttonCodes[`${activeSlug}-${activeVariation}`]}
              panelKey={panelKey}
            />
          ) : (
            <IconOverview
              icon={activeIcon}
              onVariationSelect={(variation) =>
                onVariationSelect(activeIcon.slug, variation)
              }
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
