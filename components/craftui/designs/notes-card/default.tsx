import Image from "next/image";
import {
  Add01Icon,
  Attachment01Icon,
  BatteryFullIcon,
  Calendar01Icon,
  CheckListIcon,
  CheckmarkCircle02Icon,
  CircleIcon,
  Clock01Icon,
  Delete02Icon,
  File01Icon,
  FullSignalIcon,
  InboxIcon,
  Message01Icon,
  UserIcon,
  WifiFullSignalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ tokens */

const STROKE = 1.5;

/** Every icon on the screen, drawn at one stroke weight. */
function Icon({
  icon,
  size = 20,
  className,
}: {
  icon: IconSvgElement;
  size?: number;
  className?: string;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={STROKE}
      className={cn("shrink-0", className)}
    />
  );
}

const t = {
  name: "text-[16px] font-medium text-[oklch(17%_0.018_264)]",
  body: "text-[13px] font-normal text-[oklch(57%_0.014_264)]",
  bodyInk: "text-[13px] font-normal text-[oklch(17%_0.018_264)]",
  rail: "w-[72px]",

  radius: "rounded-[12px]",
  radiusInner: "rounded-[8px]",
  radiusTight: "rounded-[4px]",

  card: "bg-[oklch(100%_0_0)]",
  screen: "bg-[oklch(96%_0.003_264)]",

  well: "bg-[var(--row)] [--row:oklch(97%_0.003_264)]",
  wellHover: "hover:[--row:oklch(95%_0.004_264)]",
  ringRow: "ring-[var(--row,oklch(100%_0_0))]",

  hairline: "shadow-[0_1px_0_0_oklch(93%_0.004_264)]",

  shadowBorder:
    "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)]",
  shadowBorderHover:
    "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.06)]",

  insetRing: "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
  insetRingHover: "hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",

  shadowMove: "transition-[background-color,box-shadow] duration-150 ease-out",

  markTrack: "stroke-[oklch(72%_0.012_264)]",
  markFill: "fill-[oklch(17%_0.018_264)]",

  solid: "bg-[oklch(17%_0.018_264)] text-[oklch(99%_0_0)]",
  solidHover: "hover:bg-[oklch(24%_0.020_264)]",
} as const;

const tone = {
  amber:
    "bg-[oklch(95%_0.075_92)] text-[oklch(52%_0.115_75)] shadow-[inset_0_0_0_1px_oklch(52%_0.115_75/0.16)]",
  green:
    "bg-[oklch(95%_0.055_155)] text-[oklch(52%_0.115_155)] shadow-[inset_0_0_0_1px_oklch(52%_0.115_155/0.16)]",
  red: "bg-[oklch(95%_0.045_25)] text-[oklch(55%_0.150_25)] shadow-[inset_0_0_0_1px_oklch(55%_0.150_25/0.16)]",
  blue: "bg-[oklch(95%_0.045_240)] text-[oklch(58%_0.130_240)] shadow-[inset_0_0_0_1px_oklch(58%_0.130_240/0.16)]",
  grey: "bg-[oklch(94%_0.004_264)] text-[oklch(44%_0.012_264)] shadow-[inset_0_0_0_1px_oklch(44%_0.012_264/0.16)]",
} as const;

type Tone = keyof typeof tone;

const avatar = [
  "bg-[oklch(88%_0.035_250)] text-[oklch(42%_0.070_250)]",
  "bg-[oklch(88%_0.035_150)] text-[oklch(42%_0.070_150)]",
  "bg-[oklch(88%_0.035_20)] text-[oklch(42%_0.070_20)]",
];

/* -------------------------------------------------------------------- data */

type Task = {
  title: string;
  description?: string;
  status: { label: string; tone: Tone };
  due?: string;
  progress?: [number, number];
  comments?: number;
  files?: number;
  collaborators: string[];
  done?: boolean;
  swiped?: boolean;
};

/** Pexels crop, square at 2x and served at the size the avatar is drawn. */
const PHOTO = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&fit=crop&dpr=2`;

const PEOPLE: Record<string, string> = {
  Miguel: PHOTO(2379004),
  Angel: PHOTO(774909),
  Hane: PHOTO(415829),
  John: PHOTO(936119),
};

const GROUPS: { label: string; tasks: Task[] }[] = [
  {
    label: "Today",
    tasks: [
      {
        title: "Design System V.2",
        description: "Component inventory, tokens and usage rules.",
        status: { label: "Ongoing", tone: "blue" },
        due: "2:30 PM",
        progress: [4, 7],
        comments: 3,
        files: 2,
        collaborators: ["Miguel", "Angel", "Hane"],
      },
      {
        title: "User Interface",
        description: "New design elements and styles.",
        status: { label: "Incoming", tone: "green" },
        due: "5:00 PM",
        progress: [1, 5],
        comments: 1,
        files: 4,
        collaborators: ["Miguel", "John", "Sara"],
      },
      {
        title: "Motion Guidelines",
        description: "Easing curves, durations and reduced-motion rules.",
        status: { label: "Review", tone: "amber" },
        due: "6:15 PM",
        progress: [2, 4],
        comments: 5,
        files: 1,
        collaborators: ["Angel", "Hane"],
      },
    ],
  },
  {
    label: "Yesterday",
    tasks: [
      {
        title: "Typography Styles",
        status: { label: "Done", tone: "grey" },
        collaborators: ["John", "Hane"],
        done: true,
        swiped: true,
      },
    ],
  },
];

/* ------------------------------------------------------------------- shell */

const SCREEN_W = 390;
const SCREEN_H = 844;
const SCREEN_RADIUS = 44;
const BEZEL = 12;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

/** The iOS status bar — time left, radios right, at the body size. */
function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex h-[54px] shrink-0 items-center justify-between px-7 pt-1">
      <span className={cn(t.name, "tabular-nums")}>{time}</span>
      <div className="flex items-center gap-1.5 text-[oklch(17%_0.018_264)]">
        <Icon icon={FullSignalIcon} size={16} />
        <Icon icon={WifiFullSignalIcon} size={16} />
        <Icon icon={BatteryFullIcon} size={16} />
      </div>
    </div>
  );
}

/** The device: a bezel whose radius is the screen's plus its own thickness. */
function MobileFrame({
  children,
  time = "9:41",
  className,
}: {
  children: React.ReactNode;
  time?: string;
  className?: string;
}) {
  return (
    <div
      // No drop shadow. The viewBox is the frame's exact bounds, so a shadow
      // has no room to fall — it lands outside the box and is cut off square
      // by whatever clips the artwork, which reads as a grey slab under the
      // phone rather than as depth.
      // The bezel is the one surface that answers to the page rather than to
      // the UI on the screen: 18% is near-black against a white page, and on a
      // dark one it would be the page. 34% is the same hue lifted until the
      // device reads as an object sitting on the background instead of a hole
      // cut into it. Everything inside stays a light-theme app on purpose —
      // this is a picture of a phone, not a themed component.
      className={cn(
        "shrink-0 bg-[oklch(18%_0.008_264)] dark:bg-[oklch(34%_0.008_264)]",
        className,
      )}
      style={{
        padding: BEZEL,
        borderRadius: SCREEN_RADIUS + BEZEL,
      }}
    >
      <div
        className={cn(t.screen, "flex flex-col overflow-hidden")}
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: SCREEN_RADIUS,
        }}
      >
        <StatusBar time={time} />

        <div className="flex min-h-0 flex-1 px-1.5 pb-2">{children}</div>

        <div className="flex h-[34px] shrink-0 items-center justify-center">
          <div className="h-[5px] w-[140px] rounded-full bg-[oklch(60%_0.010_264)]" />
        </div>
      </div>
    </div>
  );
}

const SEGMENTS = ["All", "Today", "Done"];

const NAV_TABS = [
  { label: "Tasks", icon: CheckListIcon },
  { label: "Calendar", icon: Calendar01Icon },
  { label: "Inbox", icon: InboxIcon },
  { label: "Profile", icon: UserIcon },
];

/* --------------------------------------------------------------- fragments */

/** The status pill — cap-trimmed so the label centres on its ink, not its line box. */
function Tag({ label, tone: k }: { label: string; tone: Tone }) {
  return (
    <span
      className={cn(
        tone[k],
        t.rail,
        "flex h-5 items-center justify-center overflow-hidden rounded-full px-2 pb-[1px] text-[13px] leading-4 font-normal",
      )}
    >
      <span className="whitespace-nowrap [text-box:trim-both_cap_alphabetic]">
        {label}
      </span>
    </span>
  );
}

/** An icon and a number — attachments, comments, subtasks, time. */
function Count({
  icon,
  value,
}: {
  icon: IconSvgElement;
  value: number | string;
}) {
  return (
    <span className={cn(t.body, "flex items-center gap-1 tabular-nums")}>
      <Icon icon={icon} size={14} />
      {value}
    </span>
  );
}

/** Overlapping faces, ringed in the row's own fill so each bites the one behind it. */
function Collaborators({ names }: { names: string[] }) {
  return (
    <div className="flex -space-x-2">
      {names.map((name, i) => {
        const photo = PEOPLE[name];
        return (
          <span
            key={name}
            className={cn(
              photo ? "" : avatar[i % avatar.length],
              t.ringRow,
              "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-normal ring-2",
            )}
          >
            {photo ? (
              <Image
                src={photo}
                alt={name}
                width={48}
                height={48}
                className="size-full object-cover outline-1 -outline-offset-1 outline-black/10"
              />
            ) : (
              name[0]
            )}
          </span>
        );
      })}
    </div>
  );
}

const MARK = "size-6 shrink-0";

/** The leading mark: a ring filled as a wedge, in proportion to subtasks done. */
function ProgressMark({ done, total }: { done: number; total: number }) {
  const fraction = Math.min(Math.max(done / total, 0), 1);

  const C = 12;
  const R = 10;
  const r = 7;

  const angle = fraction * 2 * Math.PI;
  const x = C + r * Math.sin(angle);
  const y = C - r * Math.cos(angle);

  return (
    <svg viewBox="0 0 24 24" className={MARK}>
      <circle
        cx={C}
        cy={C}
        r={R}
        fill="none"
        strokeWidth={STROKE}
        className={t.markTrack}
      />
      {fraction >= 1 ? (
        <circle cx={C} cy={C} r={r} className={t.markFill} />
      ) : (
        fraction > 0 && (
          <path
            d={`M ${C} ${C} L ${C} ${C - r} A ${r} ${r} 0 ${fraction > 0.5 ? 1 : 0} 1 ${x} ${y} Z`}
            className={t.markFill}
          />
        )
      )}
    </svg>
  );
}

/** One task: mark, title and status, description, then details left and faces right. */
function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        className={cn(
          t.radiusInner,
          t.well,
          t.wellHover,
          t.insetRing,
          t.insetRingHover,
          t.shadowMove,
          "group flex min-w-0 flex-1 items-start gap-2 px-2 pt-[15px] pb-4 text-left",
        )}
      >
        {task.done ? (
          <Icon
            icon={CheckmarkCircle02Icon}
            size={24}
            className={cn(MARK, "text-[oklch(52%_0.115_155)]")}
          />
        ) : task.progress ? (
          <ProgressMark done={task.progress[0]} total={task.progress[1]} />
        ) : (
          <Icon
            icon={CircleIcon}
            size={24}
            className={cn(MARK, "text-[oklch(72%_0.012_264)]")}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-6 items-center gap-2">
            <span
              className={cn(
                t.name,
                "truncate",
                task.done && "text-[oklch(57%_0.014_264)] line-through",
              )}
            >
              {task.title}
            </span>
            <span className="ml-auto shrink-0">
              <Tag {...task.status} />
            </span>
          </div>

          {task.description && (
            <p
              className={cn(
                t.body,
                "mt-0.5 line-clamp-2 max-w-4/5 text-pretty",
              )}
            >
              {task.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">
            {task.progress && (
              <Count
                icon={CheckListIcon}
                value={`${task.progress[0]}/${task.progress[1]}`}
              />
            )}

            {task.files !== undefined && (
              <Count icon={Attachment01Icon} value={task.files} />
            )}
            {task.comments !== undefined && (
              <Count icon={Message01Icon} value={task.comments} />
            )}
            {task.due && <Count icon={Clock01Icon} value={task.due} />}

            <div className={cn(t.rail, "ml-auto flex justify-center")}>
              <Collaborators names={task.collaborators} />
            </div>
          </div>
        </div>
      </button>

      {task.swiped && (
        <div
          className={cn(
            t.radiusInner,
            tone.red,
            t.rail,
            "flex shrink-0 flex-col items-center justify-center gap-1",
          )}
        >
          <Icon icon={Delete02Icon} size={18} />
          <span className="text-[13px] font-normal">Delete</span>
        </div>
      )}
    </div>
  );
}

/** Segmented filter — the pill's radius is the track's minus its padding. */
function Segmented() {
  return (
    <div
      className={cn(
        t.radiusInner,
        t.well,
        t.insetRing,
        "flex items-center p-1",
      )}
    >
      {SEGMENTS.map((tab, i) => (
        <button
          key={tab}
          type="button"
          className={cn(
            t.radiusTight,
            "px-3 py-1.5 text-[13px] font-normal transition-colors",
            i === 0
              ? cn(
                  t.card,
                  t.shadowBorder,
                  "font-semibold text-[oklch(17%_0.018_264)]",
                )
              : "text-[oklch(57%_0.014_264)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** The card's footer: four named tabs, the selected one filled with the ink value. */
function TabBar() {
  return (
    <nav className="flex shrink-0 items-center justify-between gap-1 px-2 py-2 shadow-[0_-1px_0_0_oklch(93%_0.004_264)]">
      {NAV_TABS.map(({ label, icon }, i) => {
        const selected = i === 0;
        return (
          <button
            key={label}
            type="button"
            aria-label={label}
            className={cn(
              t.shadowMove,
              t.radiusInner,
              "flex items-center justify-center gap-1.5 py-2",
              selected
                ? cn(t.solid, "px-3 text-[15px] font-semibold")
                : "px-2 text-[13px] font-normal text-[oklch(57%_0.014_264)] hover:bg-[oklch(97%_0.003_264)]",
            )}
          >
            <Icon icon={icon} size={20} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

/* --------------------------------------------------------------- component */

/** The card: header, filter row, date-grouped task rows, tab bar. */
function Notes({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        t.radius,
        t.card,
        t.shadowBorder,
        "flex w-full flex-col overflow-hidden",
        className,
      )}
    >
      <header
        className={cn(
          t.hairline,
          "flex shrink-0 items-center justify-between gap-3 py-3 pr-2 pl-4",
        )}
      >
        <div className={cn(t.name, "flex items-center gap-1.5")}>
          <Icon icon={File01Icon} size={24} className="shrink-0" />
          <span className="flex items-center">Notes</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={cn(
              t.radiusInner,
              t.solid,
              t.solidHover,
              "flex items-center gap-1.5 py-2 pr-3.5 pl-3 text-[15px] font-semibold transition-colors",
            )}
          >
            <Icon icon={Add01Icon} size={18} />
            Add note
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-2">
        <div className="flex items-end justify-end gap-2">
          <Segmented />
        </div>

        {GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            {group.tasks.map((task) => (
              <TaskRow key={task.title} task={task} />
            ))}
          </div>
        ))}
      </div>

      <TabBar />
    </div>
  );
}

/**
 * The design: the card filling a phone screen, carrying its own footer.
 *
 * The phone is laid out in fixed pixels — the composition is drawn against a
 * 390pt screen and does not reflow — so the whole device is scaled to the
 * caller's width by a viewBox rather than by rewriting its measurements. In a
 * container narrower than the frame it shrinks, and it never exceeds its
 * natural size. The viewBox is the device's exact bounds, so nothing may paint
 * outside it — see the frame's missing shadow.
 */
export default function NotesCard({
  time,
  className,
}: {
  time?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      width={FRAME_W}
      height={FRAME_H}
      // 414px is FRAME_W spelled out: Tailwind scans source text, so a class
      // built from the constant would never be generated.
      className={cn("h-auto w-full max-w-[414px]", className)}
    >
      <foreignObject width={FRAME_W} height={FRAME_H}>
        <MobileFrame time={time}>
          <Notes className="min-h-0 flex-1" />
        </MobileFrame>
      </foreignObject>
    </svg>
  );
}
