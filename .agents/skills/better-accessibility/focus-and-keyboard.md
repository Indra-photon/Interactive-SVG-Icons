# Focus and Keyboard

Focus rings, skip links, tabindex, focus trapping, and the APG keyboard patterns.

## Focus rings

Style `:focus-visible`, not bare `:focus`. The browser shows `:focus-visible` for keyboard and assistive-tech focus but suppresses it for mouse clicks, where focus is already obvious. Never write `outline: none` or `focus:outline-none` without a visible replacement; that removes keyboard navigation for sighted keyboard users.

Always respect the focus color the user has set. The platform focus ring (the color the user configured in their OS and browser) only renders with the default `outline-style: auto`; a custom `outline: 2px solid` does *not* pick it up (with no color set, it renders `currentColor`). So the preference order is:

```css
/* Best: keep the user's own ring, just give it breathing room */
:focus-visible {
  outline-offset: 2px;
}

/* Custom ring when the design requires one: no color set, so it renders
   currentColor and adapts to the text color instead of a hardcoded brand color */
:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
}

/* Bad: hardcoded brand color overrides the user's choice */
:focus-visible {
  outline: 2px solid #2563eb;
}
```

```tsx
// Tailwind (v4: outline-2 sets both solid style and 2px width), no color utility
<button className="focus-visible:outline-2 focus-visible:outline-offset-2">
  Save
</button>
```

A custom ring needs at least `3:1` contrast against the colors it sits on (WCAG 1.4.11 Non-text Contrast covers focus indicators).

In `forced-colors: active` (Windows High Contrast), outline colors map to the system `Highlight` palette automatically, one more reason not to fight the defaults.

Group focus styles with `:focus-within` when a wrapper should light up while an inner input has focus (e.g. a search box with an icon inside the border).

## Skip link

The first focusable element on the page is a "Skip to content" link targeting `<main id="main">`. Visually hidden until focused:

```css
.skip-link {
  position: absolute;
  left: -999px;
}
.skip-link:focus {
  left: 16px;
  top: 16px;
}
```

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>…</header>
  <main id="main">…</main>
</body>
```

Give in-page anchor targets `scroll-margin-top` (e.g. `scroll-margin-top: 80px` under a sticky header) so the target isn't hidden when jumped to.

## tabindex rules

- `tabindex="0"`: adds an element to the natural tab order. Only for custom interactive elements that aren't natively focusable.
- `tabindex="-1"`: focusable via JavaScript only (`el.focus()`). Use for headings you move focus to, modal containers, and roving-tabindex members.
- Positive `tabindex`: never. It hijacks the tab order for the whole page; fix the DOM order instead.

### Roving tabindex

Composite widgets (tabs, menus, toolbars, radio groups) occupy a single Tab stop. The active item has `tabindex="0"`, all others `tabindex="-1"`, and arrow keys move both focus and the `0`:

```tsx
<div role="tablist">
  {tabs.map((tab, i) => (
    <button
      role="tab"
      tabIndex={i === activeIndex ? 0 : -1}
      aria-selected={i === activeIndex}
      onKeyDown={handleArrowKeys} // ArrowLeft/ArrowRight move activeIndex, wrapping
    >
      {tab.label}
    </button>
  ))}
</div>
```

## Focus trapping and restoration

Modals must trap focus. The modern technique is the `inert` attribute on everything behind the dialog; it removes background content from the tab order and from assistive tech in one move:

```tsx
// On open
document.getElementById("app-content").inert = true;
const dialog = dialogRef.current;
(dialog.querySelector("[autofocus]") ??
  dialog.querySelector("button, [href], input, select, textarea"))?.focus();

// On close
document.getElementById("app-content").inert = false;
triggerRef.current?.focus(); // always return focus to the element that opened it
```

Native `<dialog>` with `showModal()` gives you the trap, `inert` background, and Escape handling for free; prefer it. A custom overlay that can't use `<dialog>` needs `role="dialog"`, `aria-modal="true"`, and an accessible name (`aria-labelledby` pointing at its heading). Either way:

- On open, focus the first focusable element; for destructive confirmations, focus the least destructive action instead.
- On close, return focus to the trigger. If the trigger no longer exists, move focus to the nearest logical container.
- Add `overscroll-behavior: contain` on the dialog so scrolling inside never scrolls the page behind it.

## Keyboard patterns (ARIA APG)

Native elements come with these behaviors; custom widgets must implement them. A role is a promise: if you give something `role="tab"`, users expect the full tab keyboard model.

| Widget | Keys |
| --- | --- |
| Dialog | Tab/Shift+Tab cycle inside (wrap at ends); Escape closes |
| Tabs | Arrow keys move between tabs (wrapping); Tab exits to the panel; Home/End jump to first/last |
| Menu button | Enter/Space/ArrowDown opens and focuses first item; ArrowUp opens and focuses last; arrows navigate; Escape closes and refocuses the button |
| Disclosure / accordion | Header is a `<button aria-expanded>`; Enter and Space toggle |
| Combobox | ArrowDown opens/moves into the list; Enter accepts; Escape closes and returns to the input; typing filters |
| Listbox / radio group | Arrow keys move selection; one Tab stop for the whole group |

Universal rules:

- Escape dismisses whatever opened last: tooltip, then menu, then dialog.
- Arrow keys, not Tab, move within a composite widget; Tab moves between widgets.
- Tabs choose activation mode: automatic (panel switches on arrow focus) when panels render instantly, manual (Enter/Space to activate) when switching is expensive.
- Enter submits the focused input's form. In `<textarea>`, Enter inserts a newline and ⌘/Ctrl+Enter submits.

## SPA route changes

Client-side navigation doesn't reset focus or announce anything. On route change: update `document.title` to match the new context, then move focus to the new view's `<h1>` (given `tabindex="-1"`) or to `<main>`. Restore scroll position on back/forward navigation; scroll to top on forward navigation.
