"use client";

import { useId, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Building03Icon,
  Cancel01Icon,
  CheckmarkSquare02Icon,
  HelpSquareIcon,
  InputShortTextIcon,
  Link04Icon,
  ParagraphBulletsPoint01Icon,
  PlusSignIcon,
  SignatureIcon,
  SmartPhone01Icon,
  TextAlignLeftIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* ==========================================================================
 * Theming
 *
 * Every colour is a `--qd-*` custom property, each defined in the registry
 * item's cssVars as `var(--theme-token, literal)`. Installed into a themed app
 * the block inherits that app's palette; dropped into a bare one it still
 * renders, because the literal fallback carries it. Nothing here writes to the
 * consumer's base tokens.
 *
 * The shadcn primitives below are used exactly as installed — no base file is
 * edited. Their appearance is changed only through `className` at the call
 * site, which is why the field styles live in constants rather than in
 * components/ui/input.tsx.
 * ========================================================================== */

/**
 * One focus treatment for every control in the dialog, on `--ring` rather than
 * a low-opacity foreground — a 15%-alpha ring falls under the 3:1 contrast
 * minimum for non-text UI, so it reads as decoration rather than as focus.
 */
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--qd-ring)] focus-visible:ring-offset-0";

/**
 * Shared feel: a soft spring with just enough settle to read as physical.
 *
 * `visualDuration` rather than `duration` so the spring *arrives* in step with
 * the height and the body crossfade (both `SWAP_DURATION`), with the bounce
 * resolving quietly afterwards. Matching `duration` instead would squeeze the
 * settle into the same window and turn the overshoot into a twitch.
 */
const SPRING = {
  type: "spring",
  bounce: 0.18,
  visualDuration: 0.27,
} as const;

/**
 * Anything entering or leaving the screen rides this. The first control point
 * sits above the diagonal, so the move starts fast and settles — which is what
 * makes a transition feel responsive rather than hesitant. The container height
 * already used this curve; now the content inside it agrees.
 */
const EASE_OUT = [0.25, 1, 0.5, 1] as const;

const FADE = { duration: 0.18, ease: EASE_OUT } as const;

/**
 * Two stroke weights, not five. Optical weight should read constant across
 * sizes, which means small glyphs need a heavier stroke than large ones —
 * a single shared value looks thin at 16px and heavy at 32px.
 */
const ICON_STROKE_SMALL = 2; // 16-18px
const ICON_STROKE_LARGE = 1.6; // 22px and up

/**
 * Radius ladder. `--radius` is 0.625rem here, so rounded-xl = 10px,
 * rounded-2xl = 18px, rounded-3xl = 22px.
 *
 *   panel            22px   rounded-3xl
 *   tile      h-14   18px   rounded-2xl
 *   submit    h-12   18px   rounded-2xl
 *   seg track h-12   18px   rounded-2xl    ─┐ p-1 (4px)
 *   seg item  h-10   14px   rounded-[14px] ─┘ 18 - 4 = 14, concentric
 *   input     h-11   14px   rounded-[14px]
 *   icon box  40px   12px   rounded-[12px]
 *
 * The segmented control is the only true nesting, so it is the only place
 * strict concentric math applies. Everything else sits 28px in from the panel
 * edge — past the 24px point where layers stop reading as concentric — so
 * those radii are proportional to each control's height instead. The panel
 * still has to clear its largest child: at the base rounded-xl it was 10px
 * around 18px tiles, which is what read as wrong.
 */

/**
 * The container height, the body swap and the header title all belong to one
 * navigation, so they share a duration. SPRING's `visualDuration` is set to
 * match, which is what puts the corner morph on the same beat.
 */
const SWAP_DURATION = 0.27;

/** How far a screen travels on its way in or out. */
const SWAP_TRAVEL = 45;

/* ========================================================================== */
/* Question types                                                             */
/* ========================================================================== */

export type QuestionTypeId =
  | "text"
  | "options"
  | "social"
  | "company"
  | "checkbox"
  | "terms"
  | "phone"
  | "website";

export type QuestionType = {
  id: QuestionTypeId;
  label: string;
  /** Shown under the label once the type is picked. */
  description: string;
  icon: IconSvgElement;
  /** Prefills the question field so the step never opens empty-handed. */
  defaultQuestion: string;
};

/** Grid order is column-major-by-row: [Text, Options], [Social, Company], … */
export const QUESTION_TYPES: QuestionType[] = [
  {
    id: "text",
    label: "Text",
    description: "Ask for a free-form response",
    icon: InputShortTextIcon,
    defaultQuestion: "",
  },
  {
    id: "options",
    label: "Options",
    description: "Let guests choose from a list",
    icon: ParagraphBulletsPoint01Icon,
    defaultQuestion: "",
  },
  {
    id: "social",
    label: "Social Profile",
    description: "Ask for a social profile",
    icon: UserCircleIcon,
    defaultQuestion: "",
  },
  {
    id: "company",
    label: "Company",
    description: "Ask for the company the guest works for",
    icon: Building03Icon,
    defaultQuestion: "What company do you work for?",
  },
  {
    id: "checkbox",
    label: "Checkbox",
    description: "Ask guests to confirm something",
    icon: CheckmarkSquare02Icon,
    defaultQuestion: "",
  },
  {
    id: "terms",
    label: "Terms",
    description: "Collect consent to terms and conditions",
    icon: SignatureIcon,
    defaultQuestion: "",
  },
  {
    id: "phone",
    label: "Phone",
    description: "Ask for a phone number",
    icon: SmartPhone01Icon,
    defaultQuestion: "",
  },
  {
    id: "website",
    label: "Website",
    description: "Ask for a website URL",
    icon: Link04Icon,
    defaultQuestion: "",
  },
];

function getQuestionType(id: QuestionTypeId, types: QuestionType[]) {
  return types.find((type) => type.id === id)!;
}

export type QuestionDraft = {
  type: QuestionTypeId;
  question: string;
  required: boolean;
  settings: Record<string, unknown>;
};

export type QuestionFormProps = {
  type: QuestionType;
  onSubmit: (draft: QuestionDraft) => void;
};

/* ========================================================================== */
/* Layout primitives                                                          */
/* ========================================================================== */

function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-7", className)}>{children}</div>;
}

/** Full-bleed hairline — sits outside Section so it reaches both edges. */
function Divider() {
  return <div className="h-px w-full bg-[var(--qd-border)]" />;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className="text-[13px] text-[var(--qd-fg-muted)]"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * Height-animating reveal for optional sub-fields. The dialog shell measures
 * its content, so growing in here makes the whole dialog spring taller.
 */
function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={FADE}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========================================================================== */
/* Controls                                                                   */
/* ========================================================================== */

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="space-y-0.5">
        <Label
          htmlFor={id}
          className="text-[15px] font-medium text-[var(--qd-fg)]"
        >
          {label}
        </Label>
        {description && (
          <p className="text-[13px] text-[var(--qd-fg-muted)]">{description}</p>
        )}
      </div>
      {/* Scaled rather than re-sized so the thumb's own travel math still holds. */}
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn("origin-right scale-[1.35]", FOCUS)}
      />
    </div>
  );
}

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconSvgElement;
};

/**
 * `name` namespaces the sliding pill's layoutId so two segmented controls in
 * different views never try to morph into one another.
 */
function SegmentedControl<T extends string>({
  name,
  value,
  onValueChange,
  options,
}: {
  name: string;
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption<T>[];
}) {
  return (
    <div
      role="radiogroup"
      className="flex gap-1 rounded-2xl bg-[var(--qd-subtle)] p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative flex h-10 flex-1 items-center justify-center gap-2 rounded-[14px] text-[15px] font-medium",
              FOCUS,
            )}
          >
            {selected && (
              <motion.span
                layoutId={`qd-segment-${name}`}
                transition={SPRING}
                // Shadow is a token: a black-alpha pill shadow disappears
                // against a dark surface, so light and dark ship different
                // values rather than one that only works in light.
                className="absolute inset-0 rounded-[14px] bg-[var(--qd-raised)] shadow-[var(--qd-pill-shadow)]"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex items-center gap-2 transition-colors",
                selected ? "text-[var(--qd-fg)]" : "text-[var(--qd-fg-muted)]",
              )}
            >
              {option.icon && (
                <HugeiconsIcon
                  icon={option.icon}
                  size={18}
                  strokeWidth={ICON_STROKE_SMALL}
                />
              )}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SubmitButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      // shadcn's `default` variant paints bg-primary/text-primary-foreground;
      // both are plain colour utilities, so tailwind-merge lets these token
      // classes replace them cleanly. No base edit needed.
      className={cn(
        "h-12 w-full rounded-2xl text-[16px] font-semibold",
        "bg-[var(--qd-accent)] text-[var(--qd-accent-fg)] hover:bg-[var(--qd-accent-hover)]",
        FOCUS,
      )}
    >
      {children}
    </Button>
  );
}

/* ========================================================================== */
/* Pickers                                                                    */
/* ========================================================================== */

/** One cell of the 2-column type grid on the first screen. */
function TypeTile({
  type,
  onSelect,
}: {
  type: QuestionType;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-14 items-center gap-3 rounded-2xl px-4 text-left text-[16px] font-medium transition-colors active:translate-y-px",
        "bg-[var(--qd-subtle)] text-[var(--qd-fg)] hover:bg-[var(--qd-subtle-hover)]",
        FOCUS,
      )}
    >
      <HugeiconsIcon
        icon={type.icon}
        size={22}
        strokeWidth={ICON_STROKE_LARGE}
        className="shrink-0 text-[var(--qd-fg-muted)]"
      />
      {type.label}
    </button>
  );
}

/** The icon + name + description strip at the top of every step screen. */
function TypeSummary({ type }: { type: QuestionType }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--qd-subtle)]">
        <HugeiconsIcon
          icon={type.icon}
          size={22}
          strokeWidth={ICON_STROKE_LARGE}
          className="text-[var(--qd-fg-muted)]"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-[var(--qd-fg)]">
          {type.label}
        </p>
        <p className="truncate text-[14px] text-[var(--qd-fg-muted)]">
          {type.description}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Forms                                                                      */
/*                                                                            */
/* Base shadcn classes stay untouched; every visual change lands here.         */
/* ========================================================================== */

const inputClass =
  "h-11 rounded-[14px] border-[var(--qd-border)] bg-[var(--qd-field)] px-3.5 text-[15px] text-[var(--qd-fg)] shadow-none placeholder:text-[var(--qd-fg-muted)] focus-visible:border-[var(--qd-fg)] focus-visible:ring-0 focus-visible:ring-offset-0";

const textareaClass =
  "min-h-28 rounded-[14px] border-[var(--qd-border)] bg-[var(--qd-field)] px-3.5 py-3 text-[15px] text-[var(--qd-fg)] shadow-none placeholder:text-[var(--qd-fg-muted)] focus-visible:border-[var(--qd-fg)] focus-visible:ring-0 focus-visible:ring-offset-0";

/** Fields, then the submit button — the layout every step screen shares. */
function FormLayout({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: () => void;
}) {
  return (
    <>
      <Section className="space-y-5 py-5">{children}</Section>
      <Section className="pb-7">
        <SubmitButton onClick={onSubmit}>Add Question</SubmitButton>
      </Section>
    </>
  );
}

function QuestionField({
  value,
  onChange,
  placeholder = "",
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <Field label="Question" htmlFor={id}>
      <Input
        id={id}
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

/* ------------------------------------------------------------------- text */

export function TextForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [length, setLength] = useState<"short" | "multi">("short");
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: { length } })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Response Length">
        <SegmentedControl
          name="text-length"
          value={length}
          onValueChange={setLength}
          options={[
            { value: "short", label: "Short", icon: InputShortTextIcon },
            { value: "multi", label: "Multi-Line", icon: TextAlignLeftIcon },
          ]}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ phone */

export function PhoneForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: {} })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <p className="text-[14px] leading-[20px] text-[var(--qd-fg-muted)]">
        Please use the Phone Number question under the Personal Information
        section to get the phone number of the guest.
      </p>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- company */

export function CompanyForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [collectJobTitle, setCollectJobTitle] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [required, setRequired] = useState(false);
  const jobTitleId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { collectJobTitle, jobTitle },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <div className="space-y-3">
        <ToggleRow
          id={jobTitleId}
          label="Collect Job Title"
          checked={collectJobTitle}
          onCheckedChange={setCollectJobTitle}
        />
        <Reveal show={collectJobTitle}>
          <Input
            value={jobTitle}
            placeholder="What is your job title?"
            onChange={(event) => setJobTitle(event.target.value)}
            className={inputClass}
          />
        </Reveal>
      </div>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ terms */

export function TermsForm({ type, onSubmit }: QuestionFormProps) {
  const [contentType, setContentType] = useState<"text" | "link">("text");
  const [content, setContent] = useState("");
  const [showBeforeAccept, setShowBeforeAccept] = useState(false);
  const [collectSignature, setCollectSignature] = useState(false);
  const [required, setRequired] = useState(true);
  const showId = useId();
  const signatureId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question: content,
          required,
          settings: { contentType, showBeforeAccept, collectSignature },
        })
      }
    >
      <Field label="Content Type">
        <SegmentedControl
          name="terms-content-type"
          value={contentType}
          onValueChange={(next) => {
            setContentType(next);
            setContent("");
          }}
          options={[
            { value: "text", label: "Text", icon: TextAlignLeftIcon },
            { value: "link", label: "Link", icon: Link04Icon },
          ]}
        />
      </Field>

      {/* Swapping the control changes the dialog's height — the shell springs. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={contentType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE}
        >
          {contentType === "text" ? (
            <Field label="Terms Content">
              <Textarea
                autoFocus
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className={textareaClass}
              />
            </Field>
          ) : (
            <Field label="Terms Link">
              <Input
                autoFocus
                type="url"
                value={content}
                placeholder="https://"
                onChange={(event) => setContent(event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="space-y-3">
        <ToggleRow
          id={showId}
          label="Show Text Before Accept"
          description="Guests must view terms before accepting"
          checked={showBeforeAccept}
          onCheckedChange={setShowBeforeAccept}
        />
        <ToggleRow
          id={signatureId}
          label="Collect Signature"
          checked={collectSignature}
          onCheckedChange={setCollectSignature}
        />
        <ToggleRow
          id={requiredId}
          label="Required"
          checked={required}
          onCheckedChange={setRequired}
        />
      </div>
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- options */

export function OptionsForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [options, setOptions] = useState([
    { id: "option-1", value: "" },
    { id: "option-2", value: "" },
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [required, setRequired] = useState(false);
  const multipleId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { allowMultiple, options: options.map((o) => o.value) },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-[var(--qd-fg-muted)]">
          Options
        </p>
        <AnimatePresence initial={false} mode="popLayout">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={FADE}
              className="flex items-center gap-2 pb-2"
            >
              <Input
                value={option.value}
                placeholder={`Option ${index + 1}`}
                onChange={(event) =>
                  setOptions((current) =>
                    current.map((item) =>
                      item.id === option.id
                        ? { ...item, value: event.target.value }
                        : item,
                    ),
                  )
                }
                className={inputClass}
              />
              <button
                type="button"
                aria-label={`Remove option ${index + 1}`}
                disabled={options.length <= 1}
                onClick={() =>
                  setOptions((current) =>
                    current.filter((item) => item.id !== option.id),
                  )
                }
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-40",
                  "text-[var(--qd-fg-muted)] hover:bg-[var(--qd-subtle)] hover:text-[var(--qd-fg)]",
                  FOCUS,
                )}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={ICON_STROKE_SMALL}
                />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() =>
            setOptions((current) => [
              ...current,
              { id: `option-${Date.now()}`, value: "" },
            ])
          }
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium transition-colors",
            "text-[var(--qd-fg-muted)] hover:bg-[var(--qd-subtle)] hover:text-[var(--qd-fg)]",
            FOCUS,
          )}
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={16}
            strokeWidth={ICON_STROKE_SMALL}
          />
          Add option
        </button>
      </div>

      <ToggleRow
        id={multipleId}
        label="Allow Multiple"
        description="Guests can select more than one option"
        checked={allowMultiple}
        onCheckedChange={setAllowMultiple}
      />
      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ---------------------------------------------------------------- checkbox */

export function CheckboxForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [helperText, setHelperText] = useState("");
  const [required, setRequired] = useState(false);
  const helperId = useId();
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({
          type: type.id,
          question,
          required,
          settings: { helperText },
        })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Helper Text" htmlFor={helperId}>
        <Input
          id={helperId}
          value={helperText}
          placeholder="Optional"
          onChange={(event) => setHelperText(event.target.value)}
          className={inputClass}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ social */

export function SocialForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [network, setNetwork] = useState<"any" | "linkedin" | "x">("any");
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: { network } })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <Field label="Network">
        <SegmentedControl
          name="social-network"
          value={network}
          onValueChange={setNetwork}
          options={[
            { value: "any", label: "Any" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "x", label: "X" },
          ]}
        />
      </Field>

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ----------------------------------------------------------------- website */

export function WebsiteForm({ type, onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState(type.defaultQuestion);
  const [required, setRequired] = useState(false);
  const requiredId = useId();

  return (
    <FormLayout
      onSubmit={() =>
        onSubmit({ type: type.id, question, required, settings: {} })
      }
    >
      <QuestionField value={question} onChange={setQuestion} />

      <ToggleRow
        id={requiredId}
        label="Required"
        checked={required}
        onCheckedChange={setRequired}
      />
    </FormLayout>
  );
}

/* ------------------------------------------------------------------ lookup */

export const QUESTION_FORMS: Record<
  QuestionTypeId,
  ComponentType<QuestionFormProps>
> = {
  text: TextForm,
  options: OptionsForm,
  social: SocialForm,
  company: CompanyForm,
  checkbox: CheckboxForm,
  terms: TermsForm,
  phone: PhoneForm,
  website: WebsiteForm,
};

/* ========================================================================== */
/* Dialog                                                                     */
/* ========================================================================== */

type View = "picker" | QuestionTypeId;

/** Picker is the root; every question type sits one level deeper. */
function depthOf(view: View) {
  return view === "picker" ? 0 : 1;
}

/**
 * Direction belongs to the transition, not to either screen: on any one
 * navigation both screens travel the same way. Going deeper (+1) the incoming
 * screen rises from below while the outgoing one leaves upward; coming back
 * (-1) both reverse. A same-depth swap yields 0 and crossfades without travel.
 *
 * These read `direction` from the `custom` prop, which is what lets the
 * exiting screen animate with the *current* direction instead of the one it
 * was rendered with.
 */
/**
 * Enter and exit travel are deliberately unequal: an exit should be softer than
 * the entrance that replaces it, so the eye follows the arriving screen rather
 * than the leaving one. Both are offsets from SWAP_TRAVEL rather than new base
 * values, so the shared 45px beat stays the single source of truth.
 *
 *   enter  45 + 25 = 70
 *   exit   45 - 10 = 35
 */
const ENTER_TRAVEL = SWAP_TRAVEL + 25;
const EXIT_TRAVEL = SWAP_TRAVEL - 10;

const bodyVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * ENTER_TRAVEL,
  }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -EXIT_TRAVEL,
  }),
};

/**
 * The header title travels on its own, much shorter pair. Travel should scale
 * with the thing moving: the body is a full screen, but this is a 17px label
 * in a 32px slot, and at the body's 70px it reads as a separate object flying
 * through the header rather than the heading itself changing. It keeps the
 * same softer-exit relationship, and the same duration, so the two still move
 * as one navigation.
 */
const TITLE_ENTER_TRAVEL = 14;
const TITLE_EXIT_TRAVEL = 8;

const titleVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * TITLE_ENTER_TRAVEL,
  }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -TITLE_EXIT_TRAVEL,
  }),
};

export type QuestionBuilderModalProps = {
  /** Optional trigger. Omit it and drive the dialog with `open`. */
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddQuestion?: (draft: QuestionDraft) => void;
  /** Headline and sub-headline on the picker screen. */
  title?: string;
  description?: string;
  /** Replace or reorder the type grid. Ids must stay within QuestionTypeId. */
  types?: QuestionType[];
  /** Extra classes merged onto the dialog panel. */
  className?: string;
};

export function QuestionBuilderModal({
  children,
  open,
  onOpenChange,
  onAddQuestion,
  title = "Add Question",
  description = "Ask guests custom questions when they register.",
  types = QUESTION_TYPES,
  className,
}: QuestionBuilderModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [view, setView] = useState<View>("picker");
  const [direction, setDirection] = useState(1);

  // The measured element is *inside* the animated one, so its height is always
  // the natural height of the current view and never chases its own animation.
  //
  // Default (bounding-rect) measurement is safe here only because the panel no
  // longer scales on open — see `zoom-in-100` below. A bounding rect is
  // transform-aware, so under the stock `zoom-in-95` the first reading would
  // land mid-animation at 95% and stick. The trade for keeping the zoom would
  // be `offsetSize`, which is layout-only but rounds to whole pixels, leaving
  // a sub-pixel gap for the height animation to crawl across on first open.
  const [contentRef, bounds] = useMeasure();

  const isOpen = open ?? uncontrolledOpen;
  const isPicker = view === "picker";

  // Single entry point for navigation so direction and view can never disagree.
  function navigate(next: View) {
    setDirection(Math.sign(depthOf(next) - depthOf(view)));
    setView(next);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange?.(next);
    if (open === undefined) setUncontrolledOpen(next);
    // Reset only after the close animation, so the last screen doesn't flash
    // back to the picker on the way out.
    if (!next) window.setTimeout(() => navigate("picker"), 180);
  }

  function handleSubmit(draft: QuestionDraft) {
    onAddQuestion?.(draft);
    handleOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        // The block draws its own close control in the header, so the stock
        // one is turned off rather than hidden with CSS.
        showCloseButton={false}
        className={cn(
          // zoom-in-100 overrides the base zoom-in-95: the panel's height is
          // measured with a transform-aware bounding rect, and a scaling
          // entrance would poison the first reading.
          "block gap-0 overflow-hidden border-none p-0 data-open:zoom-in-100 data-closed:zoom-out-100",
          // rounded-3xl (22px) clears the 18px tiles inside it; the base
          // rounded-xl is 10px, which read as a squarer frame around rounder
          // content. ring-0 cancels the base ring-1 — the 1px edge is now the
          // first layer of --qd-shadow, so elevation is one transparent stack
          // rather than a solid ring plus a separate drop shadow.
          "rounded-3xl ring-0",
          "bg-[var(--qd-surface)] shadow-[var(--qd-shadow)]",
          "sm:max-w-[min(700px,calc(100%-2rem))]",
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <MotionConfig reducedMotion="user">
          <motion.div
            initial={false}
            animate={{
              height: bounds.height || "auto",
              transition: {
                duration: SWAP_DURATION,
                ease: EASE_OUT,
              },
            }}
          >
            <div ref={contentRef}>
              {/* ---- persistent chrome: lives outside AnimatePresence so the
                   corner element can morph rather than crossfade ---- */}
              <header className="relative flex items-start justify-between px-7 pt-7">
                <motion.button
                  layoutId="qd-corner"
                  transition={SPRING}
                  type="button"
                  // Disabled rather than aria-hidden: on the picker it is just
                  // a badge, and a hidden-but-focusable control fails a11y.
                  disabled={isPicker}
                  aria-label="Back to question types"
                  onClick={() => navigate("picker")}
                  // Radius lives in `style`, not a Tailwind class, so layout
                  // projection can scale-correct it per corner. Set via CSS it
                  // is invisible to Motion and gets stretched with the box.
                  style={{ borderRadius: isPicker ? 22 : 16 }}
                  className={cn(
                    "z-10 flex shrink-0 items-center justify-center outline-none",
                    "bg-[var(--qd-subtle)] text-[var(--qd-fg-muted)]",
                    isPicker
                      ? "size-16 cursor-default"
                      : "size-8 transition-colors hover:bg-[var(--qd-subtle-hover)] hover:text-[var(--qd-fg)]",
                  )}
                >
                  {/* `layout` here counter-scales the glyph while the box morphs. */}
                  <motion.span
                    layout
                    transition={SPRING}
                    className="flex items-center justify-center"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={isPicker ? "add" : "back"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // Motion's tween default is easeInOut — a slow start on
                        // something entering. Named curve, same as everywhere.
                        transition={{ duration: 0.12, ease: EASE_OUT }}
                        className="flex"
                      >
                        <HugeiconsIcon
                          icon={isPicker ? HelpSquareIcon : ArrowLeft01Icon}
                          size={isPicker ? 32 : 18}
                          strokeWidth={
                            isPicker ? ICON_STROKE_LARGE : ICON_STROKE_SMALL
                          }
                        />
                      </motion.span>
                    </AnimatePresence>
                  </motion.span>
                </motion.button>

                {/* Same variants as the body, so the two titles — the picker's
                    headline and this one — travel with identical physics. */}
                <AnimatePresence initial={false} custom={direction}>
                  {!isPicker && (
                    <motion.span
                      key="step-title"
                      custom={direction}
                      variants={titleVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ ...FADE, duration: SWAP_DURATION }}
                      className="pointer-events-none absolute inset-x-20 top-7 flex h-8 items-center justify-center text-[17px] font-semibold text-[var(--qd-fg)]"
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    // This style's `ghost` variant paints a gradient image plus
                    // a shadow. Those sit in different tailwind-merge groups to
                    // the flat token background wanted here, so both would
                    // render at once — they are cleared explicitly rather than
                    // by editing components/ui/button.tsx.
                    className={cn(
                      // Arbitrary *properties* rather than `bg-[image:none]`,
                      // so tailwind-merge never has to choose between them and
                      // the flat token background below.
                      "z-10 rounded-full [background-image:none] [box-shadow:none]",
                      "bg-[var(--qd-subtle)] text-[var(--qd-fg-muted)] hover:bg-[var(--qd-subtle-hover)] hover:text-[var(--qd-fg)]",
                      FOCUS,
                    )}
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={16}
                      strokeWidth={ICON_STROKE_SMALL}
                    />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </header>

              {/* ---- swapping body ---- */}
              {/* `custom` on AnimatePresence is what reaches the exiting child. */}
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={direction}
              >
                <motion.div
                  custom={direction}
                  variants={bodyVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  key={view}
                  transition={{ ...FADE, duration: SWAP_DURATION }}
                >
                  {isPicker ? (
                    <Section className="pt-4 pb-7">
                      <h2 className="text-[26px] leading-tight font-bold tracking-tight text-[var(--qd-fg)]">
                        {title}
                      </h2>
                      <p className="mt-1 text-[15px] text-[var(--qd-fg-muted)]">
                        {description}
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {types.map((type) => (
                          <TypeTile
                            key={type.id}
                            type={type}
                            onSelect={() => navigate(type.id)}
                          />
                        ))}
                      </div>
                    </Section>
                  ) : (
                    <StepView
                      typeId={view}
                      types={types}
                      onSubmit={handleSubmit}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      </DialogContent>
    </Dialog>
  );
}

/** Everything below the header for a single question type. */
function StepView({
  typeId,
  types,
  onSubmit,
}: {
  typeId: QuestionTypeId;
  types: QuestionType[];
  onSubmit: (draft: QuestionDraft) => void;
}) {
  const type = getQuestionType(typeId, types);
  const Form = QUESTION_FORMS[typeId];

  return (
    <>
      <Section className="pt-4 pb-4">
        <TypeSummary type={type} />
      </Section>
      <Divider />
      <Form type={type} onSubmit={onSubmit} />
    </>
  );
}

export default QuestionBuilderModal;
