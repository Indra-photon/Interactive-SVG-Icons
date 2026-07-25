---
name: better-accessibility
description: Accessibility engineering for product interfaces, from focus states and keyboard support to ARIA, forms, and screen readers. Use when building or reviewing UI components, modals, menus, forms, custom widgets, or when the user says "make this accessible" or reports keyboard or screen-reader issues. Triggers on accessibility, a11y, WCAG, aria, focus ring, focus-visible, focus trap, keyboard navigation, tab order, tabindex, screen reader, sr-only, aria-live, alt text, hit area, touch target, prefers-reduced-motion, autoplay, toast duration, skip link, semantic HTML, aria-label, form errors, disabled buttons, "not keyboard accessible".
---

# Accessibility that comes with the craft

Accessibility is not a compliance checkbox bolted on at the end; it is the floor for interface craft. Most of it is free if you use the platform: native elements ship with keyboard support, real labels announce themselves, and a visible focus ring is one CSS rule. Apply these principles when building or reviewing UI code, and match the project's existing styling system (Tailwind vs. plain CSS vs. CSS-in-JS) when applying fixes.

When reviewing, walk the interface as a keyboard-only user first (every flow must complete without a mouse), then as a screen-reader user: does each control announce a name, a role, and its state? When unsure, prefer the platform default over a custom rebuild, and remove ARIA rather than add it.

Contrast math (APCA thresholds, fixing contrast in OKLCH) is covered by the `better-colors` skill; text sizes, iOS input zoom, and RTL are covered by the `better-typography` skill.

## Quick Reference

| Category | When to Use |
| --- | --- |
| [Focus & Keyboard](focus-and-keyboard.md) | Focus rings, skip links, tabindex, focus trapping, APG keyboard patterns |
| [Semantics & ARIA](semantics-and-aria.md) | Native elements first, button vs link, landmarks, accessible names, disabled states |
| [Forms](forms.md) | Labels, autocomplete, error messaging, input types |
| [Screen Readers](screen-readers.md) | Visually hidden content, live regions, toasts, alt text, SVG |
| [Hit Areas](hit-areas.md) | Target sizes, expanding hit areas, collision rules |
| [Motion & Zoom](motion-and-zoom.md) | `prefers-reduced-motion`, autoplay and timed UI, 200% zoom, reflow, rem vs px |

## Core Principles

### 1. Native Elements First

The first rule of ARIA: don't use ARIA when a native element exists. `<button>` for actions, `<a href>` for navigation (it must support Cmd/Ctrl/middle-click), never `<div onClick>`. No ARIA is better than bad ARIA.

### 2. Visible Focus Rings

Style `:focus-visible`, not bare `:focus`, so keyboard users get a ring and mouse users don't. The browser's default ring (`outline-style: auto`) renders the focus color the user configured in their OS and browser; prefer keeping it and only adding `outline-offset: 2px`. If the design needs a custom ring, use `outline: 2px solid` with no color (it renders `currentColor`, never a hardcoded brand color) at `3:1` contrast against adjacent colors. Never `outline: none` without a visible replacement.

### 3. Full Keyboard Support

Every pointer interaction needs a keyboard path, following the ARIA APG patterns: Escape closes overlays, arrow keys move within composite widgets (tabs, menus, listboxes), Tab moves between widgets, Enter and Space activate. Only `tabindex="0"` (join the natural tab order) and `tabindex="-1"` (programmatic focus), never positive values, which break the natural order. Composite widgets use roving tabindex: the active item is `0`, all others `-1`.

### 4. Trap and Restore Focus

Modals set `inert` on the background content, move focus inside on open, and return focus to the trigger on close. Add `overscroll-behavior: contain` so background content doesn't scroll.

### 5. Minimum Hit Area

Interactive elements need a 44×44px hit area for touch or mobile contexts, at least 40×40px on desktop; WCAG 2.5.8's hard floor is 24×24px. Extend with a pseudo-element if the visible element is smaller. Never let hit areas of two elements overlap.

### 6. Label and Type Every Control

Every input gets a `<label for>` or wrapping `<label>`; a placeholder is never a label, and label and control share one hit target: no dead zones between a checkbox and its text. Add `autocomplete` with a meaningful `name`, and the correct `type` and `inputmode` for the keyboard. Never block paste; users paste passwords and one-time codes.

### 7. Errors That Announce

Keep submit enabled until the request starts, then disable with a spinner while keeping the original label. Validate on submit: mark failing fields with `aria-invalid="true"`, point `aria-describedby` at the inline error text, and focus the first invalid field. Use native `disabled` when a native control is genuinely unavailable. Use `aria-disabled="true"` only when retaining focusability or discoverability is intentional; then block pointer, keyboard, and form behavior in code and style the state explicitly.

### 8. Accessible Names Everywhere

Icon-only buttons need a descriptive `aria-label`. Visible label text must appear in the accessible name. Decorative elements get `aria-hidden="true"`, never on a focusable element.

### 9. Don't Rely on Color Alone

Status needs a redundant cue: icon, text, or underline alongside the color. Contrast floors: `4.5:1` for text, `3:1` for UI components and focus indicators (the WCAG 2 minimums; `better-colors` prefers APCA thresholds). When contrast fails, report the failing pair and the threshold it misses; don't change the project's colors unless asked, as the `better-colors` skill covers measuring and, on request, fixing.

### 10. Honor prefers-reduced-motion

Wrap motion in `@media (prefers-reduced-motion: no-preference)` so it is opt-in. Under reduced motion, replace slides and scales with opacity crossfades; kill parallax and autoplay entirely. Independent of the preference: autoplaying media needs a visible pause control, and toasts carrying actions or errors stay until dismissed.

### 11. Announce Dynamic Content

Toasts and inline validation use `aria-live="polite"` (`role="status"`); reserve `assertive` (`role="alert"`) for errors. The live region must exist empty in the DOM before its content is injected, or it won't announce.

### 12. Alt Text by Purpose

Decorative images get `alt=""`, informative images describe the meaning, functional images describe the action: a search icon button is `alt="Search"`, not `alt="magnifying glass"`.

### 13. Structure Is Navigation

One `<h1>` per page, no skipped heading levels, exactly one `<main>`. A "Skip to content" link is the first focusable element, and anchored headings get `scroll-margin-top`.

### 14. Survive Zoom and Text Resize

The page must work at 200% zoom and reflow at 320px width without horizontal scrolling. Use `min-height` instead of fixed `height` on text containers, prefer `rem` breakpoints where they fit the codebase's conventions, and never use `user-scalable=no` or `maximum-scale=1`.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| `outline: none` to remove the focus ring | Style `:focus-visible` instead; mouse clicks won't show it |
| Hardcoded brand color on focus rings | Keep the default ring (`outline-style: auto`) or use colorless `outline: 2px solid` (`currentColor`) |
| `<div onClick>` for a button or link | `<button>` for actions, `<a href>` for navigation |
| Placeholder used as the only label | Add a visible `<label for>`; placeholders disappear on input |
| Positive `tabindex` to fix focus order | Fix the DOM order; only use `0` and `-1` |
| Live region injected together with its message | Pre-render the empty region, inject text afterwards |
| `assertive` live region for a routine toast | Use `polite`; reserve `assertive` for errors |
| `aria-hidden="true"` on a focusable element | Remove it or make the element non-focusable |
| Functional icon alt describes the picture | Describe the action: `alt="Search"`, not `alt="magnifying glass"` |
| `maximum-scale=1` to stop iOS input zoom | 16px input font on mobile (see `better-typography`); never block zoom |
| Submit disabled until the form is valid | Keep it enabled; validate on submit and focus the first error |

## Review Output Format

Present every review in two parts.

### Findings

Group findings by principle. Use a markdown table with **Severity**, **Location**, **Before**, **After**, and **Why** columns. Include every change made or proposed, not a subset. Never use separate "Before:" / "After:" lines.

- **Severity**: `HIGH` prevents a task, hides content from assistive technology, or creates a systemic accessibility failure; `MEDIUM` makes an interaction meaningfully harder; `LOW` is isolated polish.
- **Location**: cite `path/to/file:line`. If the artifact has no source files, cite the exact screen and component instead.
- **Before / After**: show the current implementation and an actionable replacement.
- **Why**: name the violated principle and its user impact.

Consolidate a repeated systemic issue into one row and list every affected location. Omit principles with no findings.

### Example

#### Accessible names everywhere
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/Dialog.tsx:42` | `<button><XIcon /></button>` | Add `aria-label="Close"`; mark the icon `aria-hidden="true"` | The icon-only control has no accessible name |
| HIGH | `src/Nav.tsx:18` | `<a href="/settings"><GearIcon /></a>` | Add `aria-label="Settings"` | The link destination is unavailable to screen readers |

#### Visible focus rings
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/button.css:12` | `button:focus { outline: none; }` | `button:focus-visible { outline: 2px solid; outline-offset: 2px; }` | Keyboard users cannot see focus |
| HIGH | `src/Menu.tsx:31` | `focus:outline-none` | `focus-visible:outline-2 focus-visible:outline-offset-2` | Menu navigation has no visible focus indicator |

#### Errors that announce
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/EmailField.tsx:27` | Error shown only as `border-red-500` | Add `aria-invalid="true"` + `aria-describedby="email-error"` with inline error text | Color alone neither explains nor announces the error |
| MEDIUM | `src/SignupForm.tsx:64` | Submit disabled until the form is valid | Keep submit enabled; on failure, focus the first invalid field | A disabled action hides what must be fixed |

#### Minimum hit area
| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/Toolbar.tsx:22` | `size-4` icon-only button | Extend the hit area to 44×44px with `after:absolute after:size-11` | The target is too small for reliable touch input |

### Verification and Verdict

After the findings:

1. **Verification**: list the exact checks run and their observed results, including keyboard traversal, accessible-name inspection, and screen-reader or automated checks when applicable. If a check was not run, state what still needs verification.
2. **Verdict**: `Block` if any `HIGH` finding remains, `Needs changes` if only `MEDIUM` or `LOW` findings remain, and `Approve` only when no actionable findings remain.

When there are no findings, omit the tables, state "No actionable accessibility findings", report verification, and end with `Approve`.
