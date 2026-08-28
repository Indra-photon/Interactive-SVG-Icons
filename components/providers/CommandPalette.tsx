"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { useModKey } from "@/hooks/use-mod-key";
import {
  commandGroupLabels,
  commandGroupOrder,
  commands,
} from "@/constants/commands";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  // modKey is no longer displayed here — the theme shortcut is a bare "D" —
  // but `mounted` still gates the sun/moon label against hydration mismatch.
  const { mounted } = useModKey();

  // resolvedTheme, not theme — under "system" this must follow the OS choice
  const isDark = resolvedTheme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  useHotkeys([
    { key: "k", mod: true, handler: () => setOpen((prev) => !prev) },
    // Bare "d", no modifier. useHotkeys already skips bare keys while the
    // user is typing, so this can't fire from inside the palette's own search
    // box or any other input.
    { key: "d", handler: toggleTheme },
  ]);

  function runCommand(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages or run a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {commandGroupOrder.map((groupId) => {
          const entries = commands.filter((entry) => entry.group === groupId);
          if (entries.length === 0) return null;

          return (
            <CommandGroup key={groupId} heading={commandGroupLabels[groupId]}>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.id}
                  value={`${entry.label} ${entry.keywords?.join(" ") ?? ""}`}
                  onSelect={() => runCommand(() => router.push(entry.url))}
                >
                  <HugeiconsIcon
                    icon={entry.icon}
                    size={16}
                    strokeWidth={1.8}
                    color="currentColor"
                    className="text-muted-foreground"
                  />
                  <span>{entry.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        <CommandSeparator />

        <CommandGroup heading="Appearance">
          <CommandItem
            value="toggle theme dark light appearance mode"
            onSelect={() => runCommand(toggleTheme)}
          >
            <HugeiconsIcon
              icon={mounted && isDark ? Sun01Icon : Moon02Icon}
              size={16}
              strokeWidth={1.8}
              color="currentColor"
              className="text-muted-foreground"
            />
            <span>
              {mounted && isDark ? "Switch to light theme" : "Switch to dark theme"}
            </span>
            <CommandShortcut>
              <Kbd>D</Kbd>
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
