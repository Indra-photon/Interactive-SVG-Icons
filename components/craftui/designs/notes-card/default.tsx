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
  PencilEdit02Icon,
  Tick02Icon,
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

/**
 * TWO PAIRS, AND ONLY TWO. 16px rides with medium; 14px rides with normal.
 * Selection is signalled by surface and colour — the white pill, the ink fill
 * — never by a third size or a heavier weight, which is how a scale grows a
 * 15 and a 13 nobody decided on.
 *
 * Tracking is Inter's own optical ramp, and it loosens as the size falls:
 * roughly -0.011em at 16 and neutral at 14. It is stated on the type tokens
 * rather than on call sites, because tracking that lives at call sites ends up
 * on two of the seven places the same size is used.
 *
 * `*Type` is the size, weight and tracking with no colour, for text that sits
 * on a coloured surface and brings its own ink — the solid button, the tinted
 * status pill. The full token is the same three plus the neutral it defaults
 * to.
 */
const t = {
  nameType: "text-[16px] font-medium tracking-[-0.02em]",
  name: "text-[16px] font-medium tracking-[-0.02em] text-[oklch(17%_0.018_264)]",
  bodyType: "text-[14px] font-normal tracking-[-0.01em]",
  body: "text-[14px] font-normal tracking-[-0.01em] text-[oklch(57%_0.014_264)]",

  /**
   * The right rail. 80, not 72: the status pill has to hold "Incoming" at the
   * body size, and the action row has to divide into three boxes and two gaps
   * — 24 + 4 + 24 + 4 + 24. Both land on 80, which is what lets the pill and
   * the cluster under it share a left edge, a right edge and a centre line.
   */
  rail: "w-[80px]",

  /**
   * Concentric, and the arithmetic is checkable: inner = outer − the padding
   * between them. 16 on the card, whose content sits at `p-2` (8), so rows,
   * the segmented track and the tab pill are 8. The track's own `p-1` (4)
   * makes its selected pill 4, which is also what the action boxes take as the
   * smallest surfaces on the screen.
   */
  radius: "rounded-[16px]",
  radiusInner: "rounded-[8px]",
  radiusTight: "rounded-[4px]",

  card: "bg-[oklch(100%_0_0)]",
  screen: "bg-[oklch(96%_0.003_264)]",

  well: "bg-[var(--row)] [--row:oklch(97%_0.003_264)]",
  wellHover: "hover:[--row:oklch(95%_0.004_264)]",

  hairline: "shadow-[0_1px_0_0_oklch(93%_0.004_264)]",

  shadowBorder:
    "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)]",
  shadowBorderHover:
    "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.08),0_2px_4px_0_rgba(0,0,0,0.06)]",

  insetRing: "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
  insetRingHover: "hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",

  /**
   * Every property that actually changes, and nothing else — never `all`, and
   * never `transition-colors`, which watches six properties to catch one.
   * `color` is in the list because the action icons tint on hover: without it
   * the shadow eased over 150ms while the icon snapped in the same gesture.
   */
  move: "transition-[background-color,box-shadow,color,scale] duration-150 ease-out",
  /** 0.96 exactly. Below 0.95 the press reads as a flinch. */
  press: "active:scale-[0.96]",

  /**
   * A 40px-tall hit area on a control that is drawn shorter, as a pseudo
   * element so nothing in layout moves. Full-width, so two controls sitting
   * side by side meet at their shared edge and never overlap.
   */
  hit: "relative after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2",
  /**
   * The same, for the 24px action boxes. 28 wide is the pitch — box plus gap —
   * so three of them tile the rail exactly and stop where the neighbour's
   * begins. It is the largest they can be without colliding, which the height
   * has to make up for.
   */
  hitTight:
    "relative after:absolute after:top-1/2 after:left-1/2 after:h-10 after:w-7 after:-translate-x-1/2 after:-translate-y-1/2",

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

/* -------------------------------------------------------------------- data */

type Task = {
  title: string;
  description?: string;
  status: { label: string; tone: Tone };
  due?: string;
  progress?: [number, number];
  comments?: number;
  files?: number;
  done?: boolean;
  swiped?: boolean;
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
      },
      {
        title: "User Interface",
        description: "New design elements and styles.",
        status: { label: "Incoming", tone: "green" },
        due: "5:00 PM",
        progress: [1, 5],
        comments: 1,
        files: 4,
      },
      {
        title: "Motion Guidelines",
        description: "Easing curves, durations and reduced-motion rules.",
        status: { label: "Review", tone: "amber" },
        due: "6:15 PM",
        progress: [2, 4],
        comments: 5,
        files: 1,
      },
    ],
  },
  {
    label: "Yesterday",
    tasks: [
      {
        title: "Typography Styles",
        status: { label: "Done", tone: "grey" },
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

/** The iOS status bar — time left, radios right. */
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
        t.bodyType,
        "flex h-5 items-center justify-center overflow-hidden rounded-full px-2 pb-[1px] leading-4",
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

/**
 * The row's three actions, each on its own surface. Every box is the card's
 * white raised on the row's recessed fill — the same figure the segmented
 * control's selected pill draws, which is what says "control" here rather than
 * "content" — and the tightest radius, because these are the smallest surfaces
 * on the screen.
 *
 * Colour only on hover, and only on the one being pointed at: ink for edit,
 * the green already carrying the done mark, the red already in `tone.red`.
 * Three coloured boxes at rest would outweigh the status pill above them.
 */
const ACTIONS = [
  {
    label: "Edit",
    icon: PencilEdit02Icon,
    hover: "hover:text-[oklch(17%_0.018_264)]",
  },
  {
    label: "Complete",
    icon: Tick02Icon,
    hover: "hover:text-[oklch(52%_0.115_155)]",
  },
  {
    label: "Delete",
    icon: Delete02Icon,
    hover: "hover:text-[oklch(55%_0.150_25)]",
  },
];

function Actions() {
  return (
    // 24 + 4 + 24 + 4 + 24 = 80, the rail exactly.
    <div className={cn(t.rail, "flex items-center gap-1")}>
      {ACTIONS.map(({ label, icon, hover }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className={cn(
            t.radiusTight,
            t.card,
            t.shadowBorder,
            t.shadowBorderHover,
            t.move,
            t.press,
            t.hitTight,
            hover,
            "flex size-6 items-center justify-center text-[oklch(57%_0.014_264)]",
          )}
        >
          <Icon icon={icon} size={16} />
        </button>
      ))}
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

/** One task: mark, title and status, description, then counts left and actions right. */
function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-stretch gap-2">
      {/* A div, not a button. The row was one pressable surface until it grew
          three of its own, and a button inside a button is invalid markup — so
          the actions are the interactive things now and the row is what holds
          them. */}
      <div
        // `pt-[15px] pb-4` — 15 and 16, not 16 and 16. The row's topmost ink is
        // the status mark and its bottommost is an action box, and the two do
        // not sit in their boxes the same way: the mark is a circle on a 24
        // grid whose outer edge stops 1.25 short of its own box, while an
        // action box is filled to its edge. Equal padding therefore renders
        // 17.25 above the visible mark and 16 below the visible boxes.
        className={cn(
          t.radiusInner,
          t.well,
          t.wellHover,
          t.insetRing,
          t.insetRingHover,
          t.move,
          "flex min-w-0 flex-1 items-start gap-2 px-2 pt-[15px] pb-4 text-left",
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

            <div className="ml-auto shrink-0">
              <Actions />
            </div>
          </div>
        </div>
      </div>

      {task.swiped && (
        <div
          className={cn(
            t.radiusInner,
            tone.red,
            t.rail,
            t.bodyType,
            "flex shrink-0 flex-col items-center justify-center gap-1",
          )}
        >
          <Icon icon={Delete02Icon} size={18} />
          <span>Delete</span>
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
            t.bodyType,
            t.move,
            t.press,
            t.hit,
            "px-3 py-1.5",
            i === 0
              ? cn(t.card, t.shadowBorder, "text-[oklch(17%_0.018_264)]")
              : // The unselected segments now answer to the pointer. They
                // carried a transition for a state they did not have.
                "text-[oklch(57%_0.014_264)] hover:text-[oklch(17%_0.018_264)]",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/**
 * The card's footer: four named tabs, the selected one filled with the ink
 * value. Selection is the fill and the white label, not a size or a weight —
 * every tab is set at the body pair.
 *
 * Padding follows the optical rule, `icon-side = text-side − 2`: an icon does
 * not fill its box the way a letter fills its line, so equal padding reads as
 * a label pushed off-centre. That is `pl-2.5 pr-3` on the filled tab and
 * `pl-1 pr-1.5` on the bare ones, which is also what buys the row enough width
 * to seat four labels inside a 390 screen.
 */
function TabBar() {
  return (
    <nav className="flex shrink-0 items-center justify-between gap-0.5 px-2 py-2 shadow-[0_-1px_0_0_oklch(93%_0.004_264)]">
      {NAV_TABS.map(({ label, icon }, i) => {
        const selected = i === 0;
        return (
          <button
            key={label}
            type="button"
            className={cn(
              t.radiusInner,
              t.bodyType,
              t.move,
              t.press,
              t.hit,
              "flex items-center justify-center gap-1.5 py-2",
              selected
                ? cn(t.solid, "pl-2.5 pr-3")
                : "pl-1 pr-1.5 text-[oklch(57%_0.014_264)] hover:bg-[oklch(97%_0.003_264)]",
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
          {/* `pl-3 pr-3.5` — the same optical rule the tabs follow, with the
              icon on the left this time. */}
          <button
            type="button"
            className={cn(
              t.radiusInner,
              t.solid,
              t.solidHover,
              t.nameType,
              t.move,
              t.press,
              t.hit,
              "flex items-center gap-1.5 py-2 pr-3.5 pl-3",
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
