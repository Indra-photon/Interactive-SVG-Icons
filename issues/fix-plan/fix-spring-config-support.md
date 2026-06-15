# Fix Plan: Spring Config (Time / Physics Mode) Support

## Overview

Two options are presented. **Option A** is a safe short-term guard that prevents broken state without architectural change. **Option B** is the full, correct implementation that makes spring configs work end-to-end. Both are documented here so Option A can ship immediately while Option B is planned properly.

---

## Option A — Guard Against Spring Mode (Short-Term)

### What it does
Detects when DialKit returns a `SpringConfig` (user switched to Time or Physics tab), falls back to the last known easing values, and shows a subtle hint in the panel hint bar that spring mode is not yet supported.

### Files changed: 2

---

### 1. `lib/dialkit-config.ts` — `unpackDialKitValues`

**Current code (lines 105–128):**
```ts
export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): Record<string, any> {
  const result: Record<string, any> = {};
  const easeProp = props.find(p => p.type === 'ease');
  const durationProp = props.find(p => p.name === 'duration');

  for (const [key, value] of Object.entries(params)) {
    if (easeProp && key === easeProp.name) {
      const transition = value as TransitionConfig;
      if (transition?.type === 'easing') {
        result[easeProp.name] = transition.ease;
        if (durationProp) result['duration'] = transition.duration;
      } else {
        result[key] = value;   // ← BUG: passes raw SpringConfig as ease prop
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

**Change:** The function needs to return a second signal alongside the values — whether the current mode is spring. Add a return type that carries an `isSpringMode` flag, OR export a separate utility that checks. The simplest approach is to return the flag as a special key that the caller reads and then deletes before passing to `LoaderPreview`.

**New code:**
```ts
// Add to return type — the caller strips this before passing to LoaderPreview
export type UnpackedValues = Record<string, any> & { __isSpringMode?: boolean };

export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): UnpackedValues {
  const result: UnpackedValues = {};
  const easeProp = props.find(p => p.type === 'ease');
  const durationProp = props.find(p => p.name === 'duration');

  for (const [key, value] of Object.entries(params)) {
    if (easeProp && key === easeProp.name) {
      const transition = value as TransitionConfig;
      if (transition?.type === 'easing') {
        result[easeProp.name] = transition.ease;
        if (durationProp) result['duration'] = transition.duration;
      } else {
        // Spring mode: keep defaults for ease and duration, signal the caller
        result[easeProp.name] = props.find(p => p.name === easeProp.name)?.default
          ?? [0.42, 0, 0.58, 1];
        if (durationProp) result['duration'] = durationProp.default;
        result.__isSpringMode = true;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

---

### 2. `components/loader-gallery/LoaderConfigurator.tsx` — `LoaderConfiguratorInner`

**What changes:** Read `__isSpringMode` from `propValues`, strip it before passing to `LoaderPreview`, and show a hint in the hint bar when spring mode is active.

**Current hint bar (lines 140–154):**
```tsx
<div className="flex items-center justify-between px-5 py-3 bg-white border-b border-stone-100">
  <span className="text-[11px] font-mono text-stone-400">
    Configure in the{' '}
    <span className="text-stone-600 font-semibold">DialKit panel</span>
    {' '}↘
  </span>
  {changed && (
    <button onClick={...}>Reset</button>
  )}
</div>
```

**New code:**
```tsx
// After propValues is computed:
const isSpringMode = propValues.__isSpringMode === true;
const safeProps = Object.fromEntries(
  Object.entries(propValues).filter(([k]) => k !== '__isSpringMode')
);

// Hint bar:
<div className="flex items-center justify-between px-5 py-3 bg-white border-b border-stone-100">
  <span className="text-[11px] font-mono text-stone-400">
    {isSpringMode ? (
      <span className="text-amber-600 font-semibold">
        Switch to Easing mode — spring is not yet supported
      </span>
    ) : (
      <>
        Configure in the{' '}
        <span className="text-stone-600 font-semibold">DialKit panel</span>
        {' '}↘
      </>
    )}
  </span>
  {changed && !isSpringMode && (
    <button onClick={...}>Reset</button>
  )}
</div>

// Pass safeProps to LoaderPreview instead of propValues:
<LoaderPreview
  loaderSlug={loaderSlug}
  variationName={variation.name}
  propValues={safeProps}           // ← safeProps, not propValues
  animationKey={animationKey}
/>
```

Also update `buildUsageSnippet` and `copySource` calls to use `safeProps`:
```tsx
const changed = !isSpringMode && isChanged(safeProps, defaults);
const snippet = buildUsageSnippet(variation.componentName, safeProps, defaults);
```

### What to check after Option A
- [ ] Switching to Time/Physics mode shows the amber warning, preview stays on last easing values
- [ ] Switching back to Easing mode clears the warning, preview resumes responding
- [ ] Copy buttons are hidden in spring mode (no invalid code is generated)
- [ ] Reset still works correctly
- [ ] Loaders with no `ease` prop are completely unaffected

---
---

## Option B — Full Spring Support (Long-Term)

### Architecture decision

Loader components currently take `ease: any` and `duration: number` as two separate props. Spring configs cannot be expressed as two props — they are a single `TransitionConfig` object. The fix requires:

1. Adding a new `'transition'` prop type to the `PropDefinition` schema
2. Loader components accept a `transition?: TransitionConfig` prop and spread it directly
3. The pipeline (`buildDialKitConfig` → `unpackDialKitValues` → `buildUsageSnippet` → `substituteSource`) passes the full object through
4. Existing `ease` + `duration` props can be removed from loaders that migrate to `transition`

### Files changed: 5 categories

---

### 1. `types/loader.ts` — Add `'transition'` to PropDefinition

**Current:**
```ts
export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'ease' | 'strokeLinecap';
  default: any;
  ...
}
```

**Change:**
```ts
export interface PropDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'ease' | 'strokeLinecap' | 'transition';
  default: any;
  ...
}
```

The `default` value for a `'transition'` prop will be an `EasingConfig` object in `config.json`:
```json
{
  "name": "transition",
  "type": "transition",
  "default": { "type": "easing", "duration": 1.0, "ease": [0.42, 0, 0.58, 1] },
  "description": "Animation transition — easing curve, duration, or spring physics"
}
```

---

### 2. `components/craftui/loaders/*/config.json` — Migrate prop definitions

For each loader that currently has separate `ease` and `duration` props, replace both with a single `transition` prop.

**Current (`bars-wave/config.json`):**
```json
{
  "name": "duration",
  "type": "number",
  "default": 1.0,
  "min": 0.1,
  "max": 8,
  "step": 0.1,
  "description": "Animation cycle duration in seconds"
},
{
  "name": "ease",
  "type": "ease",
  "default": "easeInOut",
  "description": "Easing function"
}
```

**New:**
```json
{
  "name": "transition",
  "type": "transition",
  "default": { "type": "easing", "duration": 1.0, "ease": [0.42, 0, 0.58, 1] },
  "description": "Animation transition — easing curve, duration, or spring physics"
}
```

**⚠ Backward compat check:** Any user who already installed a loader and is passing `ease` and `duration` as props to it will have their props silently ignored after the component update. This is a breaking change. If backward compat matters, keep `ease` and `duration` as deprecated optional props and merge them into the `transition` object inside the component.

---

### 3. `components/craftui/loaders/*/default.tsx` — Accept `transition` prop

**Current (`bars-wave/default.tsx`):**
```ts
interface BarsWaveProps {
  ...
  duration?: number;
  ease?: any;
}

export function BarsWave({
  ...
  duration = 1.0,
  ease = 'easeInOut',
}: BarsWaveProps) {
  ...
  transition={{
    duration: duration,
    repeat: isAnimating ? Infinity : 0,
    ease: ease,
    delay: bar.delay
  }}
```

**New:**
```ts
import type { TransitionConfig } from 'dialkit';  // or define the type inline

interface BarsWaveProps {
  ...
  transition?: TransitionConfig;
}

export function BarsWave({
  ...
  transition = { type: 'easing', duration: 1.0, ease: [0.42, 0, 0.58, 1] },
}: BarsWaveProps) {
  ...
  transition={{
    ...transition,              // spreads duration+ease OR stiffness+damping+mass
    repeat: isAnimating ? Infinity : 0,
    delay: bar.delay
  }}
```

Note: `delay` and `repeat` are still applied on top of the spread — they are not part of the `TransitionConfig` and must stay explicit.

**⚠ Check:** Every loader that uses `transition={{ duration, ease, repeat, times, delay }}` needs to be updated. `times` is also not part of `TransitionConfig` and must stay explicit alongside the spread.

---

### 4. `lib/dialkit-config.ts` — Three function updates

#### `buildDialKitConfig` — handle `'transition'` type

**Add case:**
```ts
case 'transition': {
  // p.default is already an EasingConfig or SpringConfig object
  const defaultTransition = p.default ?? { type: 'easing', duration: 1, ease: [0.42, 0, 0.58, 1] };
  config[p.name] = defaultTransition;
  break;
}
```

**Remove** the `case 'ease'` block and the `durationProp` lookup entirely — they are no longer needed once loaders migrate to the `'transition'` prop type.

**Remove** the `if (p.name === 'duration' && easeProp) continue;` guard.

#### `buildNormalizedDefaults` — normalize `'transition'` defaults

**Add case:**
```ts
if (p.type === 'transition') {
  // Normalize ease arrays within the default TransitionConfig
  const t = p.default;
  if (t?.type === 'easing') {
    defaults[p.name] = { ...t, ease: normalizeEase(t.ease) };
  } else {
    defaults[p.name] = t;
  }
}
```

#### `unpackDialKitValues` — pass TransitionConfig straight through

```ts
export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): Record<string, any> {
  const result: Record<string, any> = {};
  const transitionPropNames = new Set(
    props.filter(p => p.type === 'transition').map(p => p.name)
  );

  for (const [key, value] of Object.entries(params)) {
    if (transitionPropNames.has(key)) {
      // Pass the full TransitionConfig (EasingConfig or SpringConfig) as-is
      result[key] = value;
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

This becomes much simpler — no unpacking needed. The loader spreads the whole object.

---

### 5. `components/loader-gallery/LoaderConfigurator.tsx` — Update snippet, substitute, animationKey

#### `buildUsageSnippet` — serialize TransitionConfig

**Current (only handles primitives and arrays):**
```ts
const attrs = changed.map(([k, v]) => {
  if (typeof v === 'string') return `  ${k}="${v}"`;
  if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
  return `  ${k}={${v}}`;
});
```

**Add object handling:**
```ts
const attrs = changed.map(([k, v]) => {
  if (typeof v === 'string') return `  ${k}="${v}"`;
  if (Array.isArray(v)) return `  ${k}={${JSON.stringify(v)}}`;
  if (typeof v === 'object' && v !== null) return `  ${k}={${JSON.stringify(v)}}`;
  return `  ${k}={${v}}`;
});
```

This produces:
```tsx
<BarsWave
  transition={{"type":"spring","stiffness":200,"damping":25,"mass":1}}
/>
```

For cleaner output you may want a pretty-print helper instead of `JSON.stringify`.

#### `substituteSource` — handle object prop values

**Add object case:**
```ts
} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
  result = result.replace(
    new RegExp(`(${name}\\s*=\\s*)\\{[^}]*\\}(?=,)`, 'g'),
    `$1${JSON.stringify(value)}`
  );
}
```

**⚠ Check:** The existing source files for loaders will have `transition = { type: 'easing', duration: 1.0, ease: [...] }` as the default parameter. The regex `\{[^}]*\}` matches a single-level object — it will fail on nested objects (the `ease` array inside the object). A more robust approach is to use a line-based replacement rather than regex for object defaults.

#### `animationKey` — key on the full transition object

**Current:**
```ts
const animationKey = useMemo(
  () => `${JSON.stringify(propValues.ease)}-${propValues.duration}`,
  [propValues.ease, propValues.duration]
);
```

**New:**
```ts
const transitionProps = variation.props
  .filter(p => p.type === 'transition')
  .map(p => propValues[p.name]);

const animationKey = useMemo(
  () => JSON.stringify(transitionProps),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(transitionProps)]
);
```

---

## Implementation Order for Option B

1. `types/loader.ts` — add `'transition'` type (no runtime effect yet)
2. `lib/dialkit-config.ts` — add `'transition'` case to all three functions (backward-safe, existing `ease` case still works)
3. Pick **one** loader as a pilot — update its `config.json` and `default.tsx`
4. Verify the pilot loader works: spring mode updates preview, copy output is correct
5. Roll out to all remaining loaders
6. Remove the `case 'ease'` and `durationProp` logic from `lib/dialkit-config.ts` once all loaders have migrated
7. Remove `'ease'` from `PropDefinition.type` union in `types/loader.ts`

---

## What to Check Before Starting

- [ ] Confirm no external code (docs, examples, or other pages) reads `ease` or `duration` props on loader components directly — if they do, the prop rename is a public breaking change
- [ ] Check `scripts/build-registry.ts` — it reads `config.json` verbatim; the new `'transition'` type and object default must survive the build without being stripped or transformed
- [ ] Check the props table on the detail page (`app/loaders/[slug]/page.tsx`) — it renders `prop.type` as a string. `'transition'` will display as `"transition"`. Consider showing `"EasingConfig | SpringConfig"` instead for user clarity

## What to Check After Completing

- [ ] Easing mode: changing curve and duration updates preview instantly, copy output shows `transition={...}` with correct values
- [ ] Spring mode (Time): changing `visualDuration` and `bounce` updates preview, copy output shows spring config
- [ ] Spring mode (Physics): changing `stiffness`, `damping`, `mass` updates preview
- [ ] Switching between modes mid-session works without stale state
- [ ] Reset returns to the `EasingConfig` default from `config.json`
- [ ] All loaders NOT yet migrated to `'transition'` prop still work via the old `ease` + `duration` path
- [ ] `isChanged` correctly detects no change when values match the normalized default `TransitionConfig`
