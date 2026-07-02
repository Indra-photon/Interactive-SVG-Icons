import fs from "fs";
import path from "path";
import { Suspense } from "react";
import type { UIComponentRegistry } from "@/types/ui-component";
import { buildUISidebarNodes } from "@/lib/sidebar-data";
import { UIPageShell } from "@/components/ui-gallery/UIPageShell";

function loadUIData() {
  const registryPath = path.join(process.cwd(), "public/r/ui.json");
  const registry: UIComponentRegistry = JSON.parse(
    fs.readFileSync(registryPath, "utf-8"),
  );
  return registry.components;
}

export default function UIPage() {
  const components = loadUIData();
  const sidebarNodes = buildUISidebarNodes(components);

  const sidebarSections = [
    { id: "ui", label: "UI Components", nodes: sidebarNodes },
  ];

  const firstComponent = components[0];
  const firstSlug = firstComponent?.slug ?? "";
  const firstVariation = firstComponent?.variations[0]?.name ?? "";

  return (
    <Suspense>
      <UIPageShell
        components={components}
        sidebarSections={sidebarSections}
        firstSlug={firstSlug}
        firstVariation={firstVariation}
      />
    </Suspense>
  );
}
