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
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type HugeIcon = typeof QrCodeIcon;

export type MethodId = "qr" | "card" | "apple" | "amazon";
type Step = MethodId | "connect-wallet";

export interface PaymentMethod {
  id: MethodId;
  label: string;
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
  amount?: string;
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
  onPay?: (method: MethodId) => void;
  onConnectWallet?: (walletId: string) => void;
  onCreateWallet?: () => void;
  className?: string;
}

const DEFAULT_METHODS: PaymentMethod[] = [
  { id: "card", label: "Card", icon: CreditCardIcon },
  { id: "qr", label: "QR code", icon: QrCodeIcon },
  { id: "apple", label: "Apple Pay", icon: Apple01Icon },
  { id: "amazon", label: "Amazon Pay", icon: AmazonIcon },
];

const DEFAULT_WALLETS: Wallet[] = [
  { id: "metamask", name: "MetaMask", emoji: "🦊", bg: "#ffffff" },
  { id: "base", name: "Base", bg: "#0000ff" },
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

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="h-10 rounded-lg border border-border bg-muted px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/70 focus:border-primary"
      />
    </label>
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
      onClick={onClick}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full text-muted-foreground shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:text-foreground hover:shadow-[var(--input-shadow-hover)]"
    >
      <HugeiconsIcon icon={icon} size={16} />
    </button>
  );
}

function MethodTabs({
  methods,
  current,
  onSelect,
}: {
  methods: PaymentMethod[];
  current: MethodId;
  onSelect: (m: MethodId) => void;
}) {
  return (
    <div className="flex gap-2 px-[2px]">
      {methods.map((m) => {
        const selected = m.id === current;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            aria-label={m.label}
            aria-pressed={selected}
            className="relative flex h-12 flex-1 items-center justify-center rounded-xl bg-muted shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:shadow-[var(--input-shadow-hover)]"
          >
            {selected && (
              <motion.div
                layoutId="method-highlight"
                transition={MORPH}
                className="absolute inset-0 rounded-xl"
              />
            )}
            <HugeiconsIcon
              icon={m.icon}
              size={20}
              className={
                selected
                  ? "relative text-foreground"
                  : "relative text-muted-foreground"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

function PayButton({ label, onPay }: { label: string; onPay: () => void }) {
  return (
    <div className="mt-4 px-1">
      <motion.button
        layoutId="pay-action"
        onClick={onPay}
        transition={MORPH}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <HugeiconsIcon icon={SquareLock01Icon} size={15} />
        {label}
      </motion.button>
    </div>
  );
}

function ConnectWalletCta({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="mt-4 px-1">
      <motion.div
        layout="position"
        transition={MORPH}
        className="flex items-center gap-3"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">OR</span>
        <span className="h-px flex-1 bg-border" />
      </motion.div>
      <motion.button
        layoutId="wallet-action"
        onClick={onConnect}
        transition={MORPH}
        style={{ borderRadius: 12 }}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-secondary text-sm font-semibold text-foreground shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:shadow-[var(--input-shadow-hover)]"
      >
        <HugeiconsIcon icon={Wallet01Icon} size={16} />
        Connect Wallet
      </motion.button>
    </div>
  );
}

function QrPanel({ amount, qrSrc }: { amount: string; qrSrc: string }) {
  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center gap-4">
      <div className="rounded-2xl bg-white p-3">
        <Image
          src={qrSrc}
          alt="Payment QR code"
          width={168}
          height={168}
          className="rounded-lg"
          unoptimized
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Scan with any payments app to pay {amount}
      </p>
    </div>
  );
}

function CardPanel() {
  return (
    <div className="flex min-h-[160px] flex-col justify-center gap-3.5 px-1">
      <Field label="Card number" placeholder="1234 5678 9012 3456" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry" placeholder="MM / YY" />
        <Field label="CVC" placeholder="123" />
      </div>
    </div>
  );
}

function ApplePanel({
  amount,
  cardLast4,
}: {
  amount: string;
  cardLast4: string;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-[var(--input-shadow)]">
        <HugeiconsIcon
          icon={Apple01Icon}
          size={30}
          className="text-foreground"
        />
      </div>
      <div className="w-full rounded-xl bg-muted px-3.5 py-3 shadow-[var(--input-shadow)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Apple Card</span>
          <span className="text-sm font-medium text-foreground">
            •••• {cardLast4}
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Double-click the side button to pay {amount}.
      </p>
    </div>
  );
}

function AmazonPanel({
  amount,
  account,
  balance,
}: {
  amount: string;
  account: string;
  balance: string;
}) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center gap-4">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-[var(--input-shadow)]">
        <HugeiconsIcon
          icon={AmazonIcon}
          size={30}
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
        Pay {amount} with your Amazon account.
      </p>
    </div>
  );
}

function MethodPanel({
  method,
  amount,
  qrSrc,
  applyCardLast4,
  amazonAccount,
  amazonBalance,
}: {
  method: MethodId;
  amount: string;
  qrSrc: string;
  applyCardLast4: string;
  amazonAccount: string;
  amazonBalance: string;
}) {
  switch (method) {
    case "qr":
      return <QrPanel amount={amount} qrSrc={qrSrc} />;
    case "card":
      return <CardPanel />;
    case "apple":
      return <ApplePanel amount={amount} cardLast4={applyCardLast4} />;
    case "amazon":
      return (
        <AmazonPanel
          amount={amount}
          account={amazonAccount}
          balance={amazonBalance}
        />
      );
    default:
      return null;
  }
}

type PaymentScreenProps = {
  method: MethodId;
  amount: string;
  title: string;
  subtitle: string;
  methods: PaymentMethod[];
  qrSrc: string;
  applyCardLast4: string;
  amazonAccount: string;
  amazonBalance: string;
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
  onSelect,
  onPay,
  onConnect,
  onClose,
}: PaymentScreenProps) {
  const label = method === "qr" ? `Pay ${amount} manually` : `Pay ${amount}`;
  return (
    <>
      <div className="mb-5 flex items-center justify-between px-1 py-1">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <IconButton onClick={onClose} label="Close" icon={Cancel01Icon} />
      </div>

      <div className="flex flex-col">
        <MethodTabs methods={methods} current={method} onSelect={onSelect} />
        <div className="relative mt-4">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={method}
              initial={STEP_INITIAL}
              animate={STEP_ANIMATE}
              exit={STEP_EXIT}
            >
              <MethodPanel
                method={method}
                amount={amount}
                qrSrc={qrSrc}
                applyCardLast4={applyCardLast4}
                amazonAccount={amazonAccount}
                amazonBalance={amazonBalance}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <PayButton label={label} onPay={onPay} />
      <ConnectWalletCta onConnect={onConnect} />
    </>
  );
}

function ConnectWalletScreen({
  wallets,
  onBack,
  onClose,
  onConnect,
  onCreate,
}: {
  wallets: Wallet[];
  onBack: () => void;
  onClose: () => void;
  onConnect: (walletId: string) => void;
  onCreate: () => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between px-1 py-1">
        <IconButton onClick={onBack} label="Back" icon={ArrowLeft01Icon} />
        <h2 className="text-lg font-semibold text-foreground">
          Connect Wallet
        </h2>
        <IconButton onClick={onClose} label="Close" icon={Cancel01Icon} />
      </div>

      <div className="flex flex-col gap-2">
        {wallets.map((w) => (
          <button
            key={w.id}
            onClick={() => onConnect(w.id)}
            className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2.5 text-left shadow-[var(--input-shadow)] transition-[color,background-color,box-shadow] hover:bg-accent hover:shadow-[var(--input-shadow-hover)]"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg text-lg leading-none"
              style={{ background: w.bg }}
            >
              {w.icon ? (
                <HugeiconsIcon icon={w.icon} size={18} className="text-white" />
              ) : (
                w.emoji
              )}
            </span>
            <span className="flex-1 text-[15px] font-semibold text-foreground">
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
              className="text-muted-foreground"
            />
          </button>
        ))}
      </div>

      <motion.button
        layoutId="wallet-action"
        onClick={onCreate}
        transition={MORPH}
        style={{ borderRadius: 12 }}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        Create a New Wallet
      </motion.button>
    </>
  );
}

function CheckoutButton({
  amount = "$5.00",
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
  const [bodyRef, { height }] = useMeasure({ offsetSize: true });
  const shouldReduceMotion = useReducedMotion();
  const [opened, setOpened] = React.useState(false);
  const prevPayStep = React.useRef<MethodId>(initialMethod);

  const resolvedSubtitle = subtitle ?? `Support with ${amount}`;

  const shellTransition = shouldReduceMotion
    ? { duration: 0 }
    : isOpen
      ? EXPAND_SPRING
      : COLLAPSE_SPRING;
  const contentIn = shouldReduceMotion ? { duration: 0 } : CONTENT_IN;
  const contentOut = shouldReduceMotion ? { duration: 0 } : CONTENT_OUT;

  const selectMethod = (m: MethodId) => setStep(m);
  const goToWallet = () => {
    if (step !== "connect-wallet") prevPayStep.current = step;
    setStep("connect-wallet");
  };
  const goBack = () => setStep(prevPayStep.current);

  const close = () => {
    setIsOpen(false);
    setOpened(false);
    setTimeout(() => setStep(initialMethod), 300);
  };

  const handlePay = () => {
    if (step !== "connect-wallet") onPay?.(step);
    close();
  };

  const handleConnect = (walletId: string) => onConnectWallet?.(walletId);

  const handleCreate = () => onCreateWallet?.();

  return (
    <div className={cn("flex h-screen items-center justify-center", className)}>
      <AnimatePresence mode="popLayout">
        {!isOpen && (
          <motion.div
            key="collapsed"
            layoutId={SHELL_ID}
            role="button"
            onClick={() => setIsOpen(true)}
            transition={shellTransition}
            style={{ borderRadius: 10 }}
            className="flex h-9 cursor-pointer items-center gap-2 overflow-hidden bg-card px-3 text-sm font-medium text-foreground select-none"
          >
            <motion.div
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)", transition: contentOut }}
              transition={contentIn}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <HugeiconsIcon icon={triggerIcon} size={16} />
              <span>{triggerLabel}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            key="expanded"
            layoutId={SHELL_ID}
            transition={shellTransition}
            onLayoutAnimationComplete={() => setOpened(true)}
            style={{ borderRadius: 20 }}
            className="w-[340px] overflow-hidden bg-card p-5"
          >
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
                  height:
                    shouldReduceMotion || !opened ? "auto" : height || "auto",
                }}
                transition={MORPH}
                className="overflow-hidden"
              >
                <div ref={bodyRef} className="relative">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={step === "connect-wallet" ? "wallet" : "pay"}
                      initial={STEP_INITIAL}
                      animate={STEP_ANIMATE}
                      exit={STEP_EXIT}
                      className="w-full"
                    >
                      {step === "connect-wallet" ? (
                        <ConnectWalletScreen
                          wallets={wallets}
                          onBack={goBack}
                          onClose={close}
                          onConnect={handleConnect}
                          onCreate={handleCreate}
                        />
                      ) : (
                        <PaymentScreen
                          method={step}
                          amount={amount}
                          title={title}
                          subtitle={resolvedSubtitle}
                          methods={methods}
                          qrSrc={qrSrc}
                          applyCardLast4={applyCardLast4}
                          amazonAccount={amazonAccount}
                          amazonBalance={amazonBalance}
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
