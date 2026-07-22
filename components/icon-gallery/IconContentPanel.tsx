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
import { InstallCommand } from "@/components/InstallCommand";
import { PropsTable } from "@/components/PropsTable";
import { MorphArrow } from "@/components/ui/morph-arrow";
import { Paragraph } from "@/components/Paragraph";
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
      className="group corner-squircle rounded-[10px] border border-border p-3 text-left bg-card text-card-foreground hover:border-foreground/25 hover:shadow-sm transition-[border-color,box-shadow] duration-150"
    >
      <div className="aspect-square bg-muted corner-squircle rounded-[8px] mb-2.5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-150">
        <VariationComponent size={32} />
      </div>
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <Paragraph variant="card-Heading" className="truncate">
            {variation.displayName}
          </Paragraph>
          <Paragraph
            variant="card-Description"
            className="mt-0.5 line-clamp-2"
          >
            {variation.description}
          </Paragraph>
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
        <h1 className="text-2xl font-sans text-foreground text-wrap-balance">
          {icon.name.replace(/ Icon$/i, "")}
        </h1>

        <h2 className="text-xs font-mono text-primary/80 mb-8">
          Check out all the interactions for this icon below.
        </h2>
        <div className="grid grid-cols-5 w-full gap-3">
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
          <Paragraph variant="panel-Eyebrow" className="mb-2">
            {icon.name.replace(/ Icon$/i, "")}
          </Paragraph>
          <Paragraph as="h1" variant="panel-Title">
            {variation.displayName}
          </Paragraph>
          <Paragraph variant="panel-Description" className="mb-8">
            {variation.description}
          </Paragraph>

          {variation.designNote && (
            <div className="mb-8 bg-card text-card-foreground border border-border corner-squircle rounded-[10px] p-4">
              <Paragraph variant="panel-Description" className="text-foreground">
                <strong className="font-medium">Design Note:</strong>{" "}
                {variation.designNote}
              </Paragraph>
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
              componentName: variation.componentName,
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
          <InstallCommand command={installCommand} className="" />

          {variation.props && variation.props.length > 0 && (
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Props
              </h2>
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
