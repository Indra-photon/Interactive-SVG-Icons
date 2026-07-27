"use client";

import { useEffect, useMemo, useState } from "react";

import { UIPreview } from "@/components/ui-gallery/UIPreview";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Variation {
  name: string;
  displayName?: string;
}

interface UIComponentItem {
  slug: string;
  name: string;
  category: string;
  variations: Variation[];
}

const titleCase = (s: string) =>
  s.replace(/(^|[-\s])(\w)/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase());

export function UIExplorer() {
  const [components, setComponents] = useState<UIComponentItem[] | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [variant, setVariant] = useState<string>("");

  // Load the built UI registry (served from public/r).
  useEffect(() => {
    let active = true;
    fetch("/r/ui.json")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const items: UIComponentItem[] = data.components ?? [];
        setComponents(items);
        setSlug(items[0]?.slug ?? "");
        setVariant(items[0]?.variations[0]?.name ?? "");
      })
      .catch(() => setComponents([]));
    return () => {
      active = false;
    };
  }, []);

  const activeComponent = useMemo(
    () => (components ?? []).find((c) => c.slug === slug),
    [components, slug],
  );
  const variants = activeComponent?.variations ?? [];

  const onComponentChange = (next: string) => {
    setSlug(next);
    const comp = (components ?? []).find((c) => c.slug === next);
    setVariant(comp?.variations[0]?.name ?? "");
  };

  if (!components) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-[460px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {/* Component selector — labels match the sidebar (component names). */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={slug} onValueChange={onComponentChange}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Component" />
          </SelectTrigger>
          <SelectContent>
            {components.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="flex min-h-[460px] w-full items-stretch justify-center overflow-hidden rounded-xl border border-border bg-background">
        {activeComponent && variant ? (
          <UIPreview
            key={`${slug}:${variant}`}
            componentSlug={slug}
            variationName={variant}
          />
        ) : (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            Select a component to preview
          </div>
        )}
      </div>

      {/* Variant buttons */}
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <Button
              key={v.name}
              variant={v.name === variant ? "default" : "ghost"}
              size="sm"
              onClick={() => setVariant(v.name)}
              className={cn(
                "border border-border",
                v.name === variant && "border-transparent",
              )}
            >
              {v.displayName ?? titleCase(v.name)}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UIExplorer;
