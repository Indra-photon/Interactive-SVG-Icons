import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Globe02Icon,
  Location01Icon,
  SparklesIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const PANEL_W = 624;
const PANEL_H = 252;
const STAGE_W = 560;
const STAGE_H = 188;
const TILE = 48;
const PILL_W = 104;
const CARD_X = 155;
const CARD_W = 250;
const CARD_RIGHT = CARD_X + CARD_W;
const RIGHT_CX = 508;
const ELBOW_R = 10;

const LANES = [24, 94, 164];
const PORTS = [47, 94, 141];

const pctX = (x: number) => `${(x / STAGE_W) * 100}%`;
const pctY = (y: number) => `${(y / STAGE_H) * 100}%`;
const u = (n: number) => `calc(${n} * var(--u))`;

const STROKE = 1.75;

const ROW_ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: STROKE,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const NODE_SHADOW =
  "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]";

type RowIconProps = { className?: string };

function BookingsIcon({ className }: RowIconProps) {
  return (
    <svg
      viewBox="0 0 21.332 21.332"
      className={className}
      aria-hidden="true"
      {...ROW_ICON_PROPS}
    >
      <path d="M14.223 1.777V5.332M7.109 1.777V5.332" />
      <path d="M11.555 3.555H9.777C6.427 3.555 4.75 3.555 3.709 4.596 2.668 5.637 2.668 7.314 2.668 10.668V12.445C2.668 15.795 2.668 17.473 3.709 18.513 4.75 19.555 6.427 19.555 9.777 19.555H11.555C14.909 19.555 16.582 19.555 17.627 18.513 18.668 17.473 18.668 15.795 18.668 12.445V10.668C18.668 7.314 18.668 5.637 17.627 4.596 16.582 3.555 14.909 3.555 11.555 3.555Z" />
      <path d="M2.668 8.891H18.668" />
      <path d="M8.891 16.445L8.891 12.307C8.891 12.14 8.767 12 8.619 12H8M12.445 16.444L13.764 12.349C13.774 12.322 13.777 12.293 13.777 12.268 13.777 12.118 13.66 12 13.509 12L11.555 12" />
    </svg>
  );
}

function OrdersIcon({ className }: RowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...ROW_ICON_PROPS}
    >
      <path d="M8 7L16 7C17.886 7 18.828 7 19.414 7.586C20 8.172 20 9.114 20 11L20 15C20 18.3 20 19.95 18.975 20.975C17.95 22 16.3 22 13 22L11 22C7.7 22 6.05 22 5.025 20.975C4 19.95 4 18.3 4 15L4 11C4 9.114 4 8.172 4.586 7.586C5.172 7 6.114 7 8 7Z" />
      <path d="M16 9.5C16 5.634 14.209 2 12 2C9.791 2 8 5.634 8 9.5" />
    </svg>
  );
}

function LeadsIcon({ className }: RowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...ROW_ICON_PROPS}
    >
      <path d="M9 5L21 5" />
      <path d="M3 5L5 5" />
      <path d="M9 12L21 12" />
      <path d="M3 12L5 12" />
      <path d="M9 19L21 19" />
      <path d="M3 19L5 19" />
    </svg>
  );
}

function LogicIcon({ className }: RowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...ROW_ICON_PROPS}
    >
      <path
        d="M3 4C3 2.345 3.345 2 5 2H9C10.655 2 11 2.345 11 4C11 5.655 10.655 6 9 6H5C3.345 6 3 5.655 3 4Z"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path
        d="M13 13C13 11.345 13.345 11 15 11H19C20.655 11 21 11.345 21 13C21 14.655 20.655 15 19 15H15C13.345 15 13 14.655 13 13Z"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path
        d="M13 20C13 18.345 13.345 18 15 18H19C20.655 18 21 18.345 21 20C21 21.655 20.655 22 19 22H15C13.345 22 13 21.655 13 20Z"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <path d="M17 11C17 10.535 17 10.303 16.962 10.11C16.804 9.316 16.184 8.696 15.39 8.538C15.197 8.5 14.965 8.5 14.5 8.5H9.5C9.035 8.5 8.803 8.5 8.61 8.462C7.816 8.304 7.196 7.684 7.038 6.89C7 6.697 7 6.465 7 6" />
      <path d="M17 15V18" />
    </svg>
  );
}

const CONFIG_ROWS = [
  { id: "bookings", label: "Bookings", Icon: BookingsIcon, on: true },
  { id: "orders", label: "Orders", Icon: OrdersIcon, on: true },
  { id: "leads", label: "Leads", Icon: LeadsIcon, on: true },
  { id: "logic", label: "Logic", Icon: LogicIcon, on: false },
] as const;

const SOURCES = [
  { key: "globe", icon: Globe02Icon },
  { key: "maps", icon: Location01Icon },
  { key: "sparkles", icon: SparklesIcon },
] as const;

function elbow(x1: number, y1: number, x2: number, y2: number) {
  if (y1 === y2) return `M${x1} ${y1} H${x2}`;
  const midX = (x1 + x2) / 2;
  const dir = y2 > y1 ? 1 : -1;
  return [
    `M${x1} ${y1}`,
    `H${midX - ELBOW_R}`,
    `Q${midX} ${y1} ${midX} ${y1 + dir * ELBOW_R}`,
    `V${y2 - dir * ELBOW_R}`,
    `Q${midX} ${y2} ${midX + ELBOW_R} ${y2}`,
    `H${x2}`,
  ].join(" ");
}

const CONNECTORS = [
  ...LANES.map((lane, i) => elbow(TILE, lane, CARD_X, PORTS[i])),
  ...LANES.map((lane, i) =>
    elbow(CARD_RIGHT, PORTS[i], RIGHT_CX - (i === 1 ? PILL_W : TILE) / 2, lane),
  ),
];

function ConnectorLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      fill="none"
      aria-hidden="true"
    >
      {CONNECTORS.map((d) => (
        <path
          key={d}
          d={d}
          stroke="#e5e5e5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function SoundWaveBadge() {
  return (
    <span
      className="absolute flex items-center justify-center rounded-full bg-neutral-200 shadow-sm"
      style={{ top: u(-4), right: u(-4), width: u(20), height: u(20) }}
    >
      <svg
        viewBox="0 0 16 12"
        className="text-neutral-500"
        style={{ width: u(10), height: u(7.5) }}
        aria-hidden="true"
      >
        <rect x="0" y="4" width="2" height="4" rx="1" fill="currentColor" />
        <rect x="4" y="2" width="2" height="8" rx="1" fill="currentColor" />
        <rect x="8" y="0" width="2" height="12" rx="1" fill="currentColor" />
        <rect x="12" y="3" width="2" height="6" rx="1" fill="currentColor" />
      </svg>
    </span>
  );
}

function SourceIcon({ icon }: { icon: typeof Globe02Icon }) {
  return (
    <div
      className={cn(
        "relative z-10 flex items-center justify-center bg-white",
        NODE_SHADOW,
      )}
      style={{ width: u(TILE), height: u(TILE), borderRadius: u(12) }}
    >
      <HugeiconsIcon
        icon={icon}
        strokeWidth={STROKE}
        className="text-neutral-800"
        style={{ width: u(22), height: u(22) }}
      />
    </div>
  );
}

function RowToggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center rounded-full",
        on ? "justify-end bg-neutral-800" : "justify-start bg-neutral-200",
      )}
      style={{ width: u(34), height: u(20), padding: u(2) }}
      aria-hidden="true"
    >
      <span
        className="block rounded-full bg-white shadow-sm"
        style={{ width: u(16), height: u(16) }}
      />
    </span>
  );
}

function ConfigRow({
  label,
  Icon,
  on,
}: {
  label: string;
  Icon: (props: RowIconProps) => React.ReactElement;
  on: boolean;
}) {
  return (
    <div
      className="flex w-full items-end justify-between"
      style={{ paddingInline: u(20), paddingBlock: u(13.5) }}
    >
      <span className="flex items-end" style={{ gap: u(5) }}>
        <Icon className="h-[calc(18*var(--u))] w-[calc(18*var(--u))] shrink-0 text-neutral-800" />
        <span
          className="block font-medium text-neutral-800"
          style={{ fontSize: u(18), lineHeight: u(18) }}
        >
          {label}
        </span>
      </span>
      <RowToggle on={on} />
    </div>
  );
}

function AvatarOutput({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative z-10">
      <div
        className={cn("overflow-hidden rounded-full", NODE_SHADOW)}
        style={{ width: u(TILE), height: u(TILE) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
      <SoundWaveBadge />
    </div>
  );
}

function BookedPill({ label }: { label: string }) {
  return (
    <div className="relative z-10">
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-white",
          NODE_SHADOW,
        )}
        style={{ width: u(PILL_W), paddingBlock: u(10), gap: u(8) }}
      >
        <HugeiconsIcon
          icon={Calendar01Icon}
          strokeWidth={STROKE}
          className="text-neutral-800"
          style={{ width: u(16), height: u(16) }}
        />
        <span
          className="font-medium text-neutral-800"
          style={{ fontSize: u(14), lineHeight: u(16) }}
        >
          {label}
        </span>
      </div>
      <span
        className="absolute flex items-center justify-center rounded-full bg-emerald-500 shadow-sm"
        style={{ top: u(-6), right: u(-6), width: u(20), height: u(20) }}
      >
        <HugeiconsIcon
          icon={Tick01Icon}
          strokeWidth={2.5}
          className="text-white"
          style={{ width: u(12), height: u(12) }}
        />
      </span>
    </div>
  );
}

interface WorkflowPipelineProps {
  agents?: [string, string];
  status?: string;
  className?: string;
}

export default function WorkflowPipeline({
  agents = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  ],
  status = "Booked",
  className,
}: WorkflowPipelineProps) {
  const outputs = [
    <AvatarOutput key="agent-on-call" src={agents[0]} alt="Agent on call" />,
    <BookedPill key="status" label={status} />,
    <AvatarOutput
      key="agent-available"
      src={agents[1]}
      alt="Agent available"
    />,
  ];

  return (
    <div
      className={cn(
        "@container relative flex w-full items-center justify-center bg-neutral-50",
        className,
      )}
      style={
        {
          aspectRatio: `${PANEL_W} / ${PANEL_H}`,
          "--u": `${100 / PANEL_W}cqw`,
        } as React.CSSProperties
      }
    >
      <div
        className="relative"
        style={{
          width: `${(STAGE_W / PANEL_W) * 100}%`,
          aspectRatio: `${STAGE_W} / ${STAGE_H}`,
        }}
      >
        <ConnectorLines />

        {SOURCES.map(({ key, icon }, i) => (
          <div
            key={key}
            className="absolute left-0 -translate-y-1/2"
            style={{ top: pctY(LANES[i]) }}
          >
            <SourceIcon icon={icon} />
          </div>
        ))}

        <div
          className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]"
          style={{
            left: pctX(CARD_X),
            width: pctX(CARD_W),
            borderRadius: u(7),
          }}
        >
          {CONFIG_ROWS.map((row, i) => (
            <div key={row.id}>
              {i > 0 && <div className="h-px w-full bg-neutral-100" />}
              <ConfigRow label={row.label} Icon={row.Icon} on={row.on} />
            </div>
          ))}
        </div>

        {outputs.map((node, i) => (
          <div
            key={node.key}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pctX(RIGHT_CX), top: pctY(LANES[i]) }}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
