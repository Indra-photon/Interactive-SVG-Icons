import fs from "fs";
import path from "path";
import type { UIComponentRegistry } from "@/types/ui-component";
import { buildUISidebarNodes } from "@/lib/sidebar-data";
import { UIGalleryShell } from "@/components/ui-gallery/UIGalleryShell";

function loadUIData() {
  const registryPath = path.join(process.cwd(), "public/r/ui.json");
  const registry: UIComponentRegistry = JSON.parse(
    fs.readFileSync(registryPath, "utf-8"),
  );
  return registry.components;
}

export default function UIGalleryPage() {
  const components = loadUIData();
  const sidebarNodes = buildUISidebarNodes(components);

  const sidebarSections = [
    {
      id: "ui",
      label: "UI Components",
      nodes: sidebarNodes,
      topLink: { label: "Gallery", href: "/ui-gallery" },
    },
  ];

  return (
    <UIGalleryShell components={components} sidebarSections={sidebarSections} />
  );
}
