"use client";

import { useState } from "react";
import ThemeButton, { type FontOption, type ThemeOption } from "../default";

// The preview owns the demo chrome (centering + background) so the component
// itself stays embeddable. The callbacks drive a live sample below the pill —
// this is the "what happens after someone selects" wired up end to end.
export default function DefaultPreview() {
  const [font, setFont] = useState<FontOption | null>(null);
  const [theme, setTheme] = useState<ThemeOption | null>(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-muted px-6">
      <ThemeButton onFontChange={setFont} onThemeChange={setTheme} />
    </div>
  );
}
