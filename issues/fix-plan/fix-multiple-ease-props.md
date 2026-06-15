# Fix Plan: Multiple Ease Props Per Loader

## Overview

The entire pipeline — `buildDialKitConfig`, `unpackDialKitValues`, `buildNormalizedDefaults`, and `animationKey` — all assume a loader has at most one prop of type `'ease'`. This plan replaces every `props.find(p => p.type === 'ease')` (first-match) with full iteration over all ease props, pairing each with its corresponding duration prop by naming convention.

No loader component files need to change. No `config.json` files need to change. All changes are confined to `lib/dialkit-config.ts` and `components/loader-gallery/LoaderConfigurator.tsx`.

---

## Pairing Convention

Each ease prop is paired with a duration prop by name:

| Ease prop name | Expected duration prop name |
|---|---|
| `ease` | `duration` |
| `entranceEase` | `entranceDuration` |
| `exitEase` | `exitDuration` |
| `hoverEase` | `hoverDuration` |
| `fooEase` | `fooDuration` |

**Rule:** Strip the `Ease` suffix (case-sensitive), append `Duration`. If no matching duration prop exists, the easing control in DialKit still shows but omits the duration slider (DialKit allows this).

This is deterministic and requires no `config.json` changes. Loaders that already follow this naming convention automatically get correct pairing.

---

## Step 1: Add a pairing helper to `lib/dialkit-config.ts`

Add this utility at the top of the file, below the existing `normalizeEase` function:

```ts
/**
 * For an ease prop named 'ease' → looks for 'duration'.
 * For 'entranceEase' → looks for 'entranceDuration'. Etc.
 * Returns undefined if no matching duration prop exists.
 */
function findPairedDurationProp(
  easePropName: string,
  props: PropDefinition[]
): PropDefinition | undefined {
  const durationName =
    easePropName === 'ease'
      ? 'duration'
      : easePropName.replace(/Ease$/, 'Duration');
  return props.find(p => p.name === durationName);
}
```

---

## Step 2: `buildDialKitConfig` — iterate all ease props

### Current code (lines 30–78):
```ts
export function buildDialKitConfig(props: PropDefinition[]): DialConfig {
  const config: Record<string, any> = {};
  const easeProp = props.find(p => p.type === 'ease');        // ← single find
  const durationProp = props.find(p => p.name === 'duration'); // ← single find

  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    if (p.name === 'duration' && easeProp) continue;           // ← only skips 'duration'

    switch (p.type) {
      ...
      case 'ease': {
        const easingConfig: EasingConfig = {
          type: 'easing',
          duration: typeof durationProp?.default === 'number' ? durationProp.default : 1,
          ease: normalizeEase(p.default),
        };
        config[p.name] = easingConfig;
        break;
      }
    }
  }
  return config as DialConfig;
}
```

### New code:
```ts
export function buildDialKitConfig(props: PropDefinition[]): DialConfig {
  const config: Record<string, any> = {};

  // Build set of duration prop names that are bundled into an ease control.
  // These must be excluded from the standalone slider loop.
  const bundledDurationNames = new Set<string>();
  for (const p of props) {
    if (p.type === 'ease') {
      const paired = findPairedDurationProp(p.name, props);
      if (paired) bundledDurationNames.add(paired.name);
    }
  }

  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    if (bundledDurationNames.has(p.name)) continue; // skip bundled durations

    switch (p.type) {
      case 'number':
        config[p.name] = [
          p.default,
          p.min ?? 0,
          p.max ?? 100,
          p.step ?? 0.1,
        ] as [number, number, number, number];
        break;

      case 'string':
        config[p.name] = { type: 'color', default: normalizeColor(p.default) };
        break;

      case 'boolean':
        config[p.name] = p.default as boolean;
        break;

      case 'enum':
      case 'strokeLinecap':
        config[p.name] = {
          type: 'select',
          options: (p.options ?? []) as string[],
          default: String(p.default),
        };
        break;

      case 'ease': {
        const pairedDuration = findPairedDurationProp(p.name, props);
        const easingConfig: EasingConfig = {
          type: 'easing',
          duration: typeof pairedDuration?.default === 'number' ? pairedDuration.default : 1,
          ease: normalizeEase(p.default),
        };
        config[p.name] = easingConfig;
        break;
      }
    }
  }

  return config as DialConfig;
}
```

### What changed and why
- `easeProp` (single `find`) → `bundledDurationNames` (set built by iterating all ease props)
- `durationProp` (single `find`) → `findPairedDurationProp(p.name, props)` called per ease prop
- The skip guard `if (p.name === 'duration' && easeProp) continue` → `if (bundledDurationNames.has(p.name)) continue` which correctly skips `duration`, `entranceDuration`, `exitDuration`, etc.

---

## Step 3: `buildNormalizedDefaults` — already correct, minor cleanup

The current loop already handles all ease props because it iterates over every prop:

```ts
if (p.type === 'ease') defaults[p.name] = normalizeEase(p.default);
```

This works for any number of ease props. **No functional change needed.**

However, duration props that are bundled into ease controls should NOT appear in `defaults` as standalone entries because they will never appear as standalone keys in `propValues` (they come back as part of the unpacked ease). Update to skip bundled duration names:

```ts
export function buildNormalizedDefaults(props: PropDefinition[]): Record<string, any> {
  const defaults: Record<string, any> = {};

  const bundledDurationNames = new Set<string>();
  for (const p of props) {
    if (p.type === 'ease') {
      const paired = findPairedDurationProp(p.name, props);
      if (paired) bundledDurationNames.add(paired.name);
    }
  }

  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    if (bundledDurationNames.has(p.name)) {
      // Duration bundled into easing control — normalize and keep under its own name
      // so isChanged can compare it correctly after unpack
      defaults[p.name] = p.default;
      continue;
    }
    if (p.type === 'ease') defaults[p.name] = normalizeEase(p.default);
    else if (p.type === 'string') defaults[p.name] = normalizeColor(p.default);
    else defaults[p.name] = p.default;
  }
  return defaults;
}
```

---

## Step 4: `unpackDialKitValues` — handle all ease props

### Current code (lines 105–128):
```ts
export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): Record<string, any> {
  const result: Record<string, any> = {};
  const easeProp = props.find(p => p.type === 'ease');        // ← single find
  const durationProp = props.find(p => p.name === 'duration'); // ← single find

  for (const [key, value] of Object.entries(params)) {
    if (easeProp && key === easeProp.name) {
      const transition = value as TransitionConfig;
      if (transition?.type === 'easing') {
        result[easeProp.name] = transition.ease;
        if (durationProp) result['duration'] = transition.duration;
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

### New code:
```ts
export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): Record<string, any> {
  const result: Record<string, any> = {};

  // Build a lookup: ease prop name → paired duration prop (if any)
  const easePropMap = new Map<string, PropDefinition | undefined>();
  for (const p of props) {
    if (p.type === 'ease') {
      easePropMap.set(p.name, findPairedDurationProp(p.name, props));
    }
  }

  for (const [key, value] of Object.entries(params)) {
    if (easePropMap.has(key)) {
      const pairedDuration = easePropMap.get(key);
      const transition = value as TransitionConfig;
      if (transition?.type === 'easing') {
        result[key] = transition.ease;
        if (pairedDuration) result[pairedDuration.name] = transition.duration;
      } else {
        // Spring or unknown — fall back to the prop defaults for this ease slot
        const easePropDef = props.find(p => p.name === key);
        result[key] = easePropDef?.default ?? [0.42, 0, 0.58, 1];
        if (pairedDuration) result[pairedDuration.name] = pairedDuration.default;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}
```

### What changed and why
- `easeProp` (single `find`) → `easePropMap` (a Map from ease prop name to its paired duration prop)
- The single `if (easeProp && key === easeProp.name)` check → `if (easePropMap.has(key))` which matches any ease prop regardless of name
- `result['duration'] = transition.duration` → `result[pairedDuration.name] = transition.duration` so the correct duration key is written (`duration`, `entranceDuration`, etc.)

---

## Step 5: `components/loader-gallery/LoaderConfigurator.tsx` — update `animationKey`

### Current code:
```ts
const animationKey = useMemo(
  () => `${JSON.stringify(propValues.ease)}-${propValues.duration}`,
  [propValues.ease, propValues.duration]
);
```

This only keys on `ease` and `duration`. If a loader has `entranceEase` and `entranceDuration`, those changes won't trigger an animation remount.

### New code:
```ts
// Collect all ease prop names and their paired duration names for this variation
const easeAndDurationKeys = useMemo(() => {
  const keys: string[] = [];
  for (const p of variation.props) {
    if (p.type === 'ease') {
      keys.push(p.name);
      const durationName = p.name === 'ease' ? 'duration' : p.name.replace(/Ease$/, 'Duration');
      if (variation.props.some(x => x.name === durationName)) keys.push(durationName);
    }
  }
  return keys;
}, [variation.props]);

const animationKey = useMemo(
  () => easeAndDurationKeys.map(k => JSON.stringify(propValues[k])).join('-'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [easeAndDurationKeys, ...easeAndDurationKeys.map(k => propValues[k])]
);
```

> **Note on the exhaustive-deps lint rule:** spreading a dynamic array into deps is not idiomatic. An alternative is to stringify the whole set: `JSON.stringify(easeAndDurationKeys.map(k => propValues[k]))` and use that string as the single dep via `useRef` comparison. Either approach is acceptable.

---

## What to Check Before Starting

- [ ] Search the entire codebase for any direct reference to `props.find(p => p.type === 'ease')` outside `lib/dialkit-config.ts` — there should be none after this migration
- [ ] Confirm that no existing `config.json` has two props of type `'ease'` yet (check with `grep -r '"type": "ease"' components/craftui/loaders` — if any loader already has two, it is currently silently broken and this fix is urgent for that loader)
- [ ] Confirm naming convention: all ease props in existing loaders are literally named `ease` and all duration props are literally named `duration` — the `Ease`/`Duration` suffix rule only kicks in for future loaders

## What to Check After Completing

- [ ] Existing single-ease loaders (the entire current library) work identically to before — no regression
- [ ] A test loader with two ease props (`ease` + `duration`, `entranceEase` + `entranceDuration`) shows two separate easing editors in the DialKit panel
- [ ] Changing `ease` in DialKit updates the main animation, changing `entranceEase` updates only the entrance animation independently
- [ ] Both easing values appear correctly in the JSX usage snippet
- [ ] Both easing values are baked correctly into the copy source output
- [ ] `isChanged` correctly detects no change when both ease slots are at defaults
- [ ] Reset remounts the component and both easing controls return to their defaults
- [ ] The `animationKey` changes when either ease slot changes, triggering an immediate animation restart

---

## Example: What a Two-Ease Loader Config Would Look Like

`config.json`:
```json
"props": [
  { "name": "ease", "type": "ease", "default": "easeInOut", "description": "Main loop easing" },
  { "name": "duration", "type": "number", "default": 1.5, "min": 0.1, "max": 8, "step": 0.1, "description": "Main loop duration" },
  { "name": "entranceEase", "type": "ease", "default": [0.22, 1, 0.36, 1], "description": "Entrance animation easing" },
  { "name": "entranceDuration", "type": "number", "default": 0.6, "min": 0.1, "max": 3, "step": 0.05, "description": "Entrance animation duration" }
]
```

DialKit panel result:
```
▼ MyLoader
  ease          [────●────]  ╭──╮ easeInOut   duration: 1.5s
  entranceEase  [────●────]  ╰──╯ custom      duration: 0.6s
  color         ████  #3b82f6
  isAnimating   ● on
```

Copy usage output:
```tsx
<MyLoader
  ease={[0.3, 1, 0, 1]}
  duration={2}
  entranceEase={[0.22, 1, 0.36, 1]}
/>
```
