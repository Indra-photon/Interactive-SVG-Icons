"use client";

import { useMemo, useState, useEffect } from "react";
import { useDialKit } from "dialkit";
import { UIPreview } from "./UIPreview";
import { UIPropsContext } from "./UIPropsContext";
import {
  buildDialKitConfig,
  buildNormalizedDefaults,
  unpackDialKitValues,
} from "@/lib/dialkit-config";
import { useDialKitPanel } from "@/lib/useDialKitPanel";
import type { PropDefinition } from "@/types/loader";
import { Button } from "@/components/ui/button";
import { Paragraph } from "../Paragraph";

interface Variation {
  name: string;
  displayName: string;
  componentName: string;
  props: PropDefinition[];
  previewHint?: string;
}

interface UIConfiguratorProps {
  componentSlug: string;
  variation: Variation;
  onSnippetChange?: (snippet: string) => void;
}

// Documented in the props table but not dialable — state/a11y wiring, not motion.
const DIAL_OPTS = {
  excludeNames: [
    "value",
    "defaultValue",
    "label",
    "disabled",
    "autoFocus",
    "className",
  ],
};

// ── Code generation ───────────────────────────────────────────────────────────

// Static (non-dial) attrs each component's snippet always carries, keyed by slug.
const STATIC_SNIPPET_ATTRS: Record<string, string[]> = {
  accordion: ["items={items}"],
  "otp-input": [
    "validate={(code) => verify(code)}",
    "onSuccess={handleVerified}",
  ],
};

function buildUsageSnippet(
  componentSlug: string,
  componentName: string,
  propValues: Record<string, any>,
  defaults: Record<string, any>,
) {
  const staticAttrs = STATIC_SNIPPET_ATTRS[componentSlug] ?? [];
  const changed = Object.entries(propValues).filter(
    ([k, v]) => JSON.stringify(v) !== JSON.stringify(defaults[k]),
  );
  if (!changed.length && staticAttrs.length <= 1) {
    return staticAttrs.length
      ? `<${componentName} ${staticAttrs[0]} />`
      : `<${componentName} />`;
  }
  const attrs = [
    ...staticAttrs.map((a) => `  ${a}`),
    ...changed.map(([k, v]) => {
      if (typeof v === "string") return `  ${k}="${v}"`;
      if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
      return `  ${k}={${v}}`;
    }),
  ];
  return `<${componentName}\n${attrs.join("\n")}\n/>`;
}

function isChanged(values: Record<string, any>, defaults: Record<string, any>) {
  for (const key of Object.keys(defaults)) {
    if (JSON.stringify(values[key]) !== JSON.stringify(defaults[key]))
      return true;
  }
  return false;
}

// ── Inner (holds useDialKit; remounts on reset) ───────────────────────────────

interface InnerProps extends UIConfiguratorProps {
  onReset: () => void;
}

function UIConfiguratorInner({
  componentSlug,
  variation,
  onReset,
  onSnippetChange,
}: InnerProps) {
  const { isOpen: dialKitOpen, toggle: toggleDialKit } = useDialKitPanel();

  const dialKitConfig = useMemo(
    () => buildDialKitConfig(variation.props, DIAL_OPTS),
    [variation.props],
  );
  const defaults = useMemo(
    () => buildNormalizedDefaults(variation.props, DIAL_OPTS),
    [variation.props],
  );

  const params = useDialKit(variation.displayName, dialKitConfig);
  const rawParams = params as Record<string, any>;

  const propValues = useMemo(
    () => unpackDialKitValues(rawParams, variation.props),
    [rawParams, variation.props],
  );

  const changed = isChanged(propValues, defaults);
  const snippet = buildUsageSnippet(
    componentSlug,
    variation.componentName,
    propValues,
    defaults,
  );

  useEffect(() => {
    onSnippetChange?.(snippet);
  }, [snippet]);

  return (
    <div className="corner-squircle rounded-[10px] border border-border overflow-hidden">
      {/* Preview */}
      <div className="bg-muted/30 border-b border-border min-h-[420px]">
        <UIPropsContext.Provider value={propValues}>
          <UIPreview
            componentSlug={componentSlug}
            variationName={variation.name}
          />
        </UIPropsContext.Provider>
      </div>

      {/* Hint + action bar */}
      <div className="flex items-center justify-between gap-2 px-5 py-3 bg-background">
        {variation.previewHint ? (
          <Paragraph variant="body" className="">
            {variation.previewHint}
          </Paragraph>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="corner-squircle rounded-[8px] font-mono text-xs tracking-tighter"
            onClick={toggleDialKit}
          >
            {dialKitOpen ? "Close DialKit" : "Open in DialKit"}
          </Button>
          {changed && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              className="corner-squircle rounded-[8px] font-mono text-xs tracking-tighter"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Shell — owns reset key ────────────────────────────────────────────────────

export function UIConfigurator({
  componentSlug,
  variation,
  onSnippetChange,
}: UIConfiguratorProps) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <UIConfiguratorInner
      key={resetKey}
      componentSlug={componentSlug}
      variation={variation}
      onSnippetChange={onSnippetChange}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}
