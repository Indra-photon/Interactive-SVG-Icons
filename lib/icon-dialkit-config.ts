import type { PropDefinition } from '@/types/icon';
import type { DialConfig } from 'dialkit';

// Strip surrounding single quotes from stringified defaults (legacy config.json format).
// e.g. "'currentColor'" → "currentColor", "''" → ""
function stripQuotes(value: string): string {
  return value.replace(/^'|'$/g, '');
}

function normalizeColor(value: any): string {
  const raw = typeof value === 'string' ? stripQuotes(value) : String(value ?? '');
  if (raw === '' || raw === 'currentColor') return '#000000';
  return raw;
}

function normalizeNumber(value: any): number {
  return typeof value === 'number' ? value : Number(value);
}

// Exclude from DialKit:
//   - className     → developer utility, not user-configurable
//   - boolean props → all icon booleans are animation triggers (isAnimating,
//                     isHovered, hasNotification, etc.) managed by the preview
//   - any type that isn't number / string / enum → catches 'function', 'string | number'
function isExcluded(p: PropDefinition): boolean {
  if (p.name === 'className') return true;
  if (p.type === 'boolean') return true;
  if (!['number', 'string', 'enum'].includes(p.type)) return true;
  return false;
}

export function buildIconDialKitConfig(props: PropDefinition[]): DialConfig {
  const config: Record<string, any> = {};

  for (const p of props) {
    if (isExcluded(p)) continue;

    switch (p.type) {
      case 'number': {
        const def = normalizeNumber(p.default);
        config[p.name] = [
          def,
          p.min ?? 8,
          p.max ?? 256,
          p.step ?? 1,
        ] as [number, number, number, number];
        break;
      }

      case 'string':
        config[p.name] = { type: 'color', default: normalizeColor(p.default) };
        break;

      case 'enum':
        config[p.name] = {
          type: 'select',
          options: (p.options ?? []) as string[],
          default: String(p.default),
        };
        break;
    }
  }

  return config as DialConfig;
}

export function buildIconNormalizedDefaults(props: PropDefinition[]): Record<string, any> {
  const defaults: Record<string, any> = {};

  for (const p of props) {
    if (isExcluded(p)) continue;

    if (p.type === 'string') {
      defaults[p.name] = normalizeColor(p.default);
    } else if (p.type === 'number') {
      defaults[p.name] = normalizeNumber(p.default);
    } else {
      defaults[p.name] = p.default;
    }
  }

  return defaults;
}

// No ease/spring unpacking needed for icons — DialKit values pass through as-is.
export function unpackIconDialKitValues(params: Record<string, any>): Record<string, any> {
  return { ...params };
}

// Derives a component name from the icon slug for copy usage snippets.
// "alarm-clock" → "AlarmClockIcon", "trash" → "TrashIcon"
export function iconSlugToComponentName(slug: string): string {
  return (
    slug
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('') + 'Icon'
  );
}
