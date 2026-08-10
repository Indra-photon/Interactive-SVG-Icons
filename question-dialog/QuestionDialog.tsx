"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  HelpSquareIcon,
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
import { cn } from "@/lib/utils";

import { QUESTION_FORMS, type QuestionDraft } from "./forms";
import {
  Divider,
  EASE_OUT,
  FADE,
  ICON_STROKE_LARGE,
  ICON_STROKE_SMALL,
  Section,
  SPRING,
  TypeSummary,
  TypeTile,
} from "./primitives";
import {
  QUESTION_TYPES,
  getQuestionType,
  type QuestionTypeId,
} from "./question-types";

type View = "picker" | QuestionTypeId;

/**
 * The container height, the body swap and the header title all belong to one
 * navigation, so they share a duration. SPRING's `visualDuration` is set to
 * match, which is what puts the corner morph on the same beat.
 */
const SWAP_DURATION = 0.27;

/** How far a screen travels on its way in or out. */
const SWAP_TRAVEL = 45;

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
const bodyVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction * SWAP_TRAVEL,
  }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction * -SWAP_TRAVEL,
  }),
};

export function QuestionDialog({
  children,
  open,
  onOpenChange,
  onAddQuestion,
}: {
  /** Optional trigger. Omit it and drive the dialog with `open`. */
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddQuestion?: (draft: QuestionDraft) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [view, setView] = useState<View>("picker");
  const [direction, setDirection] = useState(1);

  // The measured element is *inside* the animated one, so its height is always
  // the natural height of the current view and never chases its own animation.
  //
  // Default (bounding-rect) measurement is safe here only because the panel no
  // longer scales on open — see `zoom-in-100` above. A bounding rect is
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
        showCloseButton={false}
        className="bg-card data-open:zoom-in-100 data-closed:zoom-out-100 block gap-0 overflow-hidden border-none p-0 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28)] ring-black/5 sm:max-w-[min(700px,calc(100%-2rem))]"
      >
        <DialogTitle className="sr-only">Add Question</DialogTitle>
        <DialogDescription className="sr-only">
          Ask guests custom questions when they register.
        </DialogDescription>

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
            <div ref={contentRef} className="">
              {/* ---- persistent chrome: lives outside AnimatePresence so the
                   corner element can morph rather than crossfade ---- */}
              <header className="relative flex items-start justify-between px-7 pt-7">
                <motion.button
                  layoutId="question-dialog-corner"
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
                    "bg-muted text-muted-foreground z-10 flex shrink-0 items-center justify-center outline-none",
                    isPicker
                      ? "size-16 cursor-default"
                      : "hover:bg-accent hover:text-foreground focus-visible:ring-foreground/15 size-8 transition-colors focus-visible:ring-2 focus-visible:ring-offset-0",
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
                      variants={bodyVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ ...FADE, duration: SWAP_DURATION }}
                      className="text-foreground pointer-events-none absolute inset-x-20 top-7 flex h-8 items-center justify-center text-[17px] font-semibold"
                    >
                      Add Question
                    </motion.span>
                  )}
                </AnimatePresence>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="bg-muted text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-foreground/15 z-10 rounded-full focus-visible:ring-2 focus-visible:ring-offset-0"
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
                      <h2 className="text-foreground text-[26px] leading-tight font-bold tracking-tight">
                        Add Question
                      </h2>
                      <p className="text-muted-foreground mt-1 text-[15px]">
                        Ask guests custom questions when they register.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {QUESTION_TYPES.map((type) => (
                          <TypeTile
                            key={type.id}
                            type={type}
                            onSelect={() => navigate(type.id)}
                          />
                        ))}
                      </div>
                    </Section>
                  ) : (
                    <StepView typeId={view} onSubmit={handleSubmit} />
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
  onSubmit,
}: {
  typeId: QuestionTypeId;
  onSubmit: (draft: QuestionDraft) => void;
}) {
  const type = getQuestionType(typeId);
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
