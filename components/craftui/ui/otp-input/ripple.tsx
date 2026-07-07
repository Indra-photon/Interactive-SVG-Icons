"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { RippleBorder, RippleBorderHandle } from "./ripple-border";

export interface RippleOtpHandle {
  /** Drive the result animation manually when validating outside `validate`. */
  notifyResult: (result: "valid" | "invalid") => void;
  /** Clear digits, colors and focus the first box. */
  reset: () => void;
}

export type CaretShape = "bar" | "block" | "underscore";

interface RippleOtpProps {
  /** Number of boxes. */
  length?: number;
  /** Controlled value — pair with `onChange`. Omit for uncontrolled usage. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires once every time all boxes become filled, before validation. */
  onComplete?: (value: string) => void;
  /**
   * Called with the full code on completion. Return (or resolve) `true` for
   * success, `false` for failure — the component runs the pending ring while
   * a promise is in flight and choreographs the result animation itself.
   */
  validate?: (value: string) => boolean | Promise<boolean>;
  /** Fires after the success animation finishes. */
  onSuccess?: (value: string) => void;
  /** Fires after the failure animation finishes. */
  onFailure?: (value: string) => void;
  /** Clear digits and refocus the first box after a failure. */
  autoClearOnFailure?: boolean;
  /** Animate the border on every keystroke. Off by default — the ripple only plays for the pending / success / failure states. */
  rippleOnType?: boolean;
  /** Show a low-amplitude oscillating ring while an async validate is pending. Off by default — pending is indicated by border color only. */
  pendingRing?: boolean;
  /** Render digits as dots. */
  masked?: boolean;
  /** Which characters the boxes accept. */
  mode?: "numeric" | "alphanumeric";
  disabled?: boolean;
  autoFocus?: boolean;
  /** Success wave timing — delay between each box's green pulse, in ms. */
  staggerMs?: number;
  /** Corner radius in px, shared by the box and its ripple outline. */
  radius?: number;
  strokeWidth?: number;
  /** Ripple height ceiling in px. */
  maxAmplitude?: number;
  /** How localized the ripple bulge is (fraction of the perimeter). */
  bumpWidth?: number;
  /** Ripple settle speed — higher is snappier. */
  decay?: number;
  /** Failure shake travel in px. */
  shakeDistance?: number;
  caretColor?: string;
  caretShape?: CaretShape;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
}

const SHAKE_DURATION_MS = 280; // dur-a * 2 + dur-b * 2, keep in sync with ri-shake
const FAILURE_SETTLE_MS = 620;
const SUCCESS_SETTLE_MS = 500;

export const RippleOtp = forwardRef<RippleOtpHandle, RippleOtpProps>(
  function RippleOtp(
    {
      length = 6,
      value: valueProp,
      defaultValue = "",
      onChange,
      onComplete,
      validate,
      onSuccess,
      onFailure,
      autoClearOnFailure = true,
      rippleOnType = false,
      pendingRing = false,
      masked = false,
      mode = "numeric",
      disabled = false,
      autoFocus = false,
      staggerMs = 70,
      radius = 14,
      strokeWidth = 1.5,
      maxAmplitude = 5,
      bumpWidth = 0.1,
      decay = 0.06,
      shakeDistance = 6,
      caretColor = "#3B82F6",
      caretShape = "bar",
      label = "One-time password",
      className = "",
    },
    ref,
  ) {
    const lineRefs = useRef<(RippleBorderHandle | null)[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [status, setStatus] = useState<
      "idle" | "pending" | "success" | "failure"
    >("idle");
    const [announcement, setAnnouncement] = useState("");
    const statusRef = useRef(status);
    useEffect(() => {
      statusRef.current = status;
    }, [status]);
    // Guards the complete → validate flow from firing twice for the same code
    // (6th keystroke + Enter, or a paste that re-fills the same value).
    const lastCompletedCode = useRef<string | null>(null);

    const digits = Array.from({ length }, (_, i) => value[i] ?? "");
    const locked = disabled || status === "pending";

    const filterChars = useCallback(
      (raw: string) =>
        mode === "numeric"
          ? raw.replace(/[^0-9]/g, "")
          : raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
      [mode],
    );

    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const after = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    useEffect(() => clearTimers, []);

    const setValue = (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    };

    const resetField = useCallback(() => {
      clearTimers();
      lineRefs.current.forEach((line) => line?.setColorState("idle"));
      containerRef.current?.classList.remove("is-shaking");
      lastCompletedCode.current = null;
      setStatus("idle");
      setAnnouncement("");
    }, []);

    const runSuccess = useCallback(
      (code: string) => {
        clearTimers();
        setStatus("success");
        setAnnouncement("Code accepted.");
        lineRefs.current.forEach((line, i) => {
          after(i * staggerMs, () => {
            line?.setColorState("success");
            line?.pulse({ from: 0, to: 1, magnitude: 9 });
          });
        });
        after((length - 1) * staggerMs + SUCCESS_SETTLE_MS, () =>
          onSuccess?.(code),
        );
      },
      [length, staggerMs, onSuccess],
    );

    const runFailure = useCallback(
      (code: string) => {
        clearTimers();
        setStatus("failure");
        setAnnouncement("Code incorrect. Try again.");
        lineRefs.current.forEach((line) => {
          line?.setColorState("destructive");
          line?.pulseDouble({ from: 0.5, to: 0.5, magnitude: 10 });
        });
        const field = containerRef.current;
        if (field) {
          field.classList.remove("is-shaking");
          // Force a reflow so re-adding the class restarts the animation.
          void field.offsetWidth;
          field.classList.add("is-shaking");
          after(SHAKE_DURATION_MS, () => field.classList.remove("is-shaking"));
        }
        after(FAILURE_SETTLE_MS, () => {
          if (autoClearOnFailure) {
            setValue("");
            lastCompletedCode.current = null;
            lineRefs.current.forEach((line) => line?.setColorState("idle"));
            setStatus("idle");
            inputRefs.current[0]?.focus();
          }
          onFailure?.(code);
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [autoClearOnFailure, onFailure],
    );

    const handleComplete = useCallback(
      (code: string) => {
        if (statusRef.current === "pending") return;
        if (lastCompletedCode.current === code) return;
        lastCompletedCode.current = code;
        onComplete?.(code);

        if (!validate) return;
        const outcome = validate(code);
        if (typeof outcome === "boolean") {
          if (outcome) runSuccess(code);
          else runFailure(code);
          return;
        }
        setStatus("pending");
        setAnnouncement("Checking code…");
        lineRefs.current.forEach((line) => {
          line?.setColorState("pending");
          if (pendingRing) line?.startIdle();
        });
        outcome
          .then((ok) => {
            lineRefs.current.forEach((line) => line?.stopIdle());
            if (ok) runSuccess(code);
            else runFailure(code);
          })
          .catch(() => {
            lineRefs.current.forEach((line) => line?.stopIdle());
            runFailure(code);
          });
      },
      [onComplete, validate, pendingRing, runSuccess, runFailure],
    );

    useImperativeHandle(ref, () => ({
      notifyResult: (result) => {
        const code = digits.join("");
        if (result === "valid") runSuccess(code);
        else runFailure(code);
      },
      reset: () => {
        resetField();
        setValue("");
        inputRefs.current[0]?.focus();
      },
    }));

    /** Writes `chars` into the boxes starting at `index` — shared by typing, paste and SMS autofill. */
    const fillFrom = (index: number, chars: string) => {
      const next = digits.slice();
      let cursor = index;
      for (const ch of chars) {
        if (cursor >= length) break;
        next[cursor] = ch;
        cursor++;
      }
      const joined = next.join("").slice(0, length);
      setValue(joined);

      const focusIndex = Math.min(cursor, length - 1);
      inputRefs.current[focusIndex]?.focus();

      if (joined.length === length && !next.includes("")) {
        handleComplete(joined);
      }
    };

    const handleChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (locked) return;
      if (statusRef.current !== "idle") resetField();
      const chars = filterChars(e.target.value);

      // SMS autofill / paste lands as a multi-char change — distribute it.
      if (chars.length > 1) {
        fillFrom(index, chars);
        return;
      }

      const digit = chars.slice(-1);
      if (rippleOnType) {
        lineRefs.current[index]?.setColorState("primary");
        lineRefs.current[index]?.nudge(digit ? 3 : -3);
      }

      const next = digits.slice();
      next[index] = digit;
      const joined = next.join("").slice(0, length);
      setValue(joined);

      if (digit && index < length - 1) {
        if (rippleOnType) {
          // ripple travels toward the box's right edge, handing off to the next box
          lineRefs.current[index]?.pulse({ from: 0.05, to: 0.5, magnitude: 5 });
        }
        inputRefs.current[index + 1]?.focus();
      }
      if (digit && !next.includes("")) handleComplete(joined);
    };

    const handlePaste = (
      index: number,
      e: React.ClipboardEvent<HTMLInputElement>,
    ) => {
      e.preventDefault();
      if (locked) return;
      if (statusRef.current !== "idle") resetField();
      const chars = filterChars(e.clipboardData.getData("text"));
      if (!chars) return;
      // A full-length code always fills from the first box, regardless of
      // which box received the paste.
      fillFrom(chars.length >= length ? 0 : index, chars);
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (locked) return;
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        inputRefs.current[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        inputRefs.current[length - 1]?.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const code = digits.join("");
        if (code.length === length) handleComplete(code);
      }
    };

    const showFakeCaret = caretShape !== "bar";

    return (
      <div
        ref={containerRef}
        role="group"
        aria-label={`${label}, ${length} characters`}
        className={`ri-field flex gap-2 ${className}`}
        style={
          {
            "--shake-distance": `${shakeDistance}px`,
            "--ri-caret-color": caretColor,
          } as React.CSSProperties
        }
      >
        {digits.map((digit, i) => (
          <div key={i} className="relative w-11">
            <input
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode={mode === "numeric" ? "numeric" : "text"}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              autoFocus={autoFocus && i === 0}
              disabled={disabled}
              aria-label={`Character ${i + 1} of ${length}`}
              aria-invalid={status === "failure" || undefined}
              value={masked && digit ? "•" : digit}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              onFocus={(e) => {
                setFocusedIndex(i);
                e.target.select();
              }}
              onBlur={() => setFocusedIndex((f) => (f === i ? null : f))}
              className={[
                "bg-input/30 w-11 border border-transparent px-0 py-2.5 text-center",
                "text-foreground text-lg font-medium outline-none",
                "transition-shadow duration-150",
                "focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                "disabled:opacity-50",
              ].join(" ")}
              style={{
                borderRadius: radius,
                caretColor: showFakeCaret ? "transparent" : caretColor,
              }}
            />
            {showFakeCaret && focusedIndex === i && (
              <span
                // Remounts when the digit changes so the blink restarts solid,
                // the way a native caret does.
                key={`caret-${digit}`}
                aria-hidden="true"
                className={`ri-caret ri-caret-${caretShape}`}
                style={
                  caretShape === "block"
                    ? { borderRadius: radius - 4 }
                    : undefined
                }
              />
            )}
            <RippleBorder
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              radius={radius}
              strokeWidth={strokeWidth}
              maxAmplitude={maxAmplitude}
              bumpWidth={bumpWidth}
              decay={decay}
            />
          </div>
        ))}
        <span aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>
    );
  },
);
