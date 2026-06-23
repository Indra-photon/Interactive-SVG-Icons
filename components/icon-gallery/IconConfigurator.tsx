"use client";

import { useMemo, useState } from "react";
import { useDialKit } from "dialkit";
import { IconPreview } from "./IconPreview";
import {
  buildIconDialKitConfig,
  buildIconNormalizedDefaults,
  unpackIconDialKitValues,
  iconSlugToComponentName,
} from "@/lib/icon-dialkit-config";
import type { PropDefinition } from "@/types/icon";
import { Button } from "../ui/button";

interface IconVariation {
  name: string;
  displayName: string;
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
    } else if (typeof value === "number") {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)[\\d.]+(?=,)`, "g"),
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

  const componentName = iconSlugToComponentName(iconSlug);
  const panelName = `${iconName} — ${variation.displayName}`;

  const dialKitConfig = useMemo(
    () => buildIconDialKitConfig(variation.props),
    [variation.props],
  );
  const defaults = useMemo(
    () => buildIconNormalizedDefaults(variation.props),
    [variation.props],
  );

  const rawParams = useDialKit(panelName, dialKitConfig) as Record<string, any>;
  const propValues = useMemo(
    () => unpackIconDialKitValues(rawParams),
    [rawParams],
  );

  const changed = isChanged(propValues, defaults);
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
      <div className="flex items-center justify-end px-5 py-3 bg-white border-b border-stone-100">
        <span className="text-[11px] font-mono text-stone-400">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="corner-squircle w-full min-w-0 rounded-[10px] font-mono text-left text-xs tracking-tighter relative overflow-hidden"
          >
            <span>Open in DialKit</span>
          </Button>
        </span>
        {changed && (
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
