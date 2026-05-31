export type EasingValue = string | readonly [number, number, number, number]

export interface EasingEntry {
  name: string
  label: string
  group: 'standard' | 'ease-in' | 'ease-out' | 'ease-in-out'
  value: EasingValue
  points: readonly [number, number, number, number]
}

// Approximate cubic-bezier points for named Framer Motion easings
const NAMED_POINTS: Record<string, readonly [number, number, number, number]> = {
  linear:    [0,    0,    1,    1],
  easeIn:    [0.42, 0,    1,    1],
  easeOut:   [0,    0,    0.58, 1],
  easeInOut: [0.42, 0,    0.58, 1],
}

export const EASINGS: EasingEntry[] = [
  // Standard
  { name: 'linear',    label: 'Linear',     group: 'standard',    value: 'linear',    points: [0, 0, 1, 1] },
  { name: 'easeIn',    label: 'Ease In',    group: 'standard',    value: 'easeIn',    points: [0.42, 0, 1, 1] },
  { name: 'easeOut',   label: 'Ease Out',   group: 'standard',    value: 'easeOut',   points: [0, 0, 0.58, 1] },
  { name: 'easeInOut', label: 'Ease In Out',group: 'standard',    value: 'easeInOut', points: [0.42, 0, 0.58, 1] },
  // Ease In
  { name: 'easeInQuad',  label: 'Quad',   group: 'ease-in', value: [0.55, 0.085, 0.68, 0.53]   as const, points: [0.55, 0.085, 0.68, 0.53] },
  { name: 'easeInCubic', label: 'Cubic',  group: 'ease-in', value: [0.55, 0.055, 0.675, 0.19]  as const, points: [0.55, 0.055, 0.675, 0.19] },
  { name: 'easeInQuart', label: 'Quart',  group: 'ease-in', value: [0.895, 0.03, 0.685, 0.22]  as const, points: [0.895, 0.03, 0.685, 0.22] },
  { name: 'easeInQuint', label: 'Quint',  group: 'ease-in', value: [0.755, 0.05, 0.855, 0.06]  as const, points: [0.755, 0.05, 0.855, 0.06] },
  { name: 'easeInExpo',  label: 'Expo',   group: 'ease-in', value: [0.95, 0.05, 0.795, 0.035]  as const, points: [0.95, 0.05, 0.795, 0.035] },
  { name: 'easeInCirc',  label: 'Circ',   group: 'ease-in', value: [0.6, 0.04, 0.98, 0.335]    as const, points: [0.6, 0.04, 0.98, 0.335] },
  // Ease Out
  { name: 'easeOutQuad',  label: 'Quad',  group: 'ease-out', value: [0.25, 0.46, 0.45, 0.94]   as const, points: [0.25, 0.46, 0.45, 0.94] },
  { name: 'easeOutCubic', label: 'Cubic', group: 'ease-out', value: [0.215, 0.61, 0.355, 1]    as const, points: [0.215, 0.61, 0.355, 1] },
  { name: 'easeOutQuart', label: 'Quart', group: 'ease-out', value: [0.165, 0.84, 0.44, 1]     as const, points: [0.165, 0.84, 0.44, 1] },
  { name: 'easeOutQuint', label: 'Quint', group: 'ease-out', value: [0.23, 1, 0.32, 1]         as const, points: [0.23, 1, 0.32, 1] },
  { name: 'easeOutExpo',  label: 'Expo',  group: 'ease-out', value: [0.19, 1, 0.22, 1]         as const, points: [0.19, 1, 0.22, 1] },
  { name: 'easeOutCirc',  label: 'Circ',  group: 'ease-out', value: [0.075, 0.82, 0.165, 1]    as const, points: [0.075, 0.82, 0.165, 1] },
  // Ease In Out
  { name: 'easeInOutQuad',  label: 'Quad',  group: 'ease-in-out', value: [0.455, 0.03, 0.515, 0.955]  as const, points: [0.455, 0.03, 0.515, 0.955] },
  { name: 'easeInOutCubic', label: 'Cubic', group: 'ease-in-out', value: [0.645, 0.045, 0.355, 1]     as const, points: [0.645, 0.045, 0.355, 1] },
  { name: 'easeInOutQuart', label: 'Quart', group: 'ease-in-out', value: [0.77, 0, 0.175, 1]          as const, points: [0.77, 0, 0.175, 1] },
  { name: 'easeInOutQuint', label: 'Quint', group: 'ease-in-out', value: [0.86, 0, 0.07, 1]           as const, points: [0.86, 0, 0.07, 1] },
  { name: 'easeInOutExpo',  label: 'Expo',  group: 'ease-in-out', value: [1, 0, 0, 1]                 as const, points: [1, 0, 0, 1] },
  { name: 'easeInOutCirc',  label: 'Circ',  group: 'ease-in-out', value: [0.785, 0.135, 0.15, 0.86]  as const, points: [0.785, 0.135, 0.15, 0.86] },
]

export const EASING_GROUPS = [
  { key: 'standard',    label: 'Standard' },
  { key: 'ease-in',     label: 'Ease In' },
  { key: 'ease-out',    label: 'Ease Out' },
  { key: 'ease-in-out', label: 'Ease In Out' },
] as const

/** Find the easing entry whose value matches a stored prop value */
export function findEasingByValue(val: any): EasingEntry | undefined {
  if (val === null || val === undefined) return undefined
  return EASINGS.find(e => JSON.stringify(e.value) === JSON.stringify(val))
}

/** Generate SVG path data for a cubic bezier curve (40×32 viewBox) */
export function easingPath(points: readonly [number, number, number, number]): string {
  const [x1, y1, x2, y2] = points
  const W = 40, H = 32
  return `M 0,${H} C ${x1 * W},${(1 - y1) * H} ${x2 * W},${(1 - y2) * H} ${W},0`
}
