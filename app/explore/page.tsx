import type { Metadata } from "next";

import { UIExplorer } from "@/components/ui-gallery/UIExplorer";

export const metadata: Metadata = {
  title: "Explore UI",
  description: "Browse UI components by category and preview each variant.",
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Explore UI
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a component, then tap a variant to preview it.
        </p>
      </div>
      <UIExplorer />
    </main>
  );
}
