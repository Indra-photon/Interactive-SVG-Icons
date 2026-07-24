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
import { InstallCommand } from "@/components/InstallCommand";
import { PropsTable } from "@/components/PropsTable";
import { Paragraph } from "@/components/Paragraph";
import type { UIComponent } from "@/types/ui-component";

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
      {/* ── Middle: configurator + installation + props + features ── */}
      <div className="w-full max-w-5xl min-h-0 overflow-y-auto py-12 px-4 sm:py-14 sm:px-10 md:py-16 md:px-16">
        <motion.div
          key={panelKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <Paragraph variant="overview-Title" className="font-mono">
            <span className="text-muted-foreground">ui</span>
            <span className="text-muted-foreground">{" / "}</span>
            <span className="text-muted-foreground">{component.name}</span>
            <span className="text-muted-foreground">{" / "}</span>
            <span className="text-foreground">{variation.displayName}</span>
          </Paragraph>
          <Paragraph variant="panel-Description" className="mb-8">
            {variation.description}
          </Paragraph>

          <UIConfigurator
            componentSlug={component.slug}
            variation={variation}
            onSnippetChange={setActiveSnippet}
          />

          {/* Usage code */}
          <div className="corner-squircle mt-6 rounded-[10px] border border-border p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <Paragraph
                variant="panel-Description"
                className="max-w-xl leading-tight"
              >
                Copy the code snippet and use directly with new configured values
                after installation.
              </Paragraph>
              <div className="shrink-0">
                <CopyButton label="copy usage" text={activeSnippet} size="xs" />
              </div>
            </div>

            <pre className="corner-squircle bg-muted text-foreground border border-border rounded-[8px] p-4 text-[14px] font-mono leading-relaxed overflow-auto whitespace-pre">
              {activeSnippet}
            </pre>
          </div>

          {/* Installation */}
          <InstallCommand command={installCommand} />

          {/* Props table */}
          {variation.props?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 mb-3">
                Props
              </h2>
              <PropsTable props={variation.props} />
            </div>
          )}

          {/* ── Features + inspiration (below the example) ── */}
          <div className="mt-10 space-y-8">
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
          </div>
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
          style={{ gridTemplateColumns: "1fr" }}
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
