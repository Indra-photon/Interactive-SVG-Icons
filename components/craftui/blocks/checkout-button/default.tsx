"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import useMeasure from "react-use-measure";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  QrCodeIcon,
  CreditCardIcon,
  Apple01Icon,
  AmazonIcon,
  Cancel01Icon,
  SquareLock01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Add01Icon,
  Wallet01Icon,
  MoreHorizontalIcon,
  CircleIcon,
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HugeIcon = typeof QrCodeIcon;

export type MethodId = "qr" | "card" | "apple" | "amazon";
type Step = MethodId | "connect-wallet";
type Transition = Record<string, unknown>;

export interface PaymentMethod {
  id: MethodId;
  /** Full name, used as the tab's accessible name. */
  label: string;
  /** Short form shown under the icon. Falls back to `label`. */
  shortLabel?: string;
  icon: HugeIcon;
}

export interface Wallet {
  id: string;
  name: string;
  emoji?: string;
  bg: string;
  badge?: string;
  icon?: HugeIcon;
}

export interface CheckoutButtonProps {
  /** Initial amount. Selected on open if it matches one of `amounts`. */
  amount?: string;
  /** Preset amounts. Pass `[]` with `allowCustomAmount={false}` for a fixed amount. */
  amounts?: string[];
  allowCustomAmount?: boolean;
  currencySymbol?: string;
  title?: string;
  subtitle?: string;
  triggerLabel?: string;
  triggerIcon?: HugeIcon;
  methods?: PaymentMethod[];
  wallets?: Wallet[];
  qrSrc?: string;
  applyCardLast4?: string;
  amazonAccount?: string;
  amazonBalance?: string;
  onPay?: (method: MethodId, amount: string) => void;
  onConnectWallet?: (walletId: string) => void;
  onCreateWallet?: () => void;
  className?: string;
}

const DEFAULT_METHODS: PaymentMethod[] = [
  { id: "card", label: "Card", icon: CreditCardIcon },
  { id: "qr", label: "QR code", shortLabel: "QR", icon: QrCodeIcon },
  { id: "apple", label: "Apple Pay", shortLabel: "Apple", icon: Apple01Icon },
  { id: "amazon", label: "Amazon Pay", shortLabel: "Amazon", icon: AmazonIcon },
];

const DEFAULT_AMOUNTS = ["$3", "$5", "$10"];

const DEFAULT_WALLETS: Wallet[] = [
  { id: "metamask", name: "MetaMask", emoji: "🦊", bg: "#ffffff" },
  // Base's own brand blue, not pure #0000ff — and a mark, so it isn't the one
  // row in five that renders an empty tile.
  { id: "base", name: "Base", bg: "#0052ff", icon: CircleIcon },
  { id: "phantom", name: "Phantom", emoji: "👻", bg: "#ab9ff2" },
  { id: "rainbow", name: "Rainbow", emoji: "🌈", bg: "#174299" },
  {
    id: "other",
    name: "Other Wallets",
    bg: "#000000",
    badge: "350+",
    icon: MoreHorizontalIcon,
  },
];

const SHELL_ID = "checkout-button-shell";
const INITIAL_METHOD: MethodId = "card";
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

const EXPAND_SPRING = { type: "spring", duration: 0.3, bounce: 0.16 } as const;
const COLLAPSE_SPRING = { type: "spring", duration: 0.25, bounce: 0 } as const;

const FADE_IN = { duration: 0.18, ease: EASE_OUT } as const;
const FADE_IN_FIRST = { duration: 0.3, ease: EASE_OUT } as const;
const FADE_OUT = { duration: 0.12, ease: EASE_OUT } as const;
const MORPH = { type: "spring", bounce: 0, duration: 0.18 } as const;
const INSTANT = { duration: 0 } as const;

const CONTENT_IN = FADE_IN;
const CONTENT_OUT = FADE_OUT;

const STEP_INITIAL = { opacity: 0, filter: "blur(6px)" } as const;
const STEP_ANIMATE = {
  opacity: 1,
  filter: "blur(0px)",
  transition: FADE_IN_FIRST,
} as const;
const STEP_EXIT = {
  opacity: 0,
  filter: "blur(6px)",
  transition: COLLAPSE_SPRING,
} as const;

/**
 * Under reduced motion the blur and scale are dropped and only the opacity
 * crossfade survives — blur/scale are the vestibular triggers, the crossfade
 * is the part that carries meaning.
 */
function stepVariants(reduceMotion: boolean) {
  if (!reduceMotion) {
    return { initial: STEP_INITIAL, animate: STEP_ANIMATE, exit: STEP_EXIT };
  }
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };
}

/**
 * The shell's ring, inline rather than in a class: Motion only scale-corrects
 * `borderRadius` and `boxShadow`, and only when it can read them off `style`.
 * The offsets stay literal so the correction can parse them each frame; only
 * the colors come from tokens, which keeps it theme-aware.
 */
const SHELL_SHADOW =
  "0px 0px 0px 1px var(--card-ring), 0px 1px 2px -1px var(--card-ring), 0px 2px 4px 0px var(--card-ring-ambient)";

/** Theme-aware focus ring, flush on the border edge (no offset). */
const FOCUS_RING =
  "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Dialog behaviour the platform gives you for free with <dialog>, rebuilt here
 * because the shell has to stay in the flow for the shared-element morph:
 * Escape to close, `inert` on the background, focus moved into the panel on
 * open, and focus returned to the trigger once it remounts on close.
 */
function useDialogBehavior(isOpen: boolean, onClose: () => void) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const shouldRestoreFocus = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    const root = rootRef.current;
    if (!root) return;

    // Inert every sibling on the way up to <body>, not just the top-level ones:
    // the app usually renders this block deep inside a single root div, so
    // skipping any ancestor that contains us would leave the whole page live.
    const inerted: HTMLElement[] = [];
    let node: HTMLElement | null = root;
    while (node && node !== document.body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sibling of Array.from(parent.children)) {
        if (sibling === node || !(sibling instanceof HTMLElement)) continue;
        if (sibling.hasAttribute("inert")) continue;
        sibling.setAttribute("inert", "");
        inerted.push(sibling);
      }
      node = parent;
    }

    shouldRestoreFocus.current = true;
    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      for (const node of inerted) node.removeAttribute("inert");
    };
  }, [isOpen]);

  // The trigger unmounts while the panel is open, so focus is restored from a
  // callback ref the moment it comes back rather than from a stored node.
  const triggerRef = React.useCallback((node: HTMLButtonElement | null) => {
    if (!node || !shouldRestoreFocus.current) return;
    shouldRestoreFocus.current = false;
    node.focus();
  }, []);

  return { rootRef, panelRef, triggerRef };
}

function Field({
  label,
  placeholder,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  autoComplete: string;
}) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>
      <Input
        id={id}
        name={autoComplete}
        type="text"
        inputMode="numeric"
        autoComplete={autoComplete}
        spellCheck={false}
        placeholder={placeholder}
        className="h-10 rounded-lg border-border bg-muted px-3 text-foreground placeholder:text-muted-foreground/70"
      />
    </div>
  );
}

const AMOUNT_CHIP =
  "flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] peer-hover:bg-accent peer-hover:text-foreground peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-[var(--input-shadow-hover)] peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50";

/**
 * Native radios rather than a custom radiogroup: the platform already gives one
 * Tab stop, arrow-key navigation and the checked state for free. The inputs are
 * `sr-only` (still focusable) and the visible chip is styled off `peer-checked`.
 */
function AmountChooser({
  amounts,
  allowCustom,
  currencySymbol,
  mode,
  preset,
  custom,
  invalid,
  groupName,
  errorId,
  customRef,
  onPreset,
  onCustomMode,
  onCustomChange,
}: {
  amounts: string[];
  allowCustom: boolean;
  currencySymbol: string;
  mode: "preset" | "custom";
  preset: string;
  custom: string;
  invalid: boolean;
  groupName: string;
  errorId: string;
  customRef: React.RefObject<HTMLInputElement | null>;
  onPreset: (amount: string) => void;
  onCustomMode: () => void;
  onCustomChange: (value: string) => void;
}) {
  return (
    <fieldset className="px-1">
      <legend className="sr-only">Choose an amount</legend>
      <div className="flex gap-2">
        {amounts.map((a) => (
          <label key={a} className="flex-1">
            <input
              type="radio"
              name={groupName}
              value={a}
              checked={mode === "preset" && preset === a}
              onChange={() => onPreset(a)}
              className="peer sr-only"
            />
            <span className={AMOUNT_CHIP}>{a}</span>
          </label>
        ))}
        {allowCustom && (
          <label className="flex-1">
            <input
              type="radio"
              name={groupName}
              value="custom"
              checked={mode === "custom"}
              onChange={onCustomMode}
              className="peer sr-only"
            />
            <span className={AMOUNT_CHIP}>Custom</span>
          </label>
        )}
      </div>

      {mode === "custom" && (
        <div className="mt-2">
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
            >
              {currencySymbol}
            </span>
            <Input
              ref={customRef}
              aria-label="Custom amount"
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? errorId : undefined}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={custom}
              onChange={(event) => onCustomChange(event.target.value)}
              placeholder="0.00"
              className="h-10 rounded-lg border-border bg-muted pl-7 text-foreground placeholder:text-muted-foreground/70"
            />
          </div>
          {invalid && (
            <p id={errorId} className="mt-1.5 text-xs text-destructive">
              Enter an amount greater than 0.
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}

function IconButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: HugeIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        // The circle stays 32px; the ::after pseudo-element carries the 44px target.
        "relative flex size-8 touch-manipulation items-center justify-center rounded-full text-muted-foreground shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 hover:bg-accent hover:text-foreground hover:shadow-[var(--input-shadow-hover)]",
        FOCUS_RING,
      )}
    >
      <HugeiconsIcon
        icon={icon}
        size={16}
        aria-hidden="true"
        focusable="false"
      />
    </button>
  );
}

function MethodTabs({
  methods,
  current,
  onSelect,
  tabId,
  panelId,
}: {
  methods: PaymentMethod[];
  current: MethodId;
  onSelect: (m: MethodId) => void;
  tabId: (m: MethodId) => string;
  panelId: string;
}) {
  const tabRefs = React.useRef<Partial<Record<MethodId, HTMLButtonElement>>>(
    {},
  );

  // Roving tabindex: the tablist is one Tab stop, arrows move within it.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = methods.findIndex((m) => m.id === current);
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % methods.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + methods.length) % methods.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = methods.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const id = methods[next].id;
    onSelect(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Payment method"
      onKeyDown={onKeyDown}
      // px-1 to share a left edge with the fields and buttons below.
      className="flex gap-2 px-1"
    >
      {methods.map((m) => {
        const selected = m.id === current;
        return (
          <button
            key={m.id}
            ref={(node) => {
              if (node) tabRefs.current[m.id] = node;
              else delete tabRefs.current[m.id];
            }}
            type="button"
            role="tab"
            id={tabId(m.id)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(m.id)}
            // Full name as the accessible name; the shorter visible label is a
            // substring of it, so voice control still matches what's on screen.
            aria-label={m.label}
            className={cn(
              "flex h-14 flex-1 touch-manipulation flex-col items-center justify-center gap-1 rounded-xl transition-[color,background-color,box-shadow]",
              selected
                ? "bg-background text-foreground shadow-[var(--input-shadow-hover)]"
                : "bg-muted text-muted-foreground shadow-[var(--input-shadow)] hover:bg-accent hover:text-foreground hover:shadow-[var(--input-shadow-hover)]",
              FOCUS_RING,
            )}
          >
            <HugeiconsIcon
              icon={m.icon}
              size={18}
              aria-hidden="true"
              focusable="false"
            />
            <span className="text-xs leading-none font-medium">
              {m.shortLabel ?? m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PayButton({ label, morph }: { label: string; morph: Transition }) {
  return (
    <div className="mt-4 px-1">
      <motion.button
        layoutId="pay-action"
        type="submit"
        transition={morph}
        style={{ borderRadius: 12 }}
        className={cn(
          "flex h-11 w-full touch-manipulation items-center justify-center gap-2 bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          FOCUS_RING,
        )}
      >
        <HugeiconsIcon
          icon={SquareLock01Icon}
          size={15}
          aria-hidden="true"
          focusable="false"
        />
        {label}
      </motion.button>
    </div>
  );
}

function ConnectWalletCta({
  onConnect,
  morph,
}: {
  onConnect: () => void;
  morph: Transition;
}) {
  return (
    <div className="mt-4 px-1">
      <motion.div
        layout="position"
        transition={morph}
        aria-hidden="true"
        className="flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">OR</span>
        <span className="h-px flex-1 bg-border" />
      </motion.div>
      <motion.button
        layoutId="wallet-action"
        type="button"
        onClick={onConnect}
        transition={morph}
        style={{ borderRadius: 12 }}
        className={cn(
          "mt-4 flex h-11 w-full touch-manipulation items-center justify-center gap-2 bg-muted text-sm font-semibold text-foreground shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:shadow-[var(--input-shadow-hover)]",
          FOCUS_RING,
        )}
      >
        <HugeiconsIcon
          icon={Wallet01Icon}
          size={16}
          aria-hidden="true"
          focusable="false"
        />
        Connect Wallet
      </motion.button>
    </div>
  );
}

function QrPanel({ qrSrc }: { qrSrc: string }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center gap-4">
      <div className="rounded-2xl bg-white p-3">
        <Image
          src={qrSrc}
          alt="Payment QR code"
          width={168}
          height={168}
          className="h-auto max-w-full rounded-lg"
          unoptimized
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Scan with any payments app to continue
      </p>
    </div>
  );
}

function CardPanel() {
  return (
    <div className="flex min-h-[160px] flex-col justify-center gap-3.5 px-1">
      <Field
        label="Card number"
        placeholder="1234 5678 9012 3456"
        autoComplete="cc-number"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry" placeholder="MM / YY" autoComplete="cc-exp" />
        <Field label="CVC" placeholder="123" autoComplete="cc-csc" />
      </div>
    </div>
  );
}

function ApplePanel({ cardLast4 }: { cardLast4: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-[var(--input-shadow)]">
        <HugeiconsIcon
          icon={Apple01Icon}
          size={30}
          aria-hidden="true"
          focusable="false"
          className="text-foreground"
        />
      </div>
      <div className="w-full rounded-xl bg-muted px-3.5 py-3 shadow-[var(--input-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Apple Card</span>
          <span className="text-sm font-medium text-foreground">
            <span className="sr-only">ending in </span>
            <span aria-hidden="true">•••• </span>
            {cardLast4}
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Double-click the side button to confirm.
      </p>
    </div>
  );
}

function AmazonPanel({
  account,
  balance,
}: {
  account: string;
  balance: string;
}) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-[var(--input-shadow)]">
        <HugeiconsIcon
          icon={AmazonIcon}
          size={30}
          aria-hidden="true"
          focusable="false"
          className="text-foreground"
        />
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-muted px-3.5 py-2.5 shadow-[var(--input-shadow)]">
          <span className="text-sm text-muted-foreground">Account</span>
          <span className="text-sm font-medium text-foreground">{account}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted px-3.5 py-2.5 shadow-[var(--input-shadow)]">
          <span className="text-sm text-muted-foreground">
            Gift card balance
          </span>
          <span className="text-sm font-medium text-foreground">{balance}</span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Charged to your Amazon account.
      </p>
    </div>
  );
}

function MethodPanel({
  method,
  qrSrc,
  applyCardLast4,
  amazonAccount,
  amazonBalance,
}: {
  method: MethodId;
  qrSrc: string;
  applyCardLast4: string;
  amazonAccount: string;
  amazonBalance: string;
}) {
  switch (method) {
    case "qr":
      return <QrPanel qrSrc={qrSrc} />;
    case "card":
      return <CardPanel />;
    case "apple":
      return <ApplePanel cardLast4={applyCardLast4} />;
    case "amazon":
      return <AmazonPanel account={amazonAccount} balance={amazonBalance} />;
    default:
      return null;
  }
}

type PaymentScreenProps = {
  method: MethodId;
  amount: string;
  title: string;
  subtitle?: string;
  methods: PaymentMethod[];
  qrSrc: string;
  applyCardLast4: string;
  amazonAccount: string;
  amazonBalance: string;
  titleId: string;
  tabId: (m: MethodId) => string;
  panelId: string;
  morph: Transition;
  reduceMotion: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  amountChooser: React.ComponentProps<typeof AmountChooser> | null;
  onSelect: (m: MethodId) => void;
  onPay: () => void;
  onConnect: () => void;
  onClose: () => void;
};

function PaymentScreen({
  method,
  amount,
  title,
  subtitle,
  methods,
  qrSrc,
  applyCardLast4,
  amazonAccount,
  amazonBalance,
  titleId,
  tabId,
  panelId,
  morph,
  reduceMotion,
  headingRef,
  amountChooser,
  onSelect,
  onPay,
  onConnect,
  onClose,
}: PaymentScreenProps) {
  const label = method === "qr" ? `Pay ${amount} manually` : `Pay ${amount}`;
  const variants = stepVariants(reduceMotion);

  return (
    <>
      <div className="mb-5 flex items-center justify-between px-1 py-1">
        <div>
          {/* The amount leads: it's what the user is deciding about. Both lines
              stay inside the h2 so the dialog's accessible name is still
              "$5.00 Buy me a coffee" rather than a bare number. */}
          <h2
            id={titleId}
            ref={headingRef}
            tabIndex={-1}
            className="outline-none"
          >
            <span className="block text-2xl font-semibold tracking-tight text-foreground">
              {amount}
            </span>
            <span className="mt-0.5 block text-sm font-normal text-muted-foreground">
              {title}
            </span>
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <IconButton onClick={onClose} label="Close" icon={Cancel01Icon} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onPay();
        }}
      >
        {amountChooser && <AmountChooser {...amountChooser} />}

        <div className={cn("flex flex-col", amountChooser && "mt-4")}>
          <MethodTabs
            methods={methods}
            current={method}
            onSelect={onSelect}
            tabId={tabId}
            panelId={panelId}
          />
          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId(method)}
            // APG: a tabpanel is only a tab stop when it holds nothing
            // focusable. The card panel has inputs, so it opts out.
            tabIndex={method === "card" ? -1 : 0}
            className={cn("relative mt-4 rounded-xl", FOCUS_RING)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={method}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
              >
                <MethodPanel
                  method={method}
                  qrSrc={qrSrc}
                  applyCardLast4={applyCardLast4}
                  amazonAccount={amazonAccount}
                  amazonBalance={amazonBalance}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <PayButton label={label} morph={morph} />
      </form>

      <ConnectWalletCta onConnect={onConnect} morph={morph} />
    </>
  );
}

function ConnectWalletScreen({
  wallets,
  titleId,
  morph,
  headingRef,
  onBack,
  onClose,
  onConnect,
  onCreate,
}: {
  wallets: Wallet[];
  titleId: string;
  morph: Transition;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClose: () => void;
  onConnect: (walletId: string) => void;
  onCreate: () => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between px-1 py-1">
        <IconButton onClick={onBack} label="Back" icon={ArrowLeft01Icon} />
        <h2
          id={titleId}
          ref={headingRef}
          tabIndex={-1}
          className="text-base font-semibold text-foreground outline-none"
        >
          Connect Wallet
        </h2>
        <IconButton onClick={onClose} label="Close" icon={Cancel01Icon} />
      </div>

      <div className="flex flex-col gap-2">
        {wallets.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onConnect(w.id)}
            className={cn(
              "flex touch-manipulation items-center gap-3 rounded-xl bg-muted px-3 py-2.5 text-left shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:shadow-[var(--input-shadow-hover)]",
              FOCUS_RING,
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg text-base leading-none"
              style={{ background: w.bg }}
            >
              {w.icon ? (
                <HugeiconsIcon
                  icon={w.icon}
                  size={18}
                  focusable="false"
                  className="text-white"
                />
              ) : (
                w.emoji
              )}
            </span>
            <span className="flex-1 text-sm font-semibold text-foreground">
              {w.name}
            </span>
            {w.badge && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {w.badge}
              </span>
            )}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              aria-hidden="true"
              focusable="false"
              className="text-muted-foreground"
            />
          </button>
        ))}
      </div>

      <motion.button
        layoutId="wallet-action"
        type="button"
        onClick={onCreate}
        transition={morph}
        style={{ borderRadius: 12 }}
        className={cn(
          "mt-4 flex h-11 w-full touch-manipulation items-center justify-center gap-2 bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          FOCUS_RING,
        )}
      >
        <HugeiconsIcon
          icon={Add01Icon}
          size={16}
          aria-hidden="true"
          focusable="false"
        />
        Create a New Wallet
      </motion.button>
    </>
  );
}

function CheckoutButton({
  amount = "$5",
  amounts = DEFAULT_AMOUNTS,
  allowCustomAmount = true,
  currencySymbol = "$",
  title = "Buy me a coffee",
  subtitle,
  triggerLabel = "Buy me a coffee",
  triggerIcon = CreditCardIcon,
  methods = DEFAULT_METHODS,
  wallets = DEFAULT_WALLETS,
  qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://buymeacoffee.com&bgcolor=ffffff&color=000000&margin=0",
  applyCardLast4 = "4242",
  amazonAccount = "indra@acme.com",
  amazonBalance = "$12.40",
  onPay,
  onConnectWallet,
  onCreateWallet,
  className,
}: CheckoutButtonProps) {
  const initialMethod =
    methods.find((m) => m.id === INITIAL_METHOD)?.id ?? methods[0]?.id ?? "qr";

  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(initialMethod);
  const [status, setStatus] = React.useState("");
  const [bodyRef, { height }] = useMeasure({ offsetSize: true });
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);
  const [opened, setOpened] = React.useState(false);
  const prevPayStep = React.useRef<MethodId>(initialMethod);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const customAmountRef = React.useRef<HTMLInputElement>(null);

  const showChooser = amounts.length > 0 || allowCustomAmount;
  const [amountMode, setAmountMode] = React.useState<"preset" | "custom">(
    "preset",
  );
  const [presetAmount, setPresetAmount] = React.useState(
    () => amounts.find((a) => a === amount) ?? amounts[0] ?? amount,
  );
  const [customAmount, setCustomAmount] = React.useState("");
  const [amountInvalid, setAmountInvalid] = React.useState(false);

  const uid = React.useId();
  const payTitleId = `${uid}-pay-title`;
  const walletTitleId = `${uid}-wallet-title`;
  const panelId = `${uid}-method-panel`;
  const amountGroupName = `${uid}-amount`;
  const amountErrorId = `${uid}-amount-error`;
  const tabId = React.useCallback((m: MethodId) => `${uid}-tab-${m}`, [uid]);

  const isWalletScreen = step === "connect-wallet";

  const activeAmount = !showChooser
    ? amount
    : amountMode === "custom"
      ? `${currencySymbol}${customAmount.trim() || "0"}`
      : presetAmount;

  const close = React.useCallback(() => {
    setIsOpen(false);
    setOpened(false);
    setStatus("");
    setAmountInvalid(false);
    window.setTimeout(() => setStep(initialMethod), reduceMotion ? 0 : 300);
  }, [initialMethod, reduceMotion]);

  const { rootRef, panelRef, triggerRef } = useDialogBehavior(isOpen, close);

  const shellTransition = reduceMotion
    ? INSTANT
    : isOpen
      ? EXPAND_SPRING
      : COLLAPSE_SPRING;
  const contentIn = reduceMotion ? INSTANT : CONTENT_IN;
  const contentOut = reduceMotion ? INSTANT : CONTENT_OUT;
  const morph = reduceMotion ? INSTANT : MORPH;
  const variants = stepVariants(reduceMotion);

  // Swapping the whole dialog body is a context change, so focus follows it.
  // Keyed on the screen, not the step, so switching payment tabs never steals
  // focus back from the tablist.
  const isFirstScreen = React.useRef(true);
  React.useEffect(() => {
    if (!isOpen) {
      isFirstScreen.current = true;
      return;
    }
    if (isFirstScreen.current) {
      isFirstScreen.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [isOpen, isWalletScreen]);

  const selectMethod = (m: MethodId) => setStep(m);
  const goToWallet = () => {
    if (step !== "connect-wallet") prevPayStep.current = step;
    setStep("connect-wallet");
  };
  const goBack = () => setStep(prevPayStep.current);

  const selectPreset = (value: string) => {
    setAmountMode("preset");
    setPresetAmount(value);
    setAmountInvalid(false);
  };

  // No auto-focus into the input here: it would yank focus mid-arrow-key while
  // the user is still moving through the radio group.
  const selectCustom = () => {
    setAmountMode("custom");
    setAmountInvalid(false);
  };

  const handlePay = () => {
    if (showChooser && amountMode === "custom") {
      const parsed = Number(customAmount.trim());
      if (!customAmount.trim() || !Number.isFinite(parsed) || parsed <= 0) {
        setAmountInvalid(true);
        customAmountRef.current?.focus();
        return;
      }
    }
    setAmountInvalid(false);
    if (step !== "connect-wallet") onPay?.(step, activeAmount);
    close();
  };

  const handleConnect = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId);
    setStatus(`Connecting to ${wallet?.name ?? "wallet"}…`);
    onConnectWallet?.(walletId);
  };

  const handleCreate = () => {
    setStatus("Creating a new wallet…");
    onCreateWallet?.();
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex min-h-screen items-center justify-center px-4",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {!isOpen && (
          <motion.button
            key="collapsed"
            ref={triggerRef}
            type="button"
            layoutId={SHELL_ID}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={() => setIsOpen(true)}
            transition={shellTransition}
            style={{ borderRadius: 10 }}
            className={cn(
              "flex h-9 touch-manipulation items-center gap-2 overflow-hidden bg-card px-3 text-sm font-medium text-foreground select-none",
              FOCUS_RING,
            )}
          >
            <motion.span
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)", transition: contentOut }}
              transition={contentIn}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <HugeiconsIcon
                icon={triggerIcon}
                size={16}
                aria-hidden="true"
                focusable="false"
              />
              <span>{triggerLabel}</span>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            key="expanded"
            ref={panelRef}
            layoutId={SHELL_ID}
            role="dialog"
            aria-modal="true"
            aria-labelledby={isWalletScreen ? walletTitleId : payTitleId}
            tabIndex={-1}
            transition={shellTransition}
            onLayoutAnimationComplete={() => setOpened(true)}
            style={{ borderRadius: 20 }}
            // A fixed length, not a percentage: `w-full` made the width a
            // percentage of the flex parent, which Motion re-measures during
            // the layout animation and ends up animating. min() keeps it a
            // single resolved value per viewport, so only height animates,
            // while still reflowing below 340px.
            // Only p-2 here: the scroll container below clips on both axes, so
            // the remaining padding has to sit *inside* it or focus rings on
            // edge-adjacent controls get sliced. p-2 + inner p-3 = the original 20px.
            className="w-[min(340px,calc(100vw-2rem))] overflow-hidden overscroll-contain bg-card p-2 outline-none"
          >
            {/* Rendered empty on open so later injections actually announce. */}
            <div role="status" className="sr-only">
              {status}
            </div>

            <motion.div
              layout="position"
              initial={{ opacity: 0, filter: "blur(6px)", scale: 0.98 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{
                opacity: 0,
                filter: "blur(6px)",
                scale: 0.98,
                transition: contentOut,
              }}
              transition={contentIn}
            >
              <motion.div
                animate={{
                  height: reduceMotion || !opened ? "auto" : height || "auto",
                }}
                transition={morph}
                className="max-h-[70dvh] overflow-y-auto overscroll-contain"
              >
                <div ref={bodyRef} className="relative p-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={isWalletScreen ? "wallet" : "pay"}
                      initial={variants.initial}
                      animate={variants.animate}
                      exit={variants.exit}
                      className="w-full"
                    >
                      {isWalletScreen ? (
                        <ConnectWalletScreen
                          wallets={wallets}
                          titleId={walletTitleId}
                          morph={morph}
                          headingRef={headingRef}
                          onBack={goBack}
                          onClose={close}
                          onConnect={handleConnect}
                          onCreate={handleCreate}
                        />
                      ) : (
                        <PaymentScreen
                          method={step}
                          amount={activeAmount}
                          title={title}
                          subtitle={subtitle}
                          methods={methods}
                          qrSrc={qrSrc}
                          applyCardLast4={applyCardLast4}
                          amazonAccount={amazonAccount}
                          amazonBalance={amazonBalance}
                          titleId={payTitleId}
                          tabId={tabId}
                          panelId={panelId}
                          morph={morph}
                          reduceMotion={reduceMotion}
                          headingRef={headingRef}
                          amountChooser={
                            showChooser
                              ? {
                                  amounts,
                                  allowCustom: allowCustomAmount,
                                  currencySymbol,
                                  mode: amountMode,
                                  preset: presetAmount,
                                  custom: customAmount,
                                  invalid: amountInvalid,
                                  groupName: amountGroupName,
                                  errorId: amountErrorId,
                                  customRef: customAmountRef,
                                  onPreset: selectPreset,
                                  onCustomMode: selectCustom,
                                  onCustomChange: setCustomAmount,
                                }
                              : null
                          }
                          onSelect={selectMethod}
                          onPay={handlePay}
                          onConnect={goToWallet}
                          onClose={close}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CheckoutButton;
