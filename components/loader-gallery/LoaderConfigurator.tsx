"use client";

import { useMemo, useState } from "react";
import { useDialKit } from "dialkit";
import { LoaderPreview } from "./LoaderPreview";
import { LoaderPropsContext } from "./LoaderPropsContext";
import {
  buildDialKitConfig,
  buildNormalizedDefaults,
  unpackDialKitValues,
  detectSpringMode,
} from "@/lib/dialkit-config";
import { useDialKitPanel } from "@/lib/useDialKitPanel";
import type { PropDefinition } from "@/types/loader";
import { Button } from "../ui/button";
import { Paragraph } from "@/components/Paragraph";
import { CopyButton } from "@/components/loader-gallery/CopyButton";

interface Variation {
  name: string;
  displayName: string;
  componentName: string;
  tier: string;
  description: string;
  props: PropDefinition[];
}

interface LoaderConfiguratorProps {
  loaderSlug: string;
  variation: Variation;
}

// ── Code snippet generation ───────────────────────────────────────────────────

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

// ── Inner component (holds useDialKit; remounts on reset via key) ─────────────

interface InnerProps extends LoaderConfiguratorProps {
  onReset: () => void;
}

function LoaderConfiguratorInner({
  loaderSlug,
  variation,
  onReset,
}: InnerProps) {
  const { isOpen: dialKitOpen, toggle: toggleDialKit } = useDialKitPanel();

  const dialKitConfig = useMemo(
    () => buildDialKitConfig(variation.props),
    [variation.props],
  );
  const defaults = useMemo(
    () => buildNormalizedDefaults(variation.props),
    [variation.props],
  );

  const params = useDialKit(variation.displayName, dialKitConfig);

  const rawParams = params as Record<string, any>;

  const isSpringMode = useMemo(
    () => detectSpringMode(rawParams, variation.props),
    [rawParams, variation.props],
  );

  const propValues = useMemo(
    () => unpackDialKitValues(rawParams, variation.props),
    [rawParams, variation.props],
  );

  const changed = !isSpringMode && isChanged(propValues, defaults);
  const snippet = buildUsageSnippet(
    variation.componentName,
    propValues,
    defaults,
  );

  return (
    <div className="corner-squircle rounded-[10px] border border-border overflow-hidden">
      {/* Preview — full width now that controls live in the DialKit panel */}
      <div className="bg-muted border-b border-border flex items-center justify-center py-20 min-h-[300px]">
        <LoaderPropsContext.Provider value={propValues}>
          <LoaderPreview
            loaderSlug={loaderSlug}
            variationName={variation.name}
          />
        </LoaderPropsContext.Provider>
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

      {/* Code panel — only visible when at least one value has changed */}
      {changed && (
        <div className="p-5 flex flex-col gap-3 border-t border-border">
          <div className="flex items-center justify-between gap-3">
            <Paragraph
              variant="panel-Description"
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

// ── Shell — owns reset key so Inner remounts cleanly on reset ─────────────────

export function LoaderConfigurator({
  loaderSlug,
  variation,
}: LoaderConfiguratorProps) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <LoaderConfiguratorInner
      key={resetKey}
      loaderSlug={loaderSlug}
      variation={variation}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}
