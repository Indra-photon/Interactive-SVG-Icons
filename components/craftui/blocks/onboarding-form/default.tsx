"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Step {
  label: string;
  question: string;
  options: string[];
}

interface OnboardingFormProps {
  steps?: Step[];
  onComplete?: (answers: Record<number, string>) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_STEPS: Step[] = [
  {
    label: "Your Role",
    question: "What best describes your role?",
    options: ["Designer", "Developer", "Product Manager", "Other"],
  },
  {
    label: "Team Size",
    question: "How large is your team?",
    options: ["Just me", "2–10 people", "11–50 people", "50+ people"],
  },
  {
    label: "Primary Goal",
    question: "What's your main goal with this tool?",
    options: [
      "Ship faster",
      "Better collaboration",
      "Track progress",
      "All of the above",
    ],
  },
  {
    label: "Workflow",
    question: "What's your preferred workflow style?",
    options: [
      "Agile / Scrum",
      "Waterfall",
      "Flexible / Hybrid",
      "Not sure yet",
    ],
  },
  {
    label: "Discovery",
    question: "How did you hear about us?",
    options: [
      "Social media",
      "Friend / Colleague",
      "Search engine",
      "Advertisement",
    ],
  },
];

const ROW_HEIGHT = 64;
const ACTIVE_ROW = 2;
const DOT_OFFSET = 20;
const EASING = [0.645, 0.045, 0.355, 1] as const;

const slideVariants = {
  initial: (dir: number) => ({ x: `${80 * dir}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: `${-80 * dir}%`, opacity: 0 }),
};

// ── StepLabel ─────────────────────────────────────────────────────────────────

function StepLabel({
  step,
  stepIndex,
  isActive,
  isPast,
  transition,
}: {
  step: Step;
  stepIndex: number;
  isActive: boolean;
  isPast: boolean;
  transition: object;
}) {
  return (
    <div className="flex items-center" style={{ height: ROW_HEIGHT }}>
      <motion.div
        animate={{
          x: isActive ? DOT_OFFSET : 0,
          opacity: isActive ? 1 : isPast ? 0.25 : 0.4,
        }}
        transition={transition}
        className="flex flex-col gap-0.5"
      >
        <motion.span
          animate={{ color: isActive ? "#737373" : "#a3a3a3" }}
          transition={transition}
          className="font-mono text-[16px] tracking-widest"
        >
          {String(stepIndex + 1).padStart(2, "0")}
        </motion.span>
        <motion.span
          animate={{
            color: isActive ? "#111111" : "#a3a3a3",
            fontWeight: isActive ? 400 : 200,
          }}
          transition={transition}
          className="text-[24px] leading-tight whitespace-nowrap"
        >
          {step.label}
        </motion.span>
      </motion.div>
    </div>
  );
}

// ── StepTicker ────────────────────────────────────────────────────────────────

function StepTicker({
  steps,
  activeStep,
  scrollTransition,
  labelTransition,
}: {
  steps: Step[];
  activeStep: number;
  scrollTransition: object;
  labelTransition: object;
}) {
  const padded = [
    ...Array(ACTIVE_ROW).fill(null),
    ...steps,
    ...Array(ACTIVE_ROW).fill(null),
  ];
  const yOffset = -activeStep * ROW_HEIGHT;

  return (
    <aside className="flex w-56 shrink-0 flex-col rounded-lg bg-stone-300 py-8">
      <div className="mb-6 px-6">
        <p className="text-[13px] font-semibold tracking-tight text-neutral-700 uppercase">
          Getting started
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ height: ROW_HEIGHT * 5 }}
      >
        {/* Fixed dot — never moves */}
        <div
          className="pointer-events-none absolute left-6 z-10 flex items-center"
          style={{ top: ACTIVE_ROW * ROW_HEIGHT, height: ROW_HEIGHT }}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
        </div>

        {/* Scrolling step labels */}
        <motion.div
          animate={{ y: yOffset }}
          transition={scrollTransition}
          className="absolute top-0 left-6 w-full"
        >
          {padded.map((step, i) => {
            if (!step)
              return <div key={`pad-${i}`} style={{ height: ROW_HEIGHT }} />;
            const stepIndex = i - ACTIVE_ROW;
            return (
              <StepLabel
                key={`step-${stepIndex}`}
                step={step}
                stepIndex={stepIndex}
                isActive={stepIndex === activeStep}
                isPast={stepIndex < activeStep}
                transition={labelTransition}
              />
            );
          })}
        </motion.div>
      </div>
    </aside>
  );
}

// ── OptionButton ──────────────────────────────────────────────────────────────

function OptionButton({
  option,
  isSelected,
  onSelect,
}: {
  option: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-xl border-2 px-4 py-3 text-left text-[13px] font-medium transition-all duration-150 ${
        isSelected
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
      }`}
    >
      {option}
    </button>
  );
}

// ── QuestionSlide ─────────────────────────────────────────────────────────────

function QuestionSlide({
  step,
  stepIndex,
  totalSteps,
  selectedAnswer,
  direction,
  transition,
  onSelect,
}: {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  selectedAnswer: string | undefined;
  direction: number;
  transition: object;
  onSelect: (option: string) => void;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={stepIndex}
        variants={slideVariants}
        initial="initial"
        animate="active"
        exit="exit"
        custom={direction}
        transition={transition}
        className="w-full"
      >
        <p className="mb-4 text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <h2 className="mb-5 text-xl leading-snug font-bold text-neutral-900">
          {step.question}
        </h2>
        <div className="flex flex-col gap-2">
          {step.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              isSelected={selectedAnswer === option}
              onSelect={() => onSelect(option)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── NavButtons ────────────────────────────────────────────────────────────────

function NavButtons({
  isFirst,
  isLast,
  hasAnswer,
  onBack,
  onNext,
}: {
  isFirst: boolean;
  isLast: boolean;
  hasAnswer: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="absolute right-10 bottom-5 flex items-center gap-2">
      <motion.button
        onClick={onBack}
        aria-disabled={isFirst}
        whileTap={{ scale: 0.18 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
          isFirst
            ? "pointer-events-none bg-neutral-100 text-neutral-300"
            : "cursor-pointer bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }`}
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={16}
          strokeWidth={2.5}
          color="currentColor"
        />
      </motion.button>

      <motion.button
        onClick={onNext}
        aria-disabled={!hasAnswer}
        whileTap={{ scale: 0.18 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
          hasAnswer
            ? "cursor-pointer bg-neutral-900 text-white"
            : "pointer-events-none bg-neutral-100 text-neutral-300"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLast ? (
            <motion.span
              key="tick"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", duration: 0.25, bounce: 0 }}
              className="flex items-center"
            >
              <HugeiconsIcon
                icon={Tick01Icon}
                size={16}
                strokeWidth={2.5}
                color="currentColor"
              />
            </motion.span>
          ) : (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", duration: 0.25, bounce: 0 }}
              className="flex items-center"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={2.5}
                color="currentColor"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ── CompletionScreen ──────────────────────────────────────────────────────────

function CompletionScreen() {
  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",
        ease: [0.165, 0.84, 0.44, 1],
        duration: 0.38,
      }}
      className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-white"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
        <HugeiconsIcon
          icon={Tick01Icon}
          size={22}
          strokeWidth={2.5}
          color="currentColor"
        />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900">All set!</h2>
      <p className="text-sm text-neutral-400">
        Your preferences have been saved.
      </p>
    </motion.div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function OnboardingForm({
  steps = DEFAULT_STEPS,
  onComplete,
}: OnboardingFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;
  const hasAnswer = Boolean(answers[activeStep]);

  const tween = (duration: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: "tween" as const, ease: EASING, duration };

  const goNext = () => {
    if (!hasAnswer) return;
    if (isLast) {
      onComplete?.(answers);
      setDone(true);
      return;
    }
    setDirection(1);
    setActiveStep((s) => s + 1);
  };

  const goBack = () => {
    if (isFirst) return;
    setDirection(-1);
    setActiveStep((s) => s - 1);
  };

  const selectAnswer = (option: string) =>
    setAnswers((prev) => ({ ...prev, [activeStep]: option }));

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 font-sans">
      <div className="relative flex h-[600px] w-[800px] overflow-hidden rounded-2xl bg-white px-2 py-2 shadow-2xl">
        <AnimatePresence mode="wait">
          {done ? (
            <CompletionScreen key="done" />
          ) : (
            <motion.div
              key="form"
              initial={false}
              className="flex h-full w-full gap-2"
            >
              <StepTicker
                steps={steps}
                activeStep={activeStep}
                scrollTransition={tween(0.5)}
                labelTransition={tween(0.5)}
              />

              <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-lg bg-white px-10 pb-16">
                <QuestionSlide
                  step={steps[activeStep]}
                  stepIndex={activeStep}
                  totalSteps={steps.length}
                  selectedAnswer={answers[activeStep]}
                  direction={direction}
                  transition={tween(0.38)}
                  onSelect={selectAnswer}
                />

                <NavButtons
                  isFirst={isFirst}
                  isLast={isLast}
                  hasAnswer={hasAnswer}
                  onBack={goBack}
                  onNext={goNext}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
