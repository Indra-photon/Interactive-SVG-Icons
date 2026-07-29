"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Mic01Icon,
  Camera01Icon,
  Video01Icon,
  File01Icon,
  Attachment01Icon,
  SparklesIcon,
  ImageAdd01Icon,
  Idea01Icon,
  Telescope01Icon,
  Globe02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Tick02Icon,
  MessageQuestionIcon,
  TaskDaily01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";

export type HugeIcon = typeof SparklesIcon;

export interface ArcItem {
  icon: HugeIcon;
  label: string;
  angle?: number;
}

export interface ToolItem {
  icon: HugeIcon;
  label: string;
}

export interface ChatModeOption {
  id: string;
  label: string;
  icon: HugeIcon;
  desc: string;
}

export interface ModelOption {
  id: string;
  label: string;
  tier: string;
  color: string;
}

export interface AIChatProps {
  heading?: string;
  placeholder?: string;

  arcItems?: ArcItem[];
  toolItems?: ToolItem[];
  modes?: ChatModeOption[];
  models?: ModelOption[];
  mockPhrases?: string[];

  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;

  defaultModeId?: string;
  modeId?: string;
  onModeChange?: (mode: ChatModeOption) => void;

  defaultModelId?: string;
  modelId?: string;
  onModelChange?: (model: ModelOption) => void;

  onToolChange?: (tool: ToolItem | null) => void;
  onAttach?: (item: ArcItem) => void;
  onRecordingChange?: (recording: boolean) => void;

  className?: string;
}

const EASE_OUT_QUART = [0.165, 0.84, 0.44, 1] as const;
const EASE_PANEL = [0.22, 1, 0.36, 1] as const;
const RADIUS = 80;

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;
const EXPAND_SPRING: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0.16,
};
const COLLAPSE_SPRING: Transition = {
  type: "spring",
  duration: 0.22,
  bounce: 0,
};
const CONTENT_IN: Transition = { duration: 0.2, ease: EASE_OUT };
const CONTENT_OUT: Transition = { duration: 0.15, ease: EASE_OUT };

const DEFAULT_ARC_ITEMS: ArcItem[] = [
  { icon: Camera01Icon, label: "Photo", angle: -55 },
  { icon: Video01Icon, label: "Video", angle: -18 },
  { icon: File01Icon, label: "File", angle: 18 },
  { icon: Attachment01Icon, label: "Attach", angle: 55 },
];

const DEFAULT_TOOL_ITEMS: ToolItem[] = [
  { icon: ImageAdd01Icon, label: "Create image" },
  { icon: Idea01Icon, label: "Thinking" },
  { icon: Telescope01Icon, label: "Deep research" },
  { icon: Globe02Icon, label: "Web search" },
];

const DEFAULT_MODES: ChatModeOption[] = [
  {
    id: "ask",
    label: "Ask",
    icon: MessageQuestionIcon,
    desc: "Answer questions about anything",
  },
  {
    id: "plan",
    label: "Plan",
    icon: TaskDaily01Icon,
    desc: "Draft an approach before acting",
  },
  {
    id: "build",
    label: "Build",
    icon: SourceCodeIcon,
    desc: "Write and edit code end to end",
  },
];

const DEFAULT_MODELS: ModelOption[] = [
  {
    id: "kimi",
    label: "Kimi K3",
    tier: "High",
    color: "oklch(0.21 0.034 264.665)",
  },
  {
    id: "gpt-terra",
    label: "GPT-5.6 Terra",
    tier: "Medium",
    color: "oklch(0.627 0.12 164.9)",
  },
  {
    id: "gpt-sol",
    label: "GPT-5.6 Sol",
    tier: "Medium",
    color: "oklch(0.627 0.12 164.9)",
  },
  {
    id: "sonnet",
    label: "Sonnet 5",
    tier: "High",
    color: "oklch(0.673 0.131 41)",
  },
  {
    id: "opus",
    label: "Opus 4.8",
    tier: "High",
    color: "oklch(0.673 0.131 41)",
  },
  {
    id: "fable",
    label: "Fable 5",
    tier: "High",
    color: "oklch(0.673 0.131 41)",
  },
];

const DEFAULT_PHRASES = [
  "What's the best way to learn machine learning from scratch?",
  "Help me write a professional email to reschedule a meeting...",
  "Explain the difference between REST and GraphQL APIs.",
  "What are the most effective UI animation principles?",
];

const WAVEFORM_BARS = [
  { maxH: 5, dur: 0.55 },
  { maxH: 13, dur: 0.7 },
  { maxH: 17, dur: 0.5 },
  { maxH: 9, dur: 0.8 },
  { maxH: 15, dur: 0.62 },
  { maxH: 7, dur: 0.68 },
  { maxH: 12, dur: 0.55 },
];

function resolveList<T>(input: T[] | undefined, fallback: T[]): T[] {
  return input && input.length > 0 ? input : fallback;
}

function arcAngle(item: ArcItem, i: number, n: number) {
  if (item.angle !== undefined) return item.angle;
  if (n <= 1) return 0;
  const spread = 110;
  return -spread / 2 + (spread * i) / (n - 1);
}

function arcPosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: RADIUS * Math.sin(rad), y: -RADIUS * Math.cos(rad) };
}

function WaveformBars() {
  return (
    <div className="flex h-5 items-center gap-[2.5px]">
      {WAVEFORM_BARS.map(({ maxH, dur }, i) => (
        <motion.span
          key={i}
          className="block w-[2.5px] rounded-full bg-rose-500"
          animate={{ height: [maxH * 0.25, maxH, maxH * 0.25] }}
          transition={{
            duration: dur,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          style={{ minHeight: 3 }}
        />
      ))}
    </div>
  );
}

function useTypewriter(text: string, speed = 42) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}

function MorphMenu({
  layoutId,
  isOpen,
  onOpen,
  onClose,
  reduceMotion,
  collapsed,
  expanded,
  panelWidth,
}: {
  layoutId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  reduceMotion: boolean | null;
  collapsed: React.ReactNode;
  expanded: React.ReactNode;
  panelWidth: number;
}) {
  const shellTransition = reduceMotion
    ? { duration: 0 }
    : isOpen
      ? EXPAND_SPRING
      : COLLAPSE_SPRING;
  const contentIn = reduceMotion ? { duration: 0 } : CONTENT_IN;
  const contentOut = reduceMotion ? { duration: 0 } : CONTENT_OUT;

  return (
    <div className="relative inline-flex flex-shrink-0">
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium whitespace-nowrap opacity-0 select-none"
      >
        {collapsed}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={2}
          color="currentColor"
        />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {!isOpen && (
          <motion.button
            key="collapsed"
            layoutId={layoutId}
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            whileTap={{ scale: 0.96 }}
            transition={shellTransition}
            style={{ overflow: "hidden", borderRadius: 12 }}
            className="absolute inset-y-0 start-0 inline-flex items-center gap-2 bg-muted-foreground px-3.5 py-2 text-xs font-medium text-background select-none"
          >
            <motion.span
              layout="position"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)", transition: contentOut }}
              transition={contentIn}
              className="flex items-center gap-1.5"
            >
              {collapsed}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                strokeWidth={2}
                color="currentColor"
                className="mt-0.5 flex-shrink-0"
              />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        {isOpen && (
          <motion.div
            key="expanded"
            layoutId={layoutId}
            transition={shellTransition}
            onClick={(e) => e.stopPropagation()}
            style={{ width: panelWidth, overflow: "hidden", borderRadius: 14 }}
            className="absolute bottom-0 start-0 z-50 bg-muted-foreground p-1.5 text-background ring-1 ring-border"
          >
            <motion.div
              layout="position"
              initial={{ opacity: 0.97, filter: "blur(4px)", scale: 0.97 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{
                opacity: 0,
                filter: "blur(4px)",
                scale: 0.97,
                transition: contentOut,
              }}
              transition={contentIn}
            >
              {expanded}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIChat({
  heading = "Ready when you are.",
  placeholder = "Our AI is ready to help. Ask it anything...",
  arcItems: arcItemsProp,
  toolItems: toolItemsProp,
  modes: modesProp,
  models: modelsProp,
  mockPhrases: mockPhrasesProp,
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  defaultModeId,
  modeId,
  onModeChange,
  defaultModelId,
  modelId,
  onModelChange,
  onToolChange,
  onAttach,
  onRecordingChange,
  className = "",
}: AIChatProps = {}) {
  const arcItems = React.useMemo(
    () => resolveList(arcItemsProp, DEFAULT_ARC_ITEMS),
    [arcItemsProp],
  );
  const toolItems = React.useMemo(
    () => resolveList(toolItemsProp, DEFAULT_TOOL_ITEMS),
    [toolItemsProp],
  );
  const modes = React.useMemo(
    () => resolveList(modesProp, DEFAULT_MODES),
    [modesProp],
  );
  const models = React.useMemo(
    () => resolveList(modelsProp, DEFAULT_MODELS),
    [modelsProp],
  );
  const mockPhrases = React.useMemo(
    () => resolveList(mockPhrasesProp, DEFAULT_PHRASES),
    [mockPhrasesProp],
  );

  const isValueControlled = value !== undefined;
  const [valueState, setValueState] = useState(defaultValue);
  const inputValue = isValueControlled ? value : valueState;
  const setInputValue = (v: string) => {
    if (!isValueControlled) setValueState(v);
    onValueChange?.(v);
  };

  const isModeControlled = modeId !== undefined;
  const [modeIdState, setModeIdState] = useState(defaultModeId ?? modes[0]?.id);
  const currentModeId = isModeControlled ? modeId : modeIdState;
  const selectedMode = modes.find((m) => m.id === currentModeId) ?? modes[0];

  const isModelControlled = modelId !== undefined;
  const [modelIdState, setModelIdState] = useState(
    defaultModelId ?? models[0]?.id,
  );
  const currentModelId = isModelControlled ? modelId : modelIdState;
  const selectedModel =
    models.find((m) => m.id === currentModelId) ?? models[0];

  const [plusOpen, setPlusOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [openMenu, setOpenMenu] = useState<"mode" | "model" | null>(null);

  const reduceMotion = useReducedMotion();
  const typewriterText = useTypewriter(currentPhrase);

  const closeAll = () => {
    setPlusOpen(false);
    setMenuOpen(false);
    setOpenMenu(null);
  };

  const openMorph = (which: "mode" | "model") => {
    setPlusOpen(false);
    setMenuOpen(false);
    setOpenMenu(which);
  };

  const selectMode = (mode: ChatModeOption) => {
    if (!isModeControlled) setModeIdState(mode.id);
    onModeChange?.(mode);
    setOpenMenu(null);
  };

  const selectModel = (model: ModelOption) => {
    if (!isModelControlled) setModelIdState(model.id);
    onModelChange?.(model);
    setOpenMenu(null);
  };

  const selectTool = (tool: ToolItem) => {
    setSelectedTool((prev) => {
      const next = prev?.label === tool.label ? null : tool;
      onToolChange?.(next);
      return next;
    });
    setMenuOpen(false);
  };

  const setRecording = (next: boolean) => {
    setIsRecording(next);
    onRecordingChange?.(next);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      const phrase =
        mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setCurrentPhrase(phrase);
      closeAll();
    } else {
      setCurrentPhrase("");
    }
    setRecording(!isRecording);
  };

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center bg-muted px-4 sm:px-6"
      onClick={closeAll}
    >
      <motion.h1
        animate={{ opacity: isRecording ? 0.35 : 1 }}
        transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
        className="mb-10 text-3xl font-light tracking-tight text-balance text-foreground sm:mb-14 sm:text-4xl"
      >
        {heading}
      </motion.h1>

      <div
        className={`relative w-full max-w-2xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute top-full end-4 flex max-w-full flex-wrap items-start justify-end gap-2 pt-1.5">
          {toolItems.map((item, i) => {
            const active = selectedTool?.label === item.label;
            return (
              <motion.button
                key={item.label}
                animate={{
                  y: menuOpen ? 0 : "-130%",
                  opacity: menuOpen ? 1 : 0,
                  filter: menuOpen ? "blur(0px)" : "blur(2px)",
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: menuOpen ? 0.4 : 0.35,
                        delay: menuOpen
                          ? (toolItems.length - 1 - i) * 0.06
                          : i * 0.04,
                        ease: EASE_PANEL,
                      }
                }
                whileTap={{ scale: 0.96 }}
                onClick={() => selectTool(item)}
                className={`pointer-events-auto flex items-center gap-2 rounded-[12px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shadow-md transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "bg-muted-foreground text-background hover:bg-foreground/90"
                }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={14}
                  strokeWidth={1.5}
                  color="currentColor"
                />
                {item.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ y: "-110%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "-110%", opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.38, ease: EASE_OUT_QUART }}
              className="absolute top-full inset-x-0 z-0 pt-1.5"
            >
              <div className="flex items-start gap-3 rounded-2xl bg-foreground/90 px-5 py-4 text-background backdrop-blur-sm">
                <p className="min-h-[20px] flex-1 text-sm leading-relaxed text-pretty text-background/90">
                  {typewriterText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="ms-[2px] inline-block h-[14px] w-[2px] rounded-full bg-background/70 align-middle"
                  />
                </p>

                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.2,
                    ease: EASE_OUT_QUART,
                  }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setInputValue(currentPhrase);
                    setRecording(false);
                    setCurrentPhrase("");
                  }}
                  className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-background/15 transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-background/25"
                >
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    size={14}
                    strokeWidth={2}
                    color="currentColor"
                  />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 rounded-[14px] border border-transparent bg-card px-4 pt-3.5 pb-3 shadow-[var(--input-shadow)]">
          <motion.input
            animate={{ opacity: isRecording ? 0.35 : 1 }}
            transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpenMenu(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit?.(inputValue);
              }
            }}
            placeholder={placeholder}
            disabled={isRecording}
            className="w-full bg-transparent px-1.5 pb-2.5 text-base text-foreground transition-colors duration-150 ease-out outline-none placeholder:text-muted-foreground focus:placeholder:text-muted-foreground/60"
          />

          <div className="flex items-center gap-3 select-none sm:gap-4">
            <motion.div
              animate={{ opacity: isRecording ? 0.35 : 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
              className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center"
            >
              {plusOpen && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPlusOpen(false)}
                />
              )}

              {arcItems.map((item, i) => {
                const pos = arcPosition(arcAngle(item, i, arcItems.length));
                return (
                  <motion.button
                    key={item.label}
                    className="absolute z-20 flex flex-col items-center gap-1.5"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginLeft: -22,
                      marginTop: -22,
                    }}
                    animate={{
                      x: plusOpen ? pos.x : 0,
                      y: plusOpen ? pos.y : 0,
                      scale: plusOpen ? 1 : 0,
                      opacity: plusOpen ? 1 : 0,
                      filter: plusOpen ? "blur(0px)" : "blur(4px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      delay: plusOpen ? i * 0.015 : 0,
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onAttach?.(item);
                      setPlusOpen(false);
                    }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] transition-colors hover:bg-secondary/70">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={19}
                        strokeWidth={1.6}
                        color="currentColor"
                      />
                    </div>
                  </motion.button>
                );
              })}

              <motion.button
                animate={{ rotate: plusOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(null);
                  setMenuOpen(false);
                  setPlusOpen((v) => !v);
                }}
                className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:bg-accent hover:text-foreground"
              >
                <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={1.8} />
              </motion.button>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: isRecording ? 0.35 : 1 }}
                transition={{ duration: 0.22, ease: EASE_OUT_QUART }}
              >
                <MorphMenu
                  layoutId="chat-mode-shell"
                  isOpen={openMenu === "mode"}
                  onOpen={() => !isRecording && openMorph("mode")}
                  onClose={() => setOpenMenu(null)}
                  reduceMotion={reduceMotion}
                  panelWidth={230}
                  collapsed={
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={selectedMode.icon}
                        size={14}
                        strokeWidth={1.5}
                        color="currentColor"
                      />
                      <span className="max-[440px]:hidden">
                        {selectedMode.label}
                      </span>
                    </span>
                  }
                  expanded={
                    <div className="flex flex-col gap-1">
                      {modes.map((mode) => {
                        const active = mode.id === selectedMode.id;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => selectMode(mode)}
                            className={`flex flex-col gap-1 rounded-[9px] px-3 py-2 text-start transition-[background-color,transform] select-none active:scale-[0.96] ${
                              active
                                ? "bg-background/10"
                                : "hover:bg-background/5"
                            }`}
                          >
                            <span className="flex items-center gap-1 text-sm font-medium text-background tracking-normal">
                              <span className="flex-shrink-0 text-background">
                                <HugeiconsIcon
                                  icon={mode.icon}
                                  size={14}
                                  strokeWidth={1.8}
                                  color="currentColor"
                                />
                              </span>
                              {mode.label}
                              {active && (
                                <HugeiconsIcon
                                  icon={Tick02Icon}
                                  size={15}
                                  strokeWidth={2.2}
                                  color="currentColor"
                                  className="ms-auto"
                                />
                              )}
                            </span>
                            <span className="text-xs text-pretty text-background/90 tracking-tight">
                              {mode.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  }
                />
              </motion.div>

              <motion.div
                animate={{ opacity: isRecording ? 0.35 : 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
              >
                <MorphMenu
                  layoutId="chat-model-shell"
                  isOpen={openMenu === "model"}
                  onOpen={() => !isRecording && openMorph("model")}
                  onClose={() => setOpenMenu(null)}
                  reduceMotion={reduceMotion}
                  panelWidth={280}
                  collapsed={
                    <span className="inline-block max-w-[8rem] truncate align-middle max-[440px]:max-w-[4.5rem]">
                      {selectedModel.label}
                    </span>
                  }
                  expanded={
                    <div className="flex flex-col">
                      <div className="max-h-60 overflow-y-auto">
                        {models.map((model) => {
                          const active = selectedModel.id === model.id;
                          return (
                            <button
                              key={model.id}
                              onClick={() => selectModel(model)}
                              className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-start transition-[background-color,transform] select-none hover:bg-background/5 active:scale-[0.96]"
                            >
                              <span
                                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ background: model.color }}
                              >
                                {model.label[0]}
                              </span>
                              <span className="flex-1 text-sm text-background">
                                {model.label}{" "}
                                <span className="text-background/60">
                                  {model.tier}
                                </span>
                              </span>
                              {active && (
                                <HugeiconsIcon
                                  icon={Tick02Icon}
                                  size={16}
                                  strokeWidth={2.2}
                                  color="currentColor"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  }
                />
              </motion.div>
            </div>

            <div className="ms-auto flex flex-shrink-0 items-center gap-2">
              <motion.button
                animate={{
                  rotate: menuOpen ? 20 : 0,
                  scale: menuOpen ? 1.15 : 1,
                  opacity: isRecording ? 0.35 : 1,
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isRecording) {
                    setOpenMenu(null);
                    setPlusOpen(false);
                    setMenuOpen((v) => !v);
                  }
                }}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors before:absolute before:-inset-1 before:content-[''] ${
                  selectedTool
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "text-foreground hover:bg-accent hover:text-foreground"
                }`}
                title={selectedTool ? selectedTool.label : "Tools"}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={selectedTool?.label ?? "sparkles"}
                    initial={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, ease: "easeInOut" }
                    }
                    className="flex items-center justify-center"
                  >
                    <HugeiconsIcon
                      icon={selectedTool ? selectedTool.icon : SparklesIcon}
                      size={20}
                      strokeWidth={1.8}
                      color="currentColor"
                    />
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRecording();
                }}
                className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors before:absolute before:-inset-1 before:content-[''] hover:bg-accent hover:text-foreground"
                animate={{ scale: isRecording ? 1.05 : 1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isRecording ? (
                    <motion.div
                      key="waveform"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.2, ease: "easeInOut" }
                      }
                    >
                      <WaveformBars />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mic"
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(2px)" }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.2, ease: "easeInOut" }
                      }
                    >
                      <HugeiconsIcon
                        icon={Mic01Icon}
                        size={20}
                        strokeWidth={1.8}
                        color="currentColor"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
