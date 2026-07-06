"use client";

import { useEffect, useId, useRef } from "react";
import { IconSearch as SearchIcon } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

interface GallerySearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  placeholder: string;
  resultNoun: string;
  resultNounPlural?: string;
}

export function GallerySearch({
  value,
  onChange,
  resultCount,
  placeholder,
  resultNoun,
  resultNounPlural,
}: GallerySearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && target === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChange]);

  return (
    <div className="flex items-center justify-between gap-3 pb-4">
      <div className="relative w-full max-w-xs">
        <SearchIcon
          size={16}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="corner-squircle rounded-[8px] pl-8 pr-9 border-transparent shadow-[var(--input-shadow)] transition-shadow duration-150 ease-out hover:shadow-[var(--input-shadow-hover)] focus-visible:border-transparent focus-visible:shadow-[var(--input-shadow-focus)] focus-visible:ring-0"
        />
        {!value && (
          <Kbd className="absolute right-2 top-1/2 -translate-y-1/2">/</Kbd>
        )}
      </div>
      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? resultNoun : (resultNounPlural ?? `${resultNoun}s`)}
      </span>
    </div>
  );
}
