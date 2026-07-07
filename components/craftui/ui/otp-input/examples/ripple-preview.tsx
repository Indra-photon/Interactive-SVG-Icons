"use client";

import { useState } from "react";
import { RippleOtp, CaretShape } from "../ripple";
import { useUIProps } from "@/components/ui-gallery/UIPropsContext";

const CORRECT_CODE = "123456";

export default function RipplePreview() {
  const {
    length = 6,
    mode = "numeric",
    masked = false,
    rippleOnType = false,
    pendingRing = false,
    autoClearOnFailure = true,
    caretColor = "#3B82F6",
    caretShape = "bar",
    staggerMs = 70,
    maxAmplitude = 5,
    bumpWidth = 0.1,
    decay = 0.06,
    radius = 14,
    strokeWidth = 1.5,
    shakeDistance = 6,
  } = useUIProps();

  const [result, setResult] = useState<"success" | "failure" | null>(null);
  const expected = CORRECT_CODE.slice(0, length);

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-neutral-100 p-10 antialiased dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-foreground text-xl font-medium">
            Enter verification code
          </p>
          {/* <p className="text-muted-foreground mt-1 text-xs">
            Try <span className="font-mono font-semibold">{expected}</span> to
            see succcess state — anything else fails
          </p> */}
        </div>

        <RippleOtp
          // Remount when structural dials change so stale boxes don't linger.
          key={`${length}-${mode}`}
          length={length}
          mode={mode as "numeric" | "alphanumeric"}
          masked={masked}
          rippleOnType={rippleOnType}
          pendingRing={pendingRing}
          autoClearOnFailure={autoClearOnFailure}
          caretColor={caretColor}
          caretShape={caretShape as CaretShape}
          staggerMs={staggerMs}
          maxAmplitude={maxAmplitude}
          bumpWidth={bumpWidth}
          decay={decay}
          radius={radius}
          strokeWidth={strokeWidth}
          shakeDistance={shakeDistance}
          validate={(code) =>
            new Promise<boolean>((resolve) =>
              setTimeout(() => resolve(code === expected), 900),
            )
          }
          onSuccess={() => setResult("success")}
          onFailure={() => setResult("failure")}
          onChange={() => setResult(null)}
        />

        {/* <p
          className="h-4 text-xs"
          style={{
            color:
              result === "success"
                ? "var(--success, oklch(0.723 0.219 149.579))"
                : result === "failure"
                  ? "var(--destructive)"
                  : "transparent",
          }}
        >
          {result === "success"
            ? "onSuccess fired — code verified"
            : result === "failure"
              ? "onFailure fired — code rejected"
              : "·"}
        </p> */}
      </div>
    </div>
  );
}
