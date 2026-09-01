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
import { installCommand, registryItemName } from "@/lib/registry";
import { pickRelated } from "@/lib/gallery-related";
import {
  DetailRail,
  type RailRelatedItem,
} from "@/components/gallery/DetailRail";
import { RailMiniPreview } from "@/components/gallery/RailMiniPreview";
import { ShareButton } from "@/components/gallery/ShareButton";

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
      className="group corner-squircle rounded-[10px] border border-border p-2.5 sm:p-3 text-left bg-card text-card-foreground hover:border-foreground/25 hover:shadow-sm transition-[border-color,box-shadow] duration-150"
    >
      <div className="aspect-square bg-muted corner-squircle rounded-[8px] mb-2.5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-150">
        <VariationComponent size={32} />
      </div>
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <Paragraph variant="title" className="truncate">
            {variation.displayName}
          </Paragraph>
          <Paragraph variant="caption" className="mt-0.5 line-clamp-3">
            {variation.description}
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

// ── Icon overview (full width — no right panel) ───────────────────────────────

function IconOverview({
  icon,
  onVariationSelect,
}: {
  icon: Icon;
  onVariationSelect: (variation: string) => void;
}) {
  return (
    <div className="overflow-y-auto py-12 px-4 sm:py-14 sm:px-6 md:py-16 md:px-8">
      <div className="w-full">
        <Paragraph variant="title" className="font-mono">
          <Paragraph as="span" variant="crumb">
            icons
          </Paragraph>
          <Paragraph as="span" variant="crumb">
            {" / "}
          </Paragraph>
          <span className="text-foreground">
            {icon.name.replace(/ Icon$/i, "")}
          </span>
        </Paragraph>

        <Paragraph as="p" variant="lead" className="mb-8 mt-1">
          Check out all the interactions for this icon below.
        </Paragraph>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-3">
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
  related,
}: {
  icon: Icon;
  variation: Icon["variations"][number];
  buttonCode?: string;
  panelKey: string;
  /** Siblings in the same category, for the rail. */
  related: RailRelatedItem[];
}) {
  const registryItem = registryItemName(icon.slug, variation.name);
  const installCmd = installCommand(registryItem);

  const railMeta = [
    { label: "Tier", value: variation.tier },
    { label: "Category", value: icon.category },
    { label: "Motion", value: variation.animationType },
    ...(variation.dependencies?.length
      ? [{ label: "Deps", value: variation.dependencies.join(", ") }]
      : []),
  ];

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* ── Middle: header + configurator + example component ──
          Takes all the width the rail doesn't, so the two columns sit flush
          rather than with a dead gutter between them. */}
      <div className="min-w-0 flex-1 overflow-y-auto py-12 px-4 sm:py-14 sm:px-10 md:py-16 md:px-16">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <Paragraph variant="title" className="font-mono">
            <Paragraph as="span" variant="crumb">
              icons
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {" / "}
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {icon.name.replace(/ Icon$/i, "")}
            </Paragraph>
            <Paragraph as="span" variant="crumb">
              {" / "}
            </Paragraph>
            <span className="text-foreground">{variation.displayName}</span>
          </Paragraph>
          <Paragraph variant="lead" className="mb-8 mt-1">
            {variation.description}
          </Paragraph>

          {variation.designNote && (
            <div className="mb-8 bg-card text-card-foreground border border-border corner-squircle rounded-[10px] p-4">
              <Paragraph variant="body" className="text-foreground">
                <strong className="font-medium">Design Note:</strong>{" "}
                {variation.designNote}
              </Paragraph>
            </div>
          )}
        </motion.div>

        {/* The rail carries share above xl; this is the copy for narrower
            screens, matching how the install command is handled. */}
        <div className="mb-3 flex justify-end xl:hidden">
          <ShareButton title={`${icon.name} — ${variation.displayName}`} />
        </div>

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

        {/* ── Installation + props + inspiration (below the example) ── */}
        <div className="mt-10 space-y-8">
          {/* Installation — directly above the props table, at every width. */}
          <InstallCommand command={installCmd} className="" />

          {variation.props && variation.props.length > 0 && (
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

      <DetailRail
        registryName={registryItem}
        sourcePath={`components/craftui/icons/${icon.slug}/${variation.name}.tsx`}
        itemLabel={`${icon.name} — ${variation.displayName}`}
        description={variation.description}
        meta={railMeta}
        related={related}
        relatedLabel={`More ${icon.category}`}
      />
    </div>
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

  // Icons are small SVGs, so each related row carries a live thumbnail — the
  // point of the list is recognising the shape, not reading the name. The
  // thumbnail shows the icon's first variation; the link opens it there too.
  const related: RailRelatedItem[] = pickRelated(icons, activeSlug ?? "").map(
    (item) => {
      const first = item.variations[0]?.name ?? "default";
      return {
        label: item.name.replace(/ Icon$/i, ""),
        href: `/icons?slug=${item.slug}&variation=${first}`,
        preview: (
          <RailMiniPreview
            catalogDir="icons"
            slug={item.slug}
            variation={first}
          />
        ),
      };
    },
  );

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
          {!activeIcon ? null : activeVariationData ? (
            <VariationDetail
              icon={activeIcon}
              variation={activeVariationData}
              buttonCode={buttonCodes[`${activeSlug}-${activeVariation}`]}
              panelKey={panelKey}
              related={related}
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
