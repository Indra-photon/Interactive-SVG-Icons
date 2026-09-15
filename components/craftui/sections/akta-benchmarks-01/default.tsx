"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartAverageIcon,
  CheckmarkCircle02Icon,
  Coins01Icon,
  Radar01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * akta-benchmarks-01 — four metrics, four graphic forms
 *
 * Same contract as akta-hero-01: every value lives in this file as a Tailwind
 * arbitrary value with its dark twin. Nothing is written into globals.css
 * except the notch device class and the scroll-reveal keyframe, which the hero
 * already ships. There is no `@theme` block and no `:root` palette.
 *
 * The SVG charts follow the same rule. Fills and strokes are `fill-[…]` /
 * `stroke-[…]` utilities on the SVG elements rather than inline `var()`s, so
 * the charts flip with `.dark` like everything else and never depend on a
 * token that was not installed.
 *
 * Every className is assembled with `cn()` in a fixed order:
 *
 *     cn( layout , type , colour , state , device )
 * ------------------------------------------------------------------------ */

/* ── Type ───────────────────────────────────────────────────────────────── */
const FONT_SANS =
  "font-[family-name:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]";
const FONT_MONO =
  "font-[family-name:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace]";

/* section headline — h2 */
const TYPE_HEADING_48 =
  "text-[32px] leading-[1.12] tracking-[-0.01em] font-normal sm:text-[40px] sm:leading-[1.1] sm:tracking-[-0.03em] lg:text-[48px] lg:leading-[1.08]";
/* cell title — h3 */
const TYPE_HEADING_20 =
  "text-[18px] leading-[1.33] tracking-[-0.02em] font-semibold sm:text-[20px] sm:leading-[1.3]";
/* the headline figure in every cell */
const TYPE_DISPLAY = `${FONT_MONO} text-[40px] leading-[1.1] tracking-[-0.06em] font-normal tabular-nums`;
/* body copy */
const TYPE_COPY_16 =
  "text-[15px] leading-[1.6] tracking-[-0.01em] font-normal sm:text-[16px] sm:leading-[1.625]";
/* dense body, captions */
const TYPE_COPY_14 =
  "text-[13px] leading-[1.54] tracking-[-0.01em] font-normal sm:text-[14px] sm:leading-[1.57]";
/* the one mono label size — used in HTML cells and matched by the SVG charts */
const TYPE_LABEL = `${FONT_MONO} text-[12px] leading-[16px] font-normal`;

/* ── Colour ─────────────────────────────────────────────────────────────── */

/* surfaces */
const BG_CANVAS = "bg-white dark:bg-black";
const BG_PANEL =
  "bg-[oklch(0.985_0.002_247.839)] dark:bg-[oklch(0.13_0.028_261.692)]";
const BG_BRAND =
  "bg-[oklch(0.488_0.243_264.376)] dark:bg-[oklch(0.546_0.245_262.881)]";
const BG_BRAND_TILE =
  "bg-[oklch(0.932_0.032_255.585)] dark:bg-[oklch(0.379_0.146_265.522)]";
const BG_TRACK =
  "bg-[oklch(0.967_0.003_264.542)] dark:bg-[oklch(0.21_0.034_264.665)]";
const BG_TRACK_HOVER =
  "bg-[oklch(0.928_0.006_264.531)] dark:bg-[oklch(0.278_0.033_256.848)]";
const BG_INERT =
  "bg-[oklch(0.872_0.01_258.338)] dark:bg-[oklch(0.373_0.034_259.733)]";

/* text */
const INK =
  "text-[oklch(0.13_0.028_261.692)] dark:text-[oklch(0.967_0.003_264.542)]";
const INK_MUTED =
  "text-[oklch(0.21_0.034_264.665)] dark:text-[oklch(0.707_0.022_261.325)]";
const INK_BRAND =
  "text-[oklch(0.379_0.146_265.522)] dark:text-[oklch(0.707_0.165_254.624)]";
const BRAND =
  "text-[oklch(0.488_0.243_264.376)] dark:text-[oklch(0.546_0.245_262.881)]";

/* SVG ink — the same roles as the text constants, as fill utilities */
const FILL_INK =
  "fill-[oklch(0.13_0.028_261.692)] dark:fill-[oklch(0.967_0.003_264.542)]";
const FILL_INK_MUTED =
  "fill-[oklch(0.21_0.034_264.665)] dark:fill-[oklch(0.707_0.022_261.325)]";
const FILL_BRAND =
  "fill-[oklch(0.488_0.243_264.376)] dark:fill-[oklch(0.546_0.245_262.881)]";
const FILL_ON_BRAND = "fill-white";
const FILL_INERT =
  "fill-[oklch(0.872_0.01_258.338)] dark:fill-[oklch(0.373_0.034_259.733)]";
const FILL_BRAND_TILE =
  "fill-[oklch(0.932_0.032_255.585)] dark:fill-[oklch(0.379_0.146_265.522)]";
const FILL_RULE =
  "fill-[oklch(0.707_0.022_261.325)] dark:fill-[oklch(0.373_0.034_259.733)]";

const STROKE_RULE =
  "stroke-[oklch(0.707_0.022_261.325)] dark:stroke-[oklch(0.373_0.034_259.733)]";
const STROKE_BRAND =
  "stroke-[oklch(0.488_0.243_264.376)] dark:stroke-[oklch(0.546_0.245_262.881)]";
const STROKE_BRAND_BORDER =
  "stroke-[oklch(0.623_0.214_259.815)] dark:stroke-[oklch(0.546_0.245_262.881)]";
const STROKE_CANVAS = "stroke-white dark:stroke-black";

/* Isometric faces recede toward the canvas rather than toward a darker step,
 * because the brand ramp inverts between themes — the dark-mode hover step is
 * *lighter* than solid, which would flip the shading. Mixing with the canvas
 * keeps the top face the most saturated in both. */
const FACE_BRAND = {
  top: FILL_BRAND,
  left: "fill-[color-mix(in_oklab,oklch(0.488_0.243_264.376)_74%,white)] dark:fill-[color-mix(in_oklab,oklch(0.546_0.245_262.881)_74%,black)]",
  right:
    "fill-[color-mix(in_oklab,oklch(0.488_0.243_264.376)_50%,white)] dark:fill-[color-mix(in_oklab,oklch(0.546_0.245_262.881)_50%,black)]",
};
const FACE_GRAY = {
  top: FILL_INERT,
  left: "fill-[color-mix(in_oklab,oklch(0.872_0.01_258.338)_74%,white)] dark:fill-[color-mix(in_oklab,oklch(0.373_0.034_259.733)_74%,black)]",
  right:
    "fill-[color-mix(in_oklab,oklch(0.872_0.01_258.338)_50%,white)] dark:fill-[color-mix(in_oklab,oklch(0.373_0.034_259.733)_50%,black)]",
};
const faces = (brand?: boolean) => (brand ? FACE_BRAND : FACE_GRAY);

/* notch colour, set per call site as an arbitrary property */
const NOTCH_GRAY =
  "[--akta-notch-color:oklch(0.707_0.022_261.325)] dark:[--akta-notch-color:oklch(0.373_0.034_259.733)]";

/* ── Depth and separators ─────────────────────────────────────────────────
 * Dark rules sit at 16% white rather than the hero's 10%: this section is a
 * grid of hairlines on pure black with no panel behind them, and at 10% the
 * cell dividers dropped below what a normal display resolves. */
const SHADOW_BORDER =
  "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
/* color-mix(in oklab, C 45%, transparent) is just C at 45% alpha */
const RING_TILE =
  "shadow-[0_0_0_1px_oklch(0.623_0.214_259.815/0.45)] dark:shadow-[0_0_0_1px_oklch(0.546_0.245_262.881/0.6)]";

const RULE_T =
  "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]";
const RULE_Y =
  "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),inset_0_-1px_0_0_rgba(255,255,255,0.16)]";
/* right + bottom in one value, so a wrapping grid separates at any column count */
const RULE_CELL =
  "shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.08)] dark:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.16),inset_0_-1px_0_0_rgba(255,255,255,0.16)]";
const RULE_X_LG =
  "lg:shadow-[inset_1px_0_0_0_rgba(0,0,0,0.08),inset_-1px_0_0_0_rgba(0,0,0,0.08)] dark:lg:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.16),inset_-1px_0_0_0_rgba(255,255,255,0.16)]";
const RULE_L_LG =
  "lg:shadow-[inset_1px_0_0_0_rgba(0,0,0,0.08)] dark:lg:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.16)]";

/* ── Layout ─────────────────────────────────────────────────────────────── */
const GRID = "mx-auto w-full max-w-[90rem]";

/* ── Content ────────────────────────────────────────────────────────────────
 *
 * Benchmark readouts. Every figure is drawn from its own value — `ratio` is the
 * value normalised against the largest in its column, so each field reads as
 * data rather than as decoration. `brand` marks the one row the section is
 * actually about; it is the only place blue is spent inside a cell.
 *
 * `chart` picks the form. The four metrics tell four different stories — a
 * blowout, a tight cluster, a near-miss, a ratio — and one shared bar list
 * flattened all of them into the same shape. `short` is the iso cell's rotated
 * axis label, which has a 66px lane to live in; `n` is the raw number for forms
 * that need to place a value on an absolute scale rather than a 0–1 ratio. */
export type BenchmarkRow = {
  name: string;
  short?: string;
  value: string;
  ratio: number;
  n?: number;
  brand?: boolean;
};

export type BenchmarkMetric = {
  title: string;
  qualifier: string;
  direction: string;
  icon: typeof ChartAverageIcon;
  /* Unit line beside the headline figure. The figure itself is always the
   * brand row's own value, so there is one source for the number. */
  headline: string;
  blurb: string;
  chart: "iso" | "units" | "radar" | "slab" | "bars";
  rows: BenchmarkRow[];
};

const METRICS: BenchmarkMetric[] = [
  {
    title: "F1 Score",
    headline: "top F1 score",
    qualifier: "accuracy × recall",
    direction: "Higher is better",
    icon: ChartAverageIcon,
    chart: "iso",
    blurb:
      "The F1 score is a measure of a model's accuracy that considers both precision.",
    rows: [
      {
        name: "akta.pro",
        short: "akta.pro",
        value: "81.3",
        ratio: 1,
        brand: true,
      },
      { name: "GPT-5.5", short: "GPT-5.5", value: "62.5", ratio: 0.769 },
      { name: "SerpAPI", short: "SerpAPI", value: "52.6", ratio: 0.647 },
      { name: "Perigon", short: "Perigon", value: "48.6", ratio: 0.598 },
      {
        name: "Claude Sonnet 4.5",
        short: "Sonnet 4.5",
        value: "47.8",
        ratio: 0.588,
      },
      { name: "Parallel", short: "Parallel", value: "46.4", ratio: 0.571 },
    ],
  },
  {
    title: "Accuracy",
    headline: "of 100 verified",
    qualifier: "precision",
    direction: "Higher is better",
    icon: CheckmarkCircle02Icon,
    chart: "units",
    blurb:
      "How much of what we return is correct — the share of articles that survive verification.",
    rows: [
      {
        name: "akta.pro",
        short: "akta.pro",
        value: "93%",
        ratio: 1,
        n: 93,
        brand: true,
      },
      {
        name: "Claude Opus 4.8",
        short: "Opus 4.8",
        value: "88%",
        ratio: 0.946,
        n: 88,
      },
      {
        name: "GPT-5.4 mini",
        short: "GPT-5.4",
        value: "86%",
        ratio: 0.925,
        n: 86,
      },
      {
        name: "Claude Sonnet 4.5",
        short: "Sonnet 4.5",
        value: "82%",
        ratio: 0.882,
        n: 82,
      },
      { name: "GPT-5.5", short: "GPT-5.5", value: "81%", ratio: 0.871, n: 81 },
      {
        name: "Parallel",
        short: "Parallel",
        value: "72%",
        ratio: 0.774,
        n: 72,
      },
    ],
  },
  {
    title: "Coverage",
    headline: "of all news reached",
    qualifier: "recall",
    direction: "Higher is better",
    icon: Radar01Icon,
    chart: "radar",
    blurb:
      "How much of the news that exists we actually reach, across every source in the index.",
    rows: [
      { name: "Perigon", value: "73.7%", ratio: 1, n: 73.7 },
      { name: "akta.pro", value: "72.7%", ratio: 0.986, n: 72.7, brand: true },
      { name: "Exa", value: "68.7%", ratio: 0.932, n: 68.7 },
      { name: "NewsAPI", value: "59.4%", ratio: 0.806, n: 59.4 },
      { name: "GPT-5.5", value: "55.9%", ratio: 0.758, n: 55.9 },
      { name: "SerpAPI", value: "50.6%", ratio: 0.686, n: 50.6 },
    ],
  },
  {
    title: "Cost",
    headline: "per 1,000 verified",
    qualifier: "per 1K accurate articles",
    direction: "Lower is better",
    icon: Coins01Icon,
    chart: "slab",
    blurb:
      "What a thousand verified articles costs you — priced on results, not on requests made.",
    rows: [
      { name: "akta.pro", value: "$0.50", ratio: 0.175, brand: true },
      { name: "SerpAPI", value: "$0.67", ratio: 0.235 },
      { name: "NewsAPI", value: "$0.72", ratio: 0.253 },
      { name: "Perigon", value: "$0.73", ratio: 0.256 },
      { name: "Parallel", value: "$1.52", ratio: 0.533 },
      { name: "GPT-5.4 mini", value: "$2.85", ratio: 1 },
    ],
  },
];

/* ── Header ─────────────────────────────────────────────────────────────── */

/* Eyebrow — a notched chip carrying a solid brand square and one mono label.
 * The square is the section's single decorative use of blue; everything else
 * structural in this section is gray. */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5",
        INK,
        BG_PANEL,
        SHADOW_BORDER,
        "akta-notch [--akta-notch-arm:8px] [--akta-notch-inset:4px] [--akta-notch-weight:1px]",
        NOTCH_GRAY,
      )}
    >
      <span className={cn("size-2 shrink-0", BG_BRAND)} aria-hidden="true" />
      <span className={cn(TYPE_LABEL, "uppercase")}>{children}</span>
    </span>
  );
}

/* Section header — eyebrow, h2, one paragraph of body copy, centred on the
 * grid and capped at a readable measure. */
function SectionHeader({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description: string;
}) {
  return (
    <div
      data-akta-reveal
      className="flex flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20 lg:px-10 lg:py-24"
    >
      <SectionEyebrow>{eyebrow}</SectionEyebrow>

      <h2
        className={cn(
          "mt-6 max-w-3xl text-balance sm:mt-8",
          TYPE_HEADING_48,
          INK,
        )}
      >
        {heading}
      </h2>

      <p
        className={cn(
          "mt-4 max-w-[70ch] text-balance sm:mt-5",
          TYPE_COPY_16,
          INK_MUTED,
        )}
      >
        {description}
      </p>
    </div>
  );
}

/* ── Chart chrome ───────────────────────────────────────────────────────────
 *
 * Type inside the charts. An SVG's text scales with its viewBox, so the same
 * `fontSize` renders at a different pixel size in every chart unless the
 * charts share a scale. Two rules keep all four cells on one size:
 *
 *   1. every chart SVG uses the same viewBox WIDTH of 330, so one user unit is
 *      one user unit everywhere — geometry is scaled to fit that box rather
 *      than the box being fitted to the geometry;
 *   2. every chart SVG is capped at that same 330px, so the scale factor stays
 *      between 0.97 (a 320px column at lg) and 1.00, never above.
 *
 * Together those hold every label at 11.6–12px — the same as the HTML cells'
 * TYPE_LABEL, which is the section's one mono label size. */
const LABEL = 12;
const CHART_SVG = "w-full max-w-[330px]";

/* Every graphic form is drawn, so every graphic form needs a text equivalent.
 * This is the one the screen reader gets; the visual is hidden from it. */
function MetricTable({ metric }: { metric: BenchmarkMetric }) {
  return (
    <ul className="sr-only">
      {metric.rows.map((row) => (
        <li key={row.name}>
          {row.name}: {row.value}
        </li>
      ))}
    </ul>
  );
}

/* Splits a headline value into its digits and whatever symbol sits against
 * them — "$0.50" -> "$" + "0.50", "93%" -> "93" + "%" — so the symbol can be
 * held off the number. The display step carries -0.06em tracking, which eats
 * into any gap set here, so 0.16em lands at roughly 4px of actual air at 40px.
 * Headline only: the chart labels are left alone. */
const FIGURE_PARTS = /^(\D*)([\d.,]+)(\D*)$/;

function Figure({ value }: { value: string }) {
  const parts = FIGURE_PARTS.exec(value);
  if (!parts) return <>{value}</>;

  const [, prefix, digits, suffix] = parts;
  return (
    <>
      {prefix && <span className="mr-[0.16em]">{prefix}</span>}
      {digits}
      {suffix && <span className="ml-[0.16em]">{suffix}</span>}
    </>
  );
}

/* The cell's claim, stated in words and figures before the graphic argues it.
 * Every cell carries one, so the four read as a set however different their
 * bodies are. */
function MetricHeadline({ metric }: { metric: BenchmarkMetric }) {
  const brand = metric.rows.find((row) => row.brand) ?? metric.rows[0];
  return (
    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn(TYPE_DISPLAY, BRAND)}>
        <Figure value={brand.value} />
      </span>
      <span className={cn(TYPE_LABEL, "uppercase", INK_MUTED)}>
        {metric.headline}
      </span>
    </p>
  );
}

/* Shared chrome for the graphic half of a cell: the direction line — the rule
 * for reading the header above it — then the claim, then whichever form the
 * metric asked for. Keeping this out of the forms means the
 * four cells stay aligned to each other however different their bodies get. */
function ChartFrame({
  metric,
  children,
}: {
  metric: BenchmarkMetric;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6">
      <div>
        <p className={cn(TYPE_LABEL, "uppercase", INK_MUTED)}>
          {metric.direction}
        </p>
        <MetricHeadline metric={metric} />
      </div>

      {/* The figure floats in the middle of the space the claim leaves, so a
       * short chart falls between the claim and the graphic rather than
       * pooling under it. py-10 is the floor on that gap when a chart is tall. */}
      <div className="my-auto py-10">{children}</div>

      <MetricTable metric={metric} />
    </div>
  );
}

/* ── Form 1 · isometric bar city ────────────────────────────────────────────
 *
 * 2:1 dimetric rather than true 30° isometric: the shallower angle costs half
 * the vertical drop across six bars, which is the difference between fitting a
 * 1/4-width cell and not.
 *
 *   project(x, y, z) = [x - y, (x + y) / 2 - z]
 *
 * 3D is a poor instrument for comparing close values — foreshortening and the
 * top face both read as extra length — so it is spent on F1 and only F1, where
 * the winning margin is 30% and precision is not what the cell is for.
 *
 * Labels are the whole difficulty here: in isometric, the space below-right of
 * every bar is occupied by the next bar, so nothing can sit under a bar. They
 * drop instead on vertical leaders to a lane below the ground line, rotated
 * -90°. A leader at the front vertex of bar i has x = i * PITCH, and bar i+1
 * starts at i * PITCH + 12, so no leader ever crosses a solid.
 *
 * PITCH must clear BW + BD (48) or adjacent bars overlap in projection: a bar
 * spans ±BW from its own centre while centres sit PITCH apart. 50 leaves a
 * 2px gap. */
const ISO = { BW: 24, BD: 24, PITCH: 50, HMAX: 84, BASE: 162, LANE: 66 };

const project = (x: number, y: number, z: number) => [x - y, (x + y) / 2 - z];
const pt = (x: number, y: number, z: number) => project(x, y, z).join(",");

function IsoBar({ row, i }: { row: BenchmarkRow; i: number }) {
  const { BW, BD, PITCH, HMAX, BASE } = ISO;
  const x0 = i * PITCH;
  const x1 = x0 + BW;
  const h = row.ratio * HMAX;

  const face = faces(row.brand);

  /* The front-most ground vertex: where the leader starts. */
  const [lx, ly] = project(x1, BD, 0);
  /* Centre of the top face: mean of its four projected corners. */
  const [tx, ty] = project(x0 + BW / 2, BD / 2, h);

  return (
    <g>
      <title>{`${row.name}: ${row.value}`}</title>

      <polygon
        points={`${pt(x0, BD, h)} ${pt(x1, BD, h)} ${pt(x1, BD, 0)} ${pt(x0, BD, 0)}`}
        className={face.left}
      />
      <polygon
        points={`${pt(x1, 0, h)} ${pt(x1, BD, h)} ${pt(x1, BD, 0)} ${pt(x1, 0, 0)}`}
        className={face.right}
      />
      <polygon
        points={`${pt(x0, 0, h)} ${pt(x1, 0, h)} ${pt(x1, BD, h)} ${pt(x0, BD, h)}`}
        className={face.top}
      />

      <line
        x1={lx}
        y1={ly}
        x2={lx}
        y2={BASE}
        strokeWidth={1}
        strokeOpacity={0.5}
        className={STROKE_RULE}
      />

      {/* Seated on the top face, which binds the figure to its own solid. The
       * face is a constant 2*BW wide whatever the bar's height, so this never
       * crowds. */}
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={LABEL}
        className={cn(FONT_MONO, row.brand ? FILL_ON_BRAND : FILL_INK)}
      >
        {row.value}
      </text>

      <text
        x={lx}
        y={BASE + 7}
        textAnchor="end"
        fontSize={LABEL}
        transform={`rotate(-90 ${lx} ${BASE + 7})`}
        className={cn(FONT_MONO, row.brand ? FILL_BRAND : FILL_INK_MUTED)}
      >
        {row.short ?? row.name}
      </text>
    </g>
  );
}

function IsoBars({ metric }: { metric: BenchmarkMetric }) {
  const { BD, PITCH } = ISO;
  const span = (metric.rows.length - 1) * PITCH + ISO.BW;
  const [gx1, gy1] = project(-12, BD, 0);
  const [gx2, gy2] = project(span + 12, BD, 0);

  return (
    <svg
      viewBox="-40 -94 330 352"
      className={CHART_SVG}
      role="img"
      aria-label={`${metric.title} by provider, isometric bar chart`}
    >
      {/* Ground plane: one hairline the bars stand on and the leaders drop from. */}
      <line
        x1={gx1}
        y1={gy1}
        x2={gx2}
        y2={gy2}
        strokeWidth={1}
        strokeOpacity={0.5}
        className={STROKE_RULE}
      />

      {/* Back to front. Bars never overlap at these spacings, but painting in
       * depth order keeps that true if PITCH is ever tightened. */}
      {metric.rows.map((row, i) => (
        <IsoBar key={row.name} row={row} i={i} />
      ))}
    </svg>
  );
}

/* ── Form 2 · unit field ───────────────────────────────────────────────────
 *
 * One cell per article, a hundred per provider, filled by how many come back
 * correct. Counted in the direction the cell's own qualifier promises: the
 * column says HIGHER IS BETTER, so the longer comb has to be the better one.
 *
 * The trade this makes: accuracy only runs 72–93%, so the combs differ by 21
 * units out of 100 rather than dramatically. Read as errors the same data
 * spreads 4x and separates far harder — but it inverts the direction, and a
 * chart that contradicts its own label costs more than the contrast is worth.
 *
 * The track takes the full width with its label above rather than beside it;
 * at a hundred units a name column would squeeze each unit under a pixel.
 * Units flex, so the comb stays true at any column width. */
const UNITS = 100;

function UnitField({ metric }: { metric: BenchmarkMetric }) {
  const rows = metric.rows.filter((row) => row.n != null);

  return (
    <div>
      <p className={cn(TYPE_LABEL, "uppercase", INK_MUTED)}>Correct per 100</p>

      <ul className="mt-3 space-y-3">
        {rows.map((row) => {
          const correct = Math.round(row.n as number);
          const ink = row.brand ? BRAND : INK_MUTED;

          return (
            <li
              key={row.name}
              title={`${row.name}: ${correct} correct per 100`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("truncate", TYPE_LABEL, ink)}>
                  {row.short ?? row.name}
                </span>
                <span className={cn("shrink-0 tabular-nums", TYPE_LABEL, ink)}>
                  {correct}
                </span>
              </div>

              <span className="mt-1.5 flex gap-px" aria-hidden="true">
                {Array.from({ length: UNITS }, (_, k) => (
                  <span
                    key={k}
                    className={cn(
                      "h-2 flex-1",
                      k < correct
                        ? row.brand
                          ? BG_BRAND
                          : BG_INERT
                        : BG_TRACK,
                    )}
                  />
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Form 3 · ring radar ────────────────────────────────────────────────────
 *
 * Coverage is the one column akta does not win, and a bar list said so twice —
 * once by rank, once by putting a visibly shorter bar under the brand name. A
 * polar plot states the same fact more fairly: two dots a hair apart on the
 * outer ring read as "tied at the top of the field", which is what a 1.0-point
 * gap on 73.7 actually is.
 *
 * The rings are the grid, not the data — providers sit at their own bearings,
 * and the dots are deliberately NOT joined into a spider polygon. Six rival
 * vendors are not one series, and connecting them would draw a shape whose
 * area means nothing.
 *
 * The radial scale starts at 40%, not 0. On a radial axis that is a real
 * distortion (area goes as r squared), so the grid rings are drawn and
 * labelled — the truncation is stated on the chart rather than hidden in it. */
const RADAR = {
  R: 92,
  MIN: 40,
  MAX: 80,
  RINGS: [50, 60, 70, 80],
  SWEEP: 24,
  LABEL_R: 116,
  HUB: 14,
};

/* Rounded, because cos(-90°) lands on 6.1e-17 and SVG then carries an
 * exponent-notation coordinate through to the DOM. */
const round2 = (n: number) => Math.round(n * 100) / 100;

const polar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [round2(r * Math.cos(a)), round2(r * Math.sin(a))];
};

const radarR = (n: number) =>
  ((n - RADAR.MIN) / (RADAR.MAX - RADAR.MIN)) * RADAR.R;

function RingRadar({ metric }: { metric: BenchmarkMetric }) {
  const { R, RINGS, SWEEP, LABEL_R, HUB } = RADAR;

  /* Brand takes 12 o'clock; the rest follow in the order they were ranked. */
  const brand = metric.rows.find((row) => row.brand) ?? metric.rows[0];
  const ordered = [brand, ...metric.rows.filter((row) => !row.brand)];
  const bearing = (i: number) => -90 + i * (360 / ordered.length);

  const rBrand = radarR(brand.n ?? 0);
  const [wx1, wy1] = polar(rBrand, -90 - SWEEP);
  const [wx2, wy2] = polar(rBrand, -90 + SWEEP);

  return (
    <svg
      viewBox="-165 -130 330 268"
      className={CHART_SVG}
      role="img"
      aria-label={`${metric.title} by provider, polar plot`}
    >
      <defs>
        <pattern
          id="akta-radar-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="3"
            cy="3"
            r="1.1"
            fillOpacity="0.45"
            className={FILL_BRAND}
          />
        </pattern>
      </defs>

      <g strokeOpacity="0.45" fill="none" className={STROKE_RULE}>
        {RINGS.map((v) => (
          <circle key={v} r={radarR(v)} strokeWidth={1} />
        ))}
        {/* Spokes stay well under the rings — they associate a marker with its
         * label without competing with either. */}
        <g strokeOpacity="0.3">
          {ordered.map((row, i) => {
            const [x, y] = polar(R, bearing(i));
            return (
              <line
                key={row.name}
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                strokeWidth={1}
              />
            );
          })}
        </g>
      </g>

      {/* Tick dots where each ring meets the crosshair — the reference's way of
       * making a grid read as measured. */}
      <g fillOpacity="0.7" className={FILL_RULE}>
        {[90, 270].map((deg) => (
          <g key={deg}>
            {RINGS.map((v) => {
              const [x, y] = polar(radarR(v), deg);
              return <circle key={v} cx={x} cy={y} r={1.8} />;
            })}
          </g>
        ))}
      </g>

      {/* Brand reach as area, in a halftone the grid cannot be mistaken for. */}
      <path
        d={`M 0 0 L ${wx1} ${wy1} A ${rBrand} ${rBrand} 0 0 1 ${wx2} ${wy2} Z`}
        fill="url(#akta-radar-hatch)"
      />

      {ordered.map((row, i) => {
        const deg = bearing(i);
        const [x, y] = polar(radarR(row.n ?? 0), deg);
        const [lx, ly] = polar(LABEL_R, deg);
        const cos = Math.cos((deg * Math.PI) / 180);
        const anchor =
          Math.abs(cos) < 0.25 ? "middle" : cos > 0 ? "start" : "end";

        return (
          <g key={row.name}>
            <title>{`${row.name}: ${row.value}`}</title>

            {/* Markers carry the data, so they outweigh every grid mark: a halo
             * on the brand, a 2.5px canvas ring on all of them so a dot stays
             * legible where it lands on a ring or a spoke. */}
            {row.brand && (
              <circle
                cx={x}
                cy={y}
                r={12}
                fill="none"
                strokeWidth={1}
                strokeOpacity={0.35}
                className={STROKE_BRAND}
              />
            )}
            <circle
              cx={x}
              cy={y}
              r={row.brand ? 7 : 5.5}
              strokeWidth={2.5}
              className={cn(row.brand ? FILL_BRAND : FILL_INERT, STROKE_CANVAS)}
            />

            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontSize={LABEL}
              className={cn(FONT_MONO, row.brand ? FILL_BRAND : FILL_INK)}
            >
              {row.name}
            </text>
            <text
              x={lx}
              y={ly + 14}
              textAnchor={anchor}
              fontSize={LABEL}
              className={cn(FONT_MONO, row.brand ? FILL_BRAND : FILL_INK_MUTED)}
            >
              {row.value}
            </text>
          </g>
        );
      })}

      {/* Hub, drawn last so the spokes tuck under it. Same treatment as the
       * icon chip in the cell's title band. */}
      <circle
        r={HUB}
        strokeWidth={1}
        strokeOpacity={0.6}
        className={cn(FILL_BRAND_TILE, STROKE_BRAND_BORDER)}
      />
      <g transform="translate(-8,-8)" className={INK_BRAND}>
        <HugeiconsIcon icon={metric.icon} size={16} strokeWidth={1.5} />
      </g>
    </svg>
  );
}

/* ── Form 4 · isometric slab stack ──────────────────────────────────────────
 *
 * Cost is a ratio story, not a rank story: $0.50 against $2.85 is 5.7x, and
 * six bars sorted cheapest-first buried that under their own ordering. Stacked
 * slabs of identical footprint put thickness — the only thing that varies —
 * directly against thickness.
 *
 * Every slab projects to the same rhombus, so a gap in z is a clean vertical
 * gap on screen: nothing occludes anything, and each slab shows its top face
 * and both edges. Cheapest rides on top, so cost reads as weight piling up
 * underneath it.
 *
 * Scaled to the shared 330-unit box (x1.5 from the 220 this was drawn in) so
 * the stack keeps its physical size while its labels join the common scale. */
const SLAB = { W: 69, D: 69, TMAX: 69, GAP: 18 };

function SlabStack({ metric }: { metric: BenchmarkMetric }) {
  const { W, D, TMAX, GAP } = SLAB;

  /* Rows arrive cheapest-first; the stack builds from the bottom, so the most
   * expensive is laid down first and the brand wafer ends up on top. */
  const stack = [...metric.rows].reverse();
  const slabs = stack.reduce<{ row: BenchmarkRow; t: number; z0: number }[]>(
    (acc, row) => {
      const prev = acc[acc.length - 1];
      const z0 = prev ? prev.z0 + prev.t + GAP : 0;
      return [...acc, { row, t: row.ratio * TMAX, z0 }];
    },
    [],
  );

  return (
    <svg
      viewBox="-190 -270 330 345"
      className={CHART_SVG}
      role="img"
      aria-label={`${metric.title} by provider, stacked isometric slabs`}
    >
      {slabs.map(({ row, t, z0 }) => {
        const face = faces(row.brand);
        const z1 = z0 + t;
        /* The left and right vertical edges project to (D/2 - z) and (W/2 - z),
         * not to the front edge's (W+D)/2 - z. Using the front edge put every
         * label 23px low — one plate out of step with its own slab. */
        const [, midY] = project(0, D, z0 + t / 2);
        const ink = row.brand ? FILL_BRAND : FILL_INK_MUTED;

        return (
          <g key={row.name}>
            <title>{`${row.name}: ${row.value}`}</title>

            <polygon
              points={`${pt(0, D, z1)} ${pt(W, D, z1)} ${pt(W, D, z0)} ${pt(0, D, z0)}`}
              className={face.left}
            />
            <polygon
              points={`${pt(W, 0, z1)} ${pt(W, D, z1)} ${pt(W, D, z0)} ${pt(W, 0, z0)}`}
              className={face.right}
            />
            <polygon
              points={`${pt(0, 0, z1)} ${pt(W, 0, z1)} ${pt(W, D, z1)} ${pt(0, D, z1)}`}
              className={face.top}
            />

            <text
              x={-(W + D) / 2 - 8}
              y={midY + 3}
              textAnchor="end"
              fontSize={LABEL}
              className={cn(FONT_MONO, ink)}
            >
              {row.name}
            </text>
            <text
              x={(W + D) / 2 + 8}
              y={midY + 3}
              textAnchor="start"
              fontSize={LABEL}
              className={cn(FONT_MONO, ink)}
            >
              {row.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Form 5 · ranked bars ───────────────────────────────────────────────────
 * One ranked row: name and figure on a line, the bar beneath it. The bar is a
 * track plus a fill rather than a border, so it survives any surface. Not used
 * by the default data, but kept so a metric can opt back into the plain form. */
function MetricBar({ row }: { row: BenchmarkRow }) {
  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={cn(
            "truncate",
            TYPE_LABEL,
            "uppercase",
            row.brand ? INK : INK_MUTED,
          )}
        >
          {row.name}
        </span>
        <span
          className={cn(
            "shrink-0 tabular-nums",
            TYPE_LABEL,
            row.brand ? BRAND : INK_MUTED,
          )}
        >
          {row.value}
        </span>
      </div>

      <div className={cn("h-1.5 w-full", BG_TRACK_HOVER)}>
        <div
          className={cn("h-full", row.brand ? BG_BRAND : BG_INERT)}
          style={{ width: `${Math.round(row.ratio * 100)}%` }}
        />
      </div>
    </li>
  );
}

function RankedBars({ metric }: { metric: BenchmarkMetric }) {
  return (
    <ul className="mt-5 space-y-3" aria-hidden="true">
      {metric.rows.map((row) => (
        <MetricBar key={row.name} row={row} />
      ))}
    </ul>
  );
}

const CHARTS: Record<
  BenchmarkMetric["chart"],
  React.ComponentType<{ metric: BenchmarkMetric }>
> = {
  iso: IsoBars,
  units: UnitField,
  radar: RingRadar,
  slab: SlabStack,
  bars: RankedBars,
};

function MetricChart({ metric }: { metric: BenchmarkMetric }) {
  const Form = CHARTS[metric.chart];
  return (
    <ChartFrame metric={metric}>
      <Form metric={metric} />
    </ChartFrame>
  );
}

/* ── Cell ───────────────────────────────────────────────────────────────────
 * One bento cell, read like a table column: the header band names the
 * metric and says what it measures, then below a rule comes the rule for
 * reading it, the claim, and the graphic that argues it. Two bands, one
 * rule between them, no boxes. Title first because the four headers then line up across the band —
 * under charts of different heights they never did — and because "higher is
 * better" only means something once you know what it is higher *of*. The
 * cell's own right and bottom rules come from RULE_CELL, so the grid keeps
 * separating correctly at one, two or four columns. */
function MetricCell({ metric }: { metric: BenchmarkMetric }) {
  return (
    <article
      className={cn(
        "flex flex-col",
        RULE_CELL,
        "akta-notch [--akta-notch-arm:0px] [--akta-notch-inset:0px] [--akta-notch-weight:1px] lg:[--akta-notch-arm:10px]",
        NOTCH_GRAY,
      )}
    >
      {/* Header band: icon + name, then the blurb under it. The whole
       * definition of the column sits above the rule; everything below it is
       * evidence. */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center",
              INK_BRAND,
              BG_BRAND_TILE,
              RING_TILE,
            )}
            aria-hidden="true"
          >
            <HugeiconsIcon icon={metric.icon} size={16} strokeWidth={1.5} />
          </span>

          <h3 className={cn(TYPE_HEADING_20, INK)}>
            {metric.title}{" "}
            <span className={cn(TYPE_LABEL, "uppercase", INK_MUTED)}>
              ({metric.qualifier})
            </span>
          </h3>
        </div>

        <p className={cn("mt-3 max-w-[42ch]", TYPE_COPY_14, INK_MUTED)}>
          {metric.blurb}
        </p>
      </div>

      <div className={cn("flex flex-1 flex-col", RULE_T)}>
        <MetricChart metric={metric} />
      </div>
    </article>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────
 * Header on the grid, then a full-bleed band whose top and bottom rules cross
 * the viewport while the cells stay on the 1440 grid. */
export interface AktaBenchmarks01Props {
  eyebrow?: string;
  heading?: string;
  description?: string;
  /* Replace the four default readouts. Each metric picks its own chart form. */
  metrics?: BenchmarkMetric[];
  className?: string;
}

function AktaBenchmarks01({
  eyebrow = "Benchmarks",
  heading = "We Ranked Top as News Provider",
  description = "Best news quality at the lowest cost across News APIs, Agentic Search APIs, LLMs, and Bulk Scrapers.",
  metrics = METRICS,
  className = "",
}: AktaBenchmarks01Props) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        FONT_SANS,
        BG_CANVAS,
        INK,
        className,
      )}
    >
      <div className={cn(GRID, "relative", RULE_X_LG)}>
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          description={description}
        />
      </div>

      <div className={cn("relative", RULE_Y)}>
        <div
          data-akta-reveal
          className={cn(
            GRID,
            "relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            RULE_L_LG,
          )}
        >
          {metrics.map((metric) => (
            <MetricCell key={metric.title} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AktaBenchmarks01;
