# Issue: Loaders with Multiple Ease Props Are Silently Mishandled

## Status
Open

## Area
`lib/dialkit-config.ts` · `components/loader-gallery/LoaderConfigurator.tsx`

---

## Description

The config builder and value unpacker both assume each loader variation has **at most one prop of type `'ease'`**. If a loader exposes two or more ease props (e.g. `ease` for the main loop and `entranceEase` for an entrance animation), only the first is wired to a DialKit easing editor. All subsequent ease props are silently dropped from the panel and the preview.

---

## Where It Breaks

### `buildDialKitConfig` — only picks up the first ease prop

```ts
const easeProp = props.find(p => p.type === 'ease'); // stops at first match
const durationProp = props.find(p => p.name === 'duration'); // assumes one duration

for (const p of props) {
  ...
  case 'ease':
    config[p.name] = { type: 'easing', duration: durationProp?.default, ease: ... };
    break;
}
```

`find` stops at the first `ease` prop. Because the `switch` still hits `case 'ease'` for subsequent ease props, a second DialKit easing control IS added to the config — but `durationProp` is still the single duration, meaning both easing controls bundle the same `duration`. This produces two editors fighting over one duration value, or the second editor initialising with the wrong duration.

### `buildNormalizedDefaults` — normalises all ease props correctly by coincidence

The loop processes all props regardless, so defaults are correctly normalised. This part is fine.

### `unpackDialKitValues` — only unpacks the first ease prop

```ts
const easeProp = props.find(p => p.type === 'ease'); // first only

for (const [key, value] of Object.entries(params)) {
  if (easeProp && key === easeProp.name) {
    // only this one gets unpacked
  }
}
```

Any second ease prop (e.g. `entranceEase`) arrives from DialKit as a `TransitionConfig` object. Because it doesn't match `easeProp.name`, it goes to the `else` branch and is passed to the loader as the raw `{ type: 'easing', duration, ease }` object — not the `[number, number, number, number]` array the loader expects. The animation prop receives an invalid value.

### Duration bundling is undefined for multiple ease + duration pairs

If a loader has both `ease` + `duration` and `entranceEase` + `entranceDuration`, the current logic only bundles the first pair. `entranceDuration` is excluded from the DialKit panel entirely (the `if (p.name === 'duration' && easeProp) continue` guard only skips a prop literally named `duration`).

---

## Example Loader That Would Expose This

```ts
// hypothetical loader with two distinct easing controls
interface TwoPhaseLoaderProps {
  ease?: any;           // controls main loop curve
  duration?: number;    // controls main loop speed
  entranceEase?: any;   // controls entrance animation curve
  entranceDuration?: number;
}
```

---

## What Needs to Change

### `buildDialKitConfig`
Instead of `find` (first match), iterate all ease props and pair each with its corresponding duration prop by naming convention (e.g. `ease` pairs with `duration`, `entranceEase` pairs with `entranceDuration`, or by prop adjacency in the config array).

### `buildNormalizedDefaults`
Already processes all props — no change needed.

### `unpackDialKitValues`
Instead of finding a single `easeProp`, collect **all** ease props into a set and unpack each one individually when iterating `params` keys. Each ease prop's bundled `duration` must also be correctly restored to its corresponding duration prop.

### `lib/dialkit-config.ts` — proposed pairing strategy
The cleanest approach is a naming convention: an ease prop named `xEase` pairs with a duration prop named `xDuration`. A prop literally named `ease` pairs with one literally named `duration`. This makes the pairing deterministic without requiring changes to `config.json`.

---

## Acceptance Criteria

- [ ] A loader with two `ease`-type props shows two separate easing editors in the DialKit panel
- [ ] Each editor controls only its own animation in the preview independently
- [ ] Both configured easing values appear correctly in the JSX usage snippet and baked source
- [ ] A loader with one `ease` prop is completely unaffected by this change
