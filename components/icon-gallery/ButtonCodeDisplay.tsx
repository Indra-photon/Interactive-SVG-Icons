"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { CodeBottomPanel } from "./CodeBottomPanel";
import { Paragraph } from "../Paragraph";

interface ButtonCodeDisplayProps {
  iconSlug: string;
  variationName: string;
  buttonCode: string;
}

export function ButtonCodeDisplay({
  iconSlug,
  variationName,
  buttonCode,
}: ButtonCodeDisplayProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelRect, setPanelRect] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleGetCode = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPanelRect({ left: rect.left, width: rect.width });
    }
    setPanelOpen(true);
  };

  // Memoized so state changes (panelOpen, panelRect) don't recreate the dynamic import
  const ButtonExample = useMemo(
    () =>
      dynamic(
        () =>
          import(
            `@/components/craftui/icons/${iconSlug}/examples/${variationName}-button.tsx`
          )
            .then((mod) => {
              const exportedComponent = mod[Object.keys(mod)[0]];
              return { default: exportedComponent };
            })
            .catch(() => ({
              default: () => (
                <div className="text-sm text-muted-foreground">
                  Button example not available
                </div>
              ),
            })),
        { ssr: false },
      ),
    [iconSlug, variationName],
  );

  return (
    <div ref={wrapperRef}>
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <Paragraph variant="title" className="mb-1">
            Example Component
          </Paragraph>
          <Paragraph variant="body" className="">
            Ready-to-use button component with the icon
          </Paragraph>
        </div>
        <Button
          size="lg"
          variant="ghost"
          onClick={handleGetCode}
          className="corner-squircle rounded-[10px] font-mono text-xs tracking-tighter :active:scale-95 transition-transform duration-100 ease-out"
        >
          Get Code
        </Button>
      </div>

      {/* Live Button Preview */}
      <div className="bg-muted corner-squircle rounded-[10px] border border-border p-8 mb-4 flex items-center justify-center">
        <ButtonExample />
      </div>

      <CodeBottomPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        code={buttonCode}
        title={`${variationName} — Button Example`}
        left={panelRect?.left}
        width={panelRect?.width}
      />
    </div>
  );
}
