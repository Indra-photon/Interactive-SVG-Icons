# Issue: Spring Config (Time / Physics Mode) Not Supported in Preview or Copy Output

## Status
Open

## Area
`lib/dialkit-config.ts` · `components/loader-gallery/LoaderConfigurator.tsx` · all loader components under `components/craftui/loaders/`

---

## Description

DialKit's transition control exposes three modes — **Easing**, **Time** (simple spring), and **Physics** (advanced spring). Our config builder initialises the control in Easing mode by passing an `EasingConfig` object, but DialKit still lets the user switch to the other two modes freely.

When a user switches to Time or Physics mode, DialKit returns a `SpringConfig` object:

```ts
// Time mode
{ type: 'spring', visualDuration: 0.3, bounce: 0.2 }

// Physics mode
{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }
```

### What breaks

**1. Preview stops responding**

`unpackDialKitValues` checks `transition.type === 'easing'`. When the type is `'spring'` this check fails and falls into the `else` branch, which passes the full `SpringConfig` object as the `ease` prop to the loader:

```ts
// unpackDialKitValues — else branch
result[key] = value; // value = { type: 'spring', ... }
```

The loader then does:
```tsx
transition={{ ease: { type: 'spring', ... }, duration: 1.5 }}
```

Framer Motion does not accept a spring config in the `ease` field — it silently ignores it. The preview animation does not change.

**2. `duration` prop is not updated**

`result.duration` is only set inside the `type === 'easing'` branch. When in spring mode the duration passed to the loader falls back to whatever the last easing duration was, or the prop default.

**3. Copy output is wrong**

`buildUsageSnippet` and `substituteSource` would serialise the raw `SpringConfig` object into the JSX snippet or bake it into the source file, producing invalid prop values that won't compile.

---

## Root Cause

The current architecture maps the DialKit easing control's output to two separate loader props (`ease` and `duration`). Spring configs are a fundamentally different shape — they cannot be split into `ease` + `duration`. Loader components were designed for CSS-style easing only and have no way to accept spring physics parameters.

---

## What Needs to Change

### Option A — Reject spring modes (minimal scope)
Intercept mode changes via `DialStore.subscribeGlobal` and force the control back to `'easing'` mode whenever the user switches away. Prevents the broken state entirely but removes a DialKit feature.

### Option B — Support spring end-to-end (full scope)
1. **Loader components** — replace separate `ease?: any` and `duration?: number` props with a single `transition?: TransitionConfig` prop. The component spreads it directly: `transition={{ ...transitionProp, repeat: Infinity }}`.
2. **`config.json`** — add a new prop type (e.g. `'transition'`) that maps to a DialKit `TransitionConfig` (easing or spring).
3. **`buildDialKitConfig`** — emit `{ type: 'easing', ... }` or `{ type: 'spring', ... }` based on prop type.
4. **`unpackDialKitValues`** — pass the full `TransitionConfig` object through as a single `transition` value instead of splitting into `ease` + `duration`.
5. **`buildUsageSnippet` / `substituteSource`** — handle the `TransitionConfig` shape when serialising to JSX and source.
6. **Registry build** (`scripts/build-registry.ts`) — no change needed; the prop type change is handled at runtime.

Option B is the correct long-term fix. Option A is an acceptable short-term guard.

---

## Acceptance Criteria

- [ ] Switching to Time or Physics mode in DialKit updates the preview animation visibly
- [ ] The JSX usage snippet correctly serialises spring config (e.g. `transition={{ type: 'spring', bounce: 0.2 }}`)
- [ ] Copy source bakes the spring config into the loader file correctly
- [ ] Switching back to Easing mode also works correctly
