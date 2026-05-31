'use client';

import { useCallback, useMemo, useState } from 'react';
import { LoaderPreview } from './LoaderPreview';
import { EasingPicker } from './EasingPicker';
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

// ── Prop helpers ─────────────────────────────────────────────────────────────

function isColorProp(p: PropDefinition) {
  return p.type === 'string';
}

function buildInitialState(props: PropDefinition[]) {
  const state: Record<string, any> = {};
  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    state[p.name] = p.default;
  }
  return state;
}

function isChanged(values: Record<string, any>, defaults: Record<string, any>) {
  for (const key of Object.keys(values)) {
    if (JSON.stringify(values[key]) !== JSON.stringify(defaults[key])) return true;
  }
  return false;
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

// ── Controls ─────────────────────────────────────────────────────────────────

function ColorControl({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const hex = value.startsWith('#') ? value : '#000000';
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-mono text-stone-500 w-24 shrink-0">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-8 h-8 rounded-md border border-stone-200 overflow-hidden shrink-0">
          <input
            type="color"
            value={hex}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-full h-full" style={{ background: value === 'currentColor' ? '#000' : value }} />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 text-xs font-mono text-stone-700 bg-white border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-400 min-w-0"
        />
      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-mono text-stone-500 w-24 shrink-0">{label}</label>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-stone-900 h-1 cursor-pointer"
        />
        <span className="text-xs font-mono text-stone-700 w-12 text-right shrink-0">{value}</span>
      </div>
    </div>
  );
}

function ToggleControl({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-mono text-stone-500 w-24 shrink-0">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${value ? 'bg-stone-900' : 'bg-stone-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      <span className="text-xs font-mono text-stone-400">{value ? 'true' : 'false'}</span>
    </div>
  );
}

function SelectControl({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-mono text-stone-500 w-24 shrink-0">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 text-xs font-mono text-stone-700 bg-white border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-stone-400"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function LoaderConfigurator({ loaderSlug, variation }: LoaderConfiguratorProps) {
  const defaults = useMemo(() => buildInitialState(variation.props), [variation.props]);
  const [values, setValues] = useState<Record<string, any>>(defaults);
  const [copied, setCopied] = useState<'usage' | 'source' | null>(null);

  const configProps = variation.props.filter(p => p.name !== 'width' && p.name !== 'height');
  const changed = isChanged(values, defaults);
  const snippet = buildUsageSnippet(variation.componentName, values, defaults);

  const set = useCallback((key: string, val: any) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    setValues(defaults);
    setCopied(null);
  }, [defaults]);

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
      const modified = substituteSource(original, values, defaults);
      await navigator.clipboard.writeText(modified);
      setCopied('source');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error('Failed to copy source');
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      {/* Preview */}
      <div className="bg-stone-50 border-b border-stone-200 flex items-center justify-center py-16 min-h-[240px]">
        <LoaderPreview loaderSlug={loaderSlug} variationName={variation.name} propValues={values} />
      </div>

      {/* Bottom: controls + code */}
      <div className={`grid transition-all duration-300 ${changed ? 'md:grid-cols-[1fr_1fr]' : 'grid-cols-1'}`}>

        {/* Controls */}
        <div className="p-5 space-y-4 border-stone-200 border-r-0 md:border-r">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Configure</span>
            {changed && (
              <button
                onClick={reset}
                className="text-[11px] font-mono text-stone-400 hover:text-stone-700 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {configProps.map(prop => {
              const val = values[prop.name];

              if (prop.type === 'ease') {
                return (
                  <div key={prop.name} className="flex items-center gap-3">
                    <label className="text-xs font-mono text-stone-500 w-24 shrink-0">{prop.name}</label>
                    <div className="flex-1">
                      <EasingPicker value={val} onChange={v => set(prop.name, v)} />
                    </div>
                  </div>
                );
              }

              if (prop.type === 'string') {
                return (
                  <ColorControl
                    key={prop.name}
                    label={prop.name}
                    value={typeof val === 'string' ? val : '#000000'}
                    onChange={v => set(prop.name, v)}
                  />
                );
              }

              if (prop.type === 'number') {
                const min = prop.min ?? 0;
                const max = prop.max ?? 100;
                const step = prop.step ?? 1;
                return (
                  <SliderControl
                    key={prop.name}
                    label={prop.name}
                    value={typeof val === 'number' ? val : Number(prop.default)}
                    min={min} max={max} step={step}
                    onChange={v => set(prop.name, v)}
                  />
                );
              }

              if (prop.type === 'boolean') {
                return (
                  <ToggleControl
                    key={prop.name}
                    label={prop.name}
                    value={typeof val === 'boolean' ? val : Boolean(prop.default)}
                    onChange={v => set(prop.name, v)}
                  />
                );
              }

              if (prop.type === 'enum' && prop.options) {
                return (
                  <SelectControl
                    key={prop.name}
                    label={prop.name}
                    value={typeof val === 'string' ? val : String(prop.default)}
                    options={prop.options as string[]}
                    onChange={v => set(prop.name, v)}
                  />
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Code panel — only shown when changed */}
        {changed && (
          <div className="p-5 flex flex-col gap-3 border-t border-stone-200 md:border-t-0">
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

            <pre className="flex-1 bg-stone-950 text-stone-100 rounded-lg p-4 text-[12px] font-mono leading-relaxed overflow-auto whitespace-pre">
              {snippet}
            </pre>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              <strong className="text-stone-600">copy usage</strong> — paste at call site.<br />
              <strong className="text-stone-600">copy source</strong> — paste over your installed file to bake in defaults.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
