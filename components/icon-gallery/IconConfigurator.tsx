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

// ── Source substitution ───────────────────────────────────────────────────────

function substituteSource(
  source: string,
  propValues: Record<string, any>,
  defaults: Record<string, any>,
) {
  let result = source;
  for (const [name, value] of Object.entries(propValues)) {
    if (JSON.stringify(value) === JSON.stringify(defaults[name])) continue;
    if (typeof value === "string") {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)["'][^"']*["'](?=,)`, "g"),
        `$1"${value}"`,
      );
    } else if (Array.isArray(value)) {
      result = result.replace(
        new RegExp(
          `(${name}\\s*=\\s*)(?:["'][^'"]*["']|\\[[^\\]]*\\])(?=,)`,
          "g",
        ),
        `$1${JSON.stringify(value)}`,
      );
    } else if (typeof value === "number") {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)[\\d.]+(?=,)`, "g"),
        `$1${value}`,
      );
    } else if (typeof value === "boolean") {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)(?:true|false)(?=,)`, "g"),
        `$1${value}`,
      );
    }
  }
  return result;
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
  const [copied, setCopied] = useState<"usage" | "source" | null>(null);
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

  const copyUsage = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied("usage");
    setTimeout(() => setCopied(null), 2000);
  };

  const copySource = async () => {
    try {
      const res = await fetch(`/r/${iconSlug}-${variation.name}.json`);
      const data = await res.json();
      const original = data.files[0].content as string;
      const modified = substituteSource(original, propValues, defaults);
      await navigator.clipboard.writeText(modified);
      setCopied("source");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error("Failed to copy source");
    }
  };

  return (
    <div className="corner-squircle rounded-[10px] border border-border overflow-hidden">
      {/* Preview */}
      <div className="bg-stone-50 border-b border-stone-200 flex items-center justify-center py-10">
        <IconPreview
          iconSlug={iconSlug}
          variationName={variation.name}
          animationType={variation.animationType}
          props={variation.props}
          propValues={propValues}
        />
      </div>

      {/* Hint + reset bar */}
      <div className="flex items-center justify-end gap-2 px-5 py-3 bg-white border-b border-stone-100">
        {isSpringMode ? (
          <span className="text-[11px] font-mono text-amber-600">
            Switch to <strong>Easing</strong> mode in the DialKit panel — spring
            is not yet supported
          </span>
        ) : (
          <Button
            size="lg"
            variant={dialKitOpen ? "default" : "outline"}
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
            variant="outline"
            onClick={() => {
              onReset();
              setCopied(null);
            }}
            className="corner-squircle rounded-[10px] font-mono text-left text-xs tracking-tighter relative overflow-hidden"
          >
            <span>Reset to Default</span>
          </Button>
        )}
      </div>

      {/* Code panel — only when something changed */}
      {changed && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Code
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyUsage}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                  copied === "usage"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {copied === "usage" ? "✓ copied" : "copy usage"}
              </button>
              <button
                onClick={copySource}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                  copied === "source"
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {copied === "source" ? "✓ copied" : "copy source"}
              </button>
            </div>
          </div>

          <pre className="bg-stone-950 text-stone-100 rounded-lg p-4 text-[12px] font-mono leading-relaxed overflow-auto whitespace-pre">
            {snippet}
          </pre>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            <strong className="text-stone-600">copy usage</strong> — paste at
            call site.
            <br />
            <strong className="text-stone-600">copy source</strong> — paste over
            your installed file to bake in defaults.
          </p>
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
