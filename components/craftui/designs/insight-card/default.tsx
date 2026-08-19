import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const CARD = {
  width: 362,
  radius: 24,
  padding: 28,
  background: "#F9DBC6",
  ink: "#181716",
  headingSize: 40,
} as const;

const DOTS = {
  pitch: 11,
  size: 2.6,
  bands: [
    "oklch(0.6103 0.1533 36.04)",
    "oklch(0.6496 0.1504 37.70)",
    "oklch(0.6890 0.1476 39.36)",
  ],
  shadeFalloff: 90,
  fieldHeight: 320,
} as const;

const CONE = {
  corner: "bottom-left",
  nudgeX: -19,
  nudgeY: 0,
  axisDeg: -44,
  spreadDeg: 18,
  length: 262,
  curve: -0.2,
  tipWidth: 6,
  visible: false,
  color: "#CE5B3C",
} as const;

const BALL = {
  scale: 0.55,
  base: "oklch(0.6103 0.1533 36.04)",
  highlight: "oklch(0.8213 0.0567 34.74)",
  shadow: "oklch(0.5683 0.1625 35.64)",
  rim: "oklch(0.6693 0.1257 36.24)",
} as const;

const SHADING = {
  azimuth: 265,
  offset: 0.85,
  midpoint: 0.7,
} as const;

const SCATTER = {
  clearance: 4.5,
  feather: 14,
  stragglers: 0,
  seed: 28,
} as const;

const CTA = {
  labelSize: 15,
  paddingX: 22,
  paddingY: 6,
  radius: 40,
  badgeSize: 34,
  iconSize: 16,
  labelColor: "#FFF6F0",
  from: "oklch(0.4703 0.1533 36.04)",
  to: "oklch(0.5490 0.1476 39.36)",
  innerShadow: [
    "inset 0 1px 0 0 rgb(224 153 128 / 0.5)",
    "inset 0 -1px 0 0 rgb(131 47 23 / 0.06)",
    "inset 0 9px 14px -9px rgb(183 142 127 / 0.65)",
    "inset 0 -11px 16px -11px rgb(79 26 11 / 0.7)",
  ].join(", "),
} as const;

const CORNERS = {
  "bottom-left": { x: 0, y: 1 },
  "bottom-right": { x: 1, y: 1 },
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
} as const;

const FIELD_WIDTH = CARD.width - CARD.padding * 2;
const SHADE_ID = "insight-card-ball-shade";

type Dot = { x: number; y: number; distance: number };

function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

type Geometry = {
  apex: { x: number; y: number };
  ball: { x: number; y: number; r: number };
  dir: { x: number; y: number };
  perp: { x: number; y: number };
  reach: number;
  halfWidthAt: (along: number) => number;
};

function buildGeometry(): Geometry {
  const corner = CORNERS[CONE.corner];
  const apex = {
    x: corner.x * FIELD_WIDTH + CONE.nudgeX,
    y: corner.y * DOTS.fieldHeight + CONE.nudgeY,
  };

  const axis = (CONE.axisDeg * Math.PI) / 180;
  const dir = { x: Math.cos(axis), y: Math.sin(axis) };
  const perp = { x: -dir.y, y: dir.x };

  const center = {
    x: apex.x + dir.x * CONE.length,
    y: apex.y + dir.y * CONE.length,
  };

  const radius = Math.min(
    CONE.length * Math.sin((CONE.spreadDeg * Math.PI) / 180) * BALL.scale,
    CONE.length * 0.999,
  );

  const beta = Math.asin(radius / CONE.length);
  const tangentDistance = Math.sqrt(CONE.length ** 2 - radius ** 2);
  const reach = tangentDistance * Math.cos(beta);
  const spread = tangentDistance * Math.sin(beta);
  const slope = reach === 0 ? 0 : spread / reach;

  const halfWidthAt = (d: number) => {
    const t = reach === 0 ? 0 : d / reach;
    return (
      CONE.tipWidth * (1 - t) +
      d * slope +
      CONE.curve * spread * Math.sin(Math.PI * t)
    );
  };

  return {
    apex,
    ball: { ...center, r: radius },
    dir,
    perp,
    reach,
    halfWidthAt,
  };
}

function distanceToShape(x: number, y: number, g: Geometry) {
  const toBall = Math.hypot(x - g.ball.x, y - g.ball.y) - g.ball.r;

  const ax = x - g.apex.x;
  const ay = y - g.apex.y;
  const along = ax * g.dir.x + ay * g.dir.y;
  const across = Math.abs(ax * g.perp.x + ay * g.perp.y);

  const toCone =
    along < 0 || along > g.reach
      ? Number.POSITIVE_INFINITY
      : across - g.halfWidthAt(along);

  return Math.min(toBall, toCone) - SCATTER.clearance;
}

function buildGrid(g: Geometry): Dot[] {
  const inset = DOTS.size + 1;
  const cols = Math.floor((FIELD_WIDTH - inset * 2) / DOTS.pitch) + 1;
  const rows = Math.floor((DOTS.fieldHeight - inset * 2) / DOTS.pitch) + 1;
  const offsetX = (FIELD_WIDTH - (cols - 1) * DOTS.pitch) / 2;

  const dots: Dot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = offsetX + col * DOTS.pitch;
      const y = inset + row * DOTS.pitch;
      const distance = distanceToShape(x, y, g);

      if (distance < 0) {
        if (hash(col, row, SCATTER.seed) > SCATTER.stragglers) continue;
      } else if (SCATTER.feather > 0 && distance < SCATTER.feather) {
        if (hash(col, row, SCATTER.seed) > distance / SCATTER.feather) continue;
      }

      dots.push({ x, y, distance: Math.max(distance, 0) });
    }
  }

  return dots;
}

const GEOMETRY = buildGeometry();
const DOT_BANDS = DOTS.bands.map((color) => ({ color, dots: [] as Dot[] }));

for (const dot of buildGrid(GEOMETRY)) {
  const t = Math.min(dot.distance / DOTS.shadeFalloff, 0.9999);
  DOT_BANDS[Math.floor(t * DOTS.bands.length)].dots.push(dot);
}

const CONE_PATH = (() => {
  const { apex, dir, perp, reach, halfWidthAt } = GEOMETRY;
  const SAMPLES = 24;
  const side = (sign: number) =>
    Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const along = (i / SAMPLES) * reach;
      const half = halfWidthAt(along) * sign;
      return `${apex.x + dir.x * along + perp.x * half} ${apex.y + dir.y * along + perp.y * half}`;
    });
  return `M ${side(1).join(" L ")} L ${side(-1).reverse().join(" L ")} Z`;
})();

const LIGHT_ANGLE = (SHADING.azimuth * Math.PI) / 180;
const LIGHT_DIR = { x: Math.cos(LIGHT_ANGLE), y: Math.sin(LIGHT_ANGLE) };

function DotField() {
  const { ball } = GEOMETRY;

  return (
    <svg
      viewBox={`0 0 ${FIELD_WIDTH} ${DOTS.fieldHeight}`}
      width="100%"
      className="block h-auto"
      aria-hidden="true"
    >
      {DOT_BANDS.map((band) => (
        <g key={band.color} fill={band.color}>
          {band.dots.map((dot) => (
            <circle
              key={`${dot.x}-${dot.y}`}
              cx={dot.x}
              cy={dot.y}
              r={DOTS.size}
            />
          ))}
        </g>
      ))}

      {CONE.visible && <path d={CONE_PATH} fill={CONE.color} />}

      <defs>
        <radialGradient
          id={SHADE_ID}
          gradientUnits="userSpaceOnUse"
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          fx={ball.x + LIGHT_DIR.x * ball.r * SHADING.offset}
          fy={ball.y + LIGHT_DIR.y * ball.r * SHADING.offset}
        >
          <stop offset={0} stopColor={BALL.highlight} />
          <stop offset={SHADING.midpoint} stopColor={BALL.base} />
          <stop offset={0.93} stopColor={BALL.shadow} />
          <stop offset={1} stopColor={BALL.rim} />
        </radialGradient>
      </defs>

      <circle cx={ball.x} cy={ball.y} r={ball.r} fill={`url(#${SHADE_ID})`} />
    </svg>
  );
}

function LearnMore({ label, href }: { label: string; href: string }) {
  const gradientAngle = 90 + CONE.axisDeg;

  return (
    <a
      href={href}
      className="group inline-flex w-fit items-center font-semibold tracking-[-0.01em] transition-transform duration-200 ease-out active:scale-[0.98]"
      style={{
        gap: CTA.paddingX * 0.6,
        paddingLeft: CTA.paddingX,
        paddingRight: CTA.paddingY,
        paddingTop: CTA.paddingY,
        paddingBottom: CTA.paddingY,
        borderRadius: CTA.radius,
        fontSize: CTA.labelSize,
        color: CTA.labelColor,
        backgroundImage: `linear-gradient(${gradientAngle}deg, ${CTA.from}, ${CTA.to})`,
        boxShadow: CTA.innerShadow,
      }}
    >
      {label}
      <span
        className="flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        style={{
          width: CTA.badgeSize,
          height: CTA.badgeSize,
          background: CARD.background,
          color: CTA.from,
        }}
      >
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={CTA.iconSize}
          strokeWidth={2.2}
        />
      </span>
    </a>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ color: BALL.base }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.00 2.65C12.80 2.65 13.45 3.57 13.45 4.70C13.45 5.83 12.80 6.75 12.00 6.75C11.20 6.75 10.55 5.83 10.55 4.70C10.55 3.57 11.20 2.65 12.00 2.65ZM16.54 6.14C16.78 6.84 16.15 7.70 15.13 8.05C14.12 8.40 13.09 8.11 12.85 7.41C12.61 6.70 13.24 5.85 14.26 5.50C15.27 5.15 16.30 5.43 16.54 6.14ZM15.17 11.76C14.52 12.27 13.41 11.94 12.70 11.03C11.98 10.11 11.93 8.96 12.58 8.45C13.24 7.94 14.35 8.27 15.06 9.18C15.77 10.09 15.82 11.25 15.17 11.76ZM9.37 11.60C8.75 11.18 8.73 10.14 9.32 9.27C9.90 8.40 10.88 8.03 11.50 8.45C12.11 8.86 12.14 9.91 11.55 10.78C10.97 11.65 9.99 12.01 9.37 11.60ZM7.24 6.34C7.45 5.59 8.49 5.24 9.55 5.54C10.61 5.85 11.30 6.69 11.09 7.44C10.87 8.18 9.84 8.54 8.78 8.23C7.72 7.93 7.03 7.08 7.24 6.34Z" />
      <circle cx="12" cy="7.7" r="1.15" fill="currentColor" stroke="none" />
      <path d="M12.15 12.4c-.35 2.2-.25 4.4 0 6.1" />
      <path
        d="M12.05 17.1C9.85 16.7 8.3 15.15 7.95 13.05C10.35 13.15 11.75 14.85 12.05 17.1Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M4.9 19.1c2.3-.45 4.4.2 7.2.15 2.5-.05 4.7-.55 7-.3" />
      <path d="M7.6 21.2c.95-.15 1.75-.1 2.5 0M14.2 21.15c.85-.1 1.55-.05 2.25.05" />
    </svg>
  );
}

type InsightCardProps = {
  brand?: string;
  heading?: ReactNode;
  ctaLabel?: string;
  href?: string;
  className?: string;
};

export default function InsightCard({
  brand = "NORTHBEAM",
  heading = (
    <>
      Draw <span className="font-semibold">Insights</span> From Your{" "}
      <span className="font-semibold">Data</span>
    </>
  ),
  ctaLabel = "Learn More",
  href = "#",
  className,
}: InsightCardProps) {
  return (
    <article
      className={cn("flex w-full flex-col overflow-hidden", className)}
      style={{
        maxWidth: CARD.width,
        borderRadius: CARD.radius,
        padding: CARD.padding,
        background: CARD.background,
        color: CARD.ink,
      }}
    >
      <div className="flex items-center gap-2">
        <BrandMark className="h-6 w-6" />
        <span className="text-[15px] font-bold tracking-[0.08em]">{brand}</span>
      </div>

      <h2
        className="mt-10 font-medium tracking-[-0.025em]"
        style={{ fontSize: CARD.headingSize, lineHeight: 0.95 }}
      >
        {heading}
      </h2>

      <div className="mt-5">
        <LearnMore label={ctaLabel} href={href} />
      </div>

      <div className="mt-13">
        <DotField />
      </div>
    </article>
  );
}
