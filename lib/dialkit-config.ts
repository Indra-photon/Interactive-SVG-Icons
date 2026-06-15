import type { PropDefinition } from '@/types/loader';
import type { DialConfig, EasingConfig, TransitionConfig } from 'dialkit';

const NAMED_EASE_TO_BEZIER: Record<string, [number, number, number, number]> = {
  linear:    [0, 0, 1, 1],
  easeIn:    [0.42, 0, 1, 1],
  easeOut:   [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

function normalizeColor(value: any): string {
  if (typeof value === 'string' && value !== 'currentColor') return value;
  return '#000000';
}

function normalizeEase(value: any): [number, number, number, number] {
  if (Array.isArray(value) && value.length === 4) return value as [number, number, number, number];
  if (typeof value === 'string' && NAMED_EASE_TO_BEZIER[value]) {
    return NAMED_EASE_TO_BEZIER[value];
  }
  return [0.42, 0, 0.58, 1];
}

// For ease prop named 'ease' → looks for 'duration'.
// For 'entranceEase' → looks for 'entranceDuration'. Etc.
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

/**
 * Converts PropDefinition[] from config.json into a DialKit config object.
 * Each ease prop is paired with its corresponding duration prop by naming
 * convention (ease→duration, entranceEase→entranceDuration, etc.) and
 * bundled into a single DialKit easing editor. Paired duration props are
 * excluded from the standalone slider list.
 */
export function buildDialKitConfig(props: PropDefinition[]): DialConfig {
  const config: Record<string, any> = {};

  // Collect all duration prop names that are bundled into an ease control
  // so they can be skipped as standalone sliders.
  const bundledDurationNames = new Set<string>();
  for (const p of props) {
    if (p.type === 'ease') {
      const paired = findPairedDurationProp(p.name, props);
      if (paired) bundledDurationNames.add(paired.name);
    }
  }

  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    if (bundledDurationNames.has(p.name)) continue;

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

/**
 * Builds the defaults map used for isChanged comparison.
 * Ease values are normalized to cubic-bezier arrays so they match
 * what DialKit always returns (DialKit never returns named strings like 'easeOut').
 */
export function buildNormalizedDefaults(props: PropDefinition[]): Record<string, any> {
  const defaults: Record<string, any> = {};
  for (const p of props) {
    if (p.name === 'width' || p.name === 'height') continue;
    if (p.type === 'ease') defaults[p.name] = normalizeEase(p.default);
    else if (p.type === 'string') defaults[p.name] = normalizeColor(p.default);
    else defaults[p.name] = p.default;
  }
  return defaults;
}

/**
 * Returns true when the user has switched the DialKit transition control
 * to Time or Physics (spring) mode. Used by the configurator to show a
 * warning and suppress copy output, since loaders do not yet accept spring configs.
 */
export function detectSpringMode(
  params: Record<string, any>,
  props: PropDefinition[]
): boolean {
  return props
    .filter(p => p.type === 'ease')
    .some(p => {
      const val = params[p.name];
      return val !== null && typeof val === 'object' && val.type === 'spring';
    });
}

/**
 * Converts DialKit's returned params back to the flat prop map that
 * LoaderPreview, buildUsageSnippet, and substituteSource expect.
 *
 * When an easing control is present, DialKit returns:
 *   params.ease = { type: 'easing', duration: x, ease: [x1,y1,x2,y2] }
 * This unpacks it back into separate `ease` and `duration` keys.
 *
 * When the user switches to spring mode (Time / Physics), the spring config
 * cannot be expressed as `ease` + `duration` props. We fall back to the
 * prop's own defaults so the preview keeps showing a valid animation.
 * The configurator reads detectSpringMode() and shows a warning in that case.
 */
export function unpackDialKitValues(
  params: Record<string, any>,
  props: PropDefinition[]
): Record<string, any> {
  const result: Record<string, any> = {};

  // Build a lookup: ease prop name → its paired duration prop (if any).
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
        // Spring mode: fall back to this ease prop's defaults so the loader
        // receives valid values and the preview keeps animating correctly.
        const easePropDef = props.find(p => p.name === key);
        result[key] = normalizeEase(easePropDef?.default);
        if (pairedDuration) result[pairedDuration.name] = pairedDuration.default;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
