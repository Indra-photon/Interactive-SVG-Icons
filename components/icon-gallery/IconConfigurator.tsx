"use client";

import { useMemo, useState } from "react";
import { useDialKit } from "dialkit";
import { IconPreview } from "./IconPreview";
import {
  buildDialKitConfig,
  buildNormalizedDefaults,
  unpackDialKitValues,
  detectSpringMode,
  iconSlugToComponentName,
  type DialKitBuildOptions,
} from "@/lib/dialkit-config";
import { useDialKitPanel } from "@/lib/useDialKitPanel";
import type { PropDefinition } from "@/types/icon";
import { Button } from "../ui/button";
import { Paragraph } from "@/components/Paragraph";
import { CopyButton } from "@/components/loader-gallery/CopyButton";

// Icon booleans are animation triggers managed by the preview; className is a
// developer utility. Neither belongs in the DialKit panel.
const ICON_DIALKIT_OPTS: DialKitBuildOptions = {
  excludeBooleans: true,
  excludeNames: ["className"],
};

interface IconVariation {
  name: string;
  displayName: string;
  componentName?: string;
  tier: string;
  description: string;
  animationType: string;
  props: PropDefinition[];
}

interface IconConfiguratorProps {
  iconSlug: string;
  iconName: string;
  variation: IconVariation;
}

// ── Usage snippet ─────────────────────────────────────────────────────────────

function buildUsageSnippet(
  componentName: string,
  propValues: Record<string, any>,
  defaults: Record<string, any>,
) {
  const changed = Object.entries(propValues).filter(
    ([k, v]) => JSON.stringify(v) !== JSON.stringify(defaults[k]),
  );
  if (!changed.length) return `<${componentName} />`;
  const attrs = changed.map(([k, v]) => {
    if (typeof v === "string") return `  ${k}="${v}"`;
    if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
    return `  ${k}={${v}}`;
  });
  return `<${componentName}\n${attrs.join("\n")}\n/>`;
}

function isChanged(values: Record<string, any>, defaults: Record<string, any>) {
  for (const key of Object.keys(defaults)) {
    if (JSON.stringify(values[key]) !== JSON.stringify(defaults[key]))
      return true;
  }
  return false;
}

// ── Inner (holds useDialKit; remounts on reset via key) ───────────────────────

interface InnerProps extends IconConfiguratorProps {
  onReset: () => void;
}

function IconConfiguratorInner({
  iconSlug,
  iconName,
  variation,
  onReset,
}: InnerProps) {
  const { isOpen: dialKitOpen, toggle: toggleDialKit } = useDialKitPanel();

  const componentName =
    variation.componentName || iconSlugToComponentName(iconSlug);
  const panelName = `${iconName} — ${variation.displayName}`;

  const dialKitConfig = useMemo(
    () => buildDialKitConfig(variation.props, ICON_DIALKIT_OPTS),
    [variation.props],
  );
  const defaults = useMemo(
    () => buildNormalizedDefaults(variation.props, ICON_DIALKIT_OPTS),
    [variation.props],
  );

  const rawParams = useDialKit(panelName, dialKitConfig) as Record<string, any>;

  const isSpringMode = useMemo(
    () => detectSpringMode(rawParams, variation.props),
    [rawParams, variation.props],
  );

  const propValues = useMemo(
    () => unpackDialKitValues(rawParams, variation.props),
    [rawParams, variation.props],
  );

  const changed = !isSpringMode && isChanged(propValues, defaults);
  const snippet = buildUsageSnippet(componentName, propValues, defaults);

  return (
    <div className="corner-squircle rounded-[10px] border border-border overflow-hidden">
      {/* Preview */}
      <div className="bg-muted border-b border-border flex items-center justify-center py-10">
        <IconPreview
          iconSlug={iconSlug}
          variationName={variation.name}
          animationType={variation.animationType}
          props={variation.props}
          propValues={propValues}
        />
      </div>

      {/* Hint + reset bar */}
      <div className="flex items-center justify-end gap-2 px-5 py-3 bg-card text-card-foreground border-b border-border">
        {isSpringMode ? (
          <span className="text-[11px] font-mono text-amber-600">
            Switch to <strong>Easing</strong> mode in the DialKit panel — spring
            is not yet supported
          </span>
        ) : (
          <Button
            size="lg"
            variant="ghost"
            className="corner-squircle rounded-[10px] font-mono text-left text-xs tracking-tighter relative overflow-hidden"
            onClick={toggleDialKit}
          >
            {dialKitOpen ? "Close DialKit" : "Open in DialKit"}
          </Button>
        )}
        {changed && !isSpringMode && (
          <Button
            asChild
            size="lg"
            variant="ghost"
            onClick={onReset}
            className="corner-squircle rounded-[10px] font-mono text-left text-xs tracking-tighter relative overflow-hidden"
          >
            <span>Reset to Default</span>
          </Button>
        )}
      </div>

      {/* Code panel — only when something changed */}
      {changed && (
        <div className="p-5 flex flex-col gap-3 border-t border-border">
          <div className="flex items-center justify-between gap-3">
            <Paragraph
              variant="body"
              className="max-w-xl leading-tight"
            >
              Copy the code snippet and use directly with new configured values
              after installation.
            </Paragraph>
            <div className="shrink-0">
              <CopyButton label="copy usage" text={snippet} size="xs" />
            </div>
          </div>

          <pre className="corner-squircle bg-muted text-foreground border border-border rounded-[8px] p-4 text-[14px] font-mono leading-relaxed overflow-auto whitespace-pre">
            {snippet}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Shell — owns reset key ────────────────────────────────────────────────────

export function IconConfigurator({
  iconSlug,
  iconName,
  variation,
}: IconConfiguratorProps) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <IconConfiguratorInner
      key={resetKey}
      iconSlug={iconSlug}
      iconName={iconName}
      variation={variation}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}
