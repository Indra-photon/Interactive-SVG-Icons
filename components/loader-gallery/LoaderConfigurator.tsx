'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDialKit } from 'dialkit';
import { LoaderPreview } from './LoaderPreview';
import { buildDialKitConfig, buildNormalizedDefaults, unpackDialKitValues, detectSpringMode } from '@/lib/dialkit-config';
import type { PropDefinition } from '@/types/loader';

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

// ── Source modification ───────────────────────────────────────────────────────

function substituteSource(source: string, propValues: Record<string, any>, defaults: Record<string, any>) {
  let result = source;
  for (const [name, value] of Object.entries(propValues)) {
    if (JSON.stringify(value) === JSON.stringify(defaults[name])) continue;
    if (typeof value === 'string') {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)["'][^"']*["'](?=,)`, 'g'),
        `$1"${value}"`
      );
    } else if (Array.isArray(value)) {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)(?:["'][^'"]*["']|\\[[^\\]]*\\])(?=,)`, 'g'),
        `$1${JSON.stringify(value)}`
      );
    } else if (typeof value === 'number') {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)[\\d.]+(?=,)`, 'g'),
        `$1${value}`
      );
    } else if (typeof value === 'boolean') {
      result = result.replace(
        new RegExp(`(${name}\\s*=\\s*)(?:true|false)(?=,)`, 'g'),
        `$1${value}`
      );
    }
  }
  return result;
}

// ── Code snippet generation ───────────────────────────────────────────────────

function buildUsageSnippet(componentName: string, propValues: Record<string, any>, defaults: Record<string, any>) {
  const changed = Object.entries(propValues).filter(
    ([k, v]) => JSON.stringify(v) !== JSON.stringify(defaults[k])
  );
  if (!changed.length) return `<${componentName} />`;
  const attrs = changed.map(([k, v]) => {
    if (typeof v === 'string') return `  ${k}="${v}"`;
    if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
    return `  ${k}={${v}}`;
  });
  return `<${componentName}\n${attrs.join('\n')}\n/>`;
}

function isChanged(values: Record<string, any>, defaults: Record<string, any>) {
  for (const key of Object.keys(defaults)) {
    if (JSON.stringify(values[key]) !== JSON.stringify(defaults[key])) return true;
  }
  return false;
}

// ── Inner component (holds useDialKit; remounts on reset via key) ─────────────

interface InnerProps extends LoaderConfiguratorProps {
  onReset: () => void;
}

function LoaderConfiguratorInner({ loaderSlug, variation, onReset }: InnerProps) {
  const [copied, setCopied] = useState<'usage' | 'source' | null>(null);

  const dialKitConfig = useMemo(() => buildDialKitConfig(variation.props), [variation.props]);
  const defaults = useMemo(() => buildNormalizedDefaults(variation.props), [variation.props]);

  const params = useDialKit(variation.displayName, dialKitConfig);

  const rawParams = params as Record<string, any>;

  const isSpringMode = useMemo(
    () => detectSpringMode(rawParams, variation.props),
    [rawParams, variation.props]
  );

  const propValues = useMemo(
    () => unpackDialKitValues(rawParams, variation.props),
    [rawParams, variation.props]
  );

  // Changes to ease/duration don't interrupt a running Framer Motion repeat loop —
  // they only apply at the next cycle. Keying on all ease+duration values remounts
  // the loader immediately so the new transition takes effect right away.
  // In spring mode all ease values fall back to defaults, so no spurious remount occurs.
  const animationKey = useMemo(() => {
    const keys: string[] = [];
    for (const p of variation.props) {
      if (p.type === 'ease') {
        keys.push(p.name);
        const durName = p.name === 'ease' ? 'duration' : p.name.replace(/Ease$/, 'Duration');
        if (variation.props.some(x => x.name === durName)) keys.push(durName);
      }
    }
    return keys.map(k => JSON.stringify(propValues[k])).join('-');
  }, [variation.props, propValues]);

  const changed = !isSpringMode && isChanged(propValues, defaults);
  const snippet = buildUsageSnippet(variation.componentName, propValues, defaults);

  const copyUsage = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied('usage');
    setTimeout(() => setCopied(null), 2000);
  };

  const copySource = async () => {
    try {
      const res = await fetch(`/r/${loaderSlug}-${variation.name}.json`);
      const data = await res.json();
      const original = data.files[0].content as string;
      const modified = substituteSource(original, propValues, defaults);
      await navigator.clipboard.writeText(modified);
      setCopied('source');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error('Failed to copy source');
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">

      {/* Preview — full width now that controls live in the DialKit panel */}
      <div className="bg-stone-50 border-b border-stone-200 flex items-center justify-center py-20 min-h-[300px]">
        <LoaderPreview
          loaderSlug={loaderSlug}
          variationName={variation.name}
          propValues={propValues}
          animationKey={animationKey}
        />
      </div>

      {/* Hint + reset bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-stone-100">
        {isSpringMode ? (
          <span className="text-[11px] font-mono text-amber-600">
            Switch to{' '}
            <strong>Easing</strong>
            {' '}mode in the DialKit panel — spring is not yet supported
          </span>
        ) : (
          <span className="text-[11px] font-mono text-stone-400">
            Configure in the{' '}
            <span className="text-stone-600 font-semibold">DialKit panel</span>
            {' '}↘
          </span>
        )}
        {changed && !isSpringMode && (
          <button
            onClick={() => { onReset(); setCopied(null); }}
            className="text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Code panel — only visible when at least one value has changed */}
      {changed && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Code</span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyUsage}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                  copied === 'usage'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {copied === 'usage' ? '✓ copied' : 'copy usage'}
              </button>
              <button
                onClick={copySource}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                  copied === 'source'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {copied === 'source' ? '✓ copied' : 'copy source'}
              </button>
            </div>
          </div>

          <pre className="bg-stone-950 text-stone-100 rounded-lg p-4 text-[12px] font-mono leading-relaxed overflow-auto whitespace-pre">
            {snippet}
          </pre>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            <strong className="text-stone-600">copy usage</strong> — paste at call site.<br />
            <strong className="text-stone-600">copy source</strong> — paste over your installed file to bake in defaults.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Shell — owns reset key so Inner remounts cleanly on reset ─────────────────

export function LoaderConfigurator({ loaderSlug, variation }: LoaderConfiguratorProps) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <LoaderConfiguratorInner
      key={resetKey}
      loaderSlug={loaderSlug}
      variation={variation}
      onReset={() => setResetKey(k => k + 1)}
    />
  );
}
