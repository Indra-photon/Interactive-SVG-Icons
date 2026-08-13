# CraftUI — Registry Listing, Sign-in & Paid Tier

A step-by-step plan covering four things, in the order they should be built:

1. Getting listed in the official shadcn registry directory
2. Migrating install commands to `npx shadcn add @craftui/<name>`
3. Turning the sign-in layer back on
4. Adding the payment/entitlement layer and enforcing it

Written 2026-08-12. Everything marked ✅ VERIFIED was checked against the live
shadcn index or this repo. Everything marked ⚠️ is a judgement call or an
assumption you should confirm.

---

## Part 0 — What you already have

Before planning anything, it's worth being precise about the starting point,
because a lot of this is already built.

| Asset | Where | State |
|---|---|---|
| Registry source of truth | `registry.json` | 137 items ✅ |
| Built registry files | `public/r/*.json` | 141 files ✅ |
| Build script | `scripts/build-registry.ts` | 728 lines, has duplicate detection (`:645`), stale-file pruning, case-rename safety ✅ |
| Dynamic registry route | `app/api/r/[filename]/route.ts` | **Exists**, reads from `public/r/`, has a literal `TODO: Add auth check when premium icons are added` |
| Free/paid discriminator | `tier: "free"` on every built item | Already emitted by the build |
| Clerk auth | `@clerk/nextjs` in deps, `app/sign-in/`, `app/sign-up/`, `proxy.ts` | **Installed and wired, but disabled** — `ClerkProvider` is commented out at `app/layout.tsx:21-29` |
| User sync to client store | `components/UserSync.tsx` | Written, but commented out at `app/layout.tsx:206` |
| Mongo connection | `lib/dbConnect.ts` | Working, with race-condition guard |
| User model | `app/api/models/UserModel.ts` | **Empty file (0 bytes)** — needs writing |
| Protected routes | `proxy.ts` | `/dashboard`, `/profile` already matched |

**The headline:** you are not starting from zero on any of the four parts. The
registry is real and good, the auth is scaffolded and switched off, and the
gating route exists with a TODO in exactly the right spot.

---

## Part 1 — Getting listed in the shadcn registry directory

### 1.1 What "trusted registry" actually means

There is **no verified or trusted tier**. No badge, no certification, nothing to
buy. The shadcn docs state plainly that community registries "are maintained by
third-party developers" and that users should "review code on installation."

What the X feedback means is: **get listed in the official registry index**.

- The index lives at `https://ui.shadcn.com/r/registries.json`
- ✅ VERIFIED: it currently holds **277 registries**
- ✅ VERIFIED: **`@craftui` is not in it, and the name is free**

Being listed is what gives you:

- `npx shadcn add @craftui/trash-default` instead of a 70-character URL
- Discoverability via `shadcn search`
- A row in the public [Registry Directory](https://ui.shadcn.com/docs/directory)

An index entry is exactly four fields:

```json
{
  "name": "@craftui",
  "homepage": "https://www.craftui.space",
  "url": "https://www.craftui.space/r/{name}.json",
  "description": "…"
}
```

For comparison, the entry that makes `npx shadcn add @skiper-ui/skiper106` work
with zero config (✅ VERIFIED from the live index):

```json
{
  "name": "@skiper-ui",
  "homepage": "https://skiper-ui.com/",
  "url": "https://skiper-ui.com/registry/{name}.json",
  "description": "Brand new uncommon components for your Next.js project…"
}
```

Note their path is `/registry/{name}.json`, not `/r/`. **The URL template is
yours to choose** — this matters later for the free/pro split.

### 1.2 Eligibility, checked against this repo

The documented requirements, and where you stand:

| Requirement | Status |
|---|---|
| Open source and publicly accessible | ✅ today — ⚠️ **at risk if you make the repo private, see 1.3** |
| Valid JSON conforming to the registry schema | ✅ |
| Flat registry, no nested items | ✅ enforced by `assertNoDuplicateNames`, `scripts/build-registry.ts:645` |
| `files` array must NOT include `content` | ✅ your **source** `registry.json` is clean |

**On that last one — do not "fix" your built files.** The requirement applies to
the source `registry.json` you author, not the built output. Your
`public/r/*.json` files embed `content`, and they must, or installs return empty
components. ✅ VERIFIED: `@smoothui`, a listed registry, ships `content` in its
built files too.

**One correction to an earlier assumption:** the docs describe a flat hierarchy
with `/registry.json` served at the root, and `https://www.craftui.space/registry.json`
currently 404s. I initially called this a blocker. It is not — ✅ VERIFIED that
`@shadcn-ui-blocks`, a listed registry, also 404s on `/registry.json`. It's cheap
to add (one extra write target in the build script) and worth doing for
correctness, but it will not block the PR.

### 1.3 The private-repo problem

The stated requirement is *"The registry must be open source and publicly
accessible."* Whether "registry" means **your repo** or **your JSON endpoints**
is genuinely ambiguous, and I don't know how the shadcn team reads it.

What's certain from the live index:

- Paid tiers are **not** disqualifying. `@shadcn-ui-blocks` advertises *"Start
  free, then unlock more with Pro."* `@zippystarter` and `@bundui` are
  commercial too.
- So freemium is accepted in practice. ✅ VERIFIED.

The risk is specifically **a private repo** combined with applying as a
closed-source commercial product.

**→ Recommendation: get listed now, while the repo is public and everything is
free. Add the paid tier afterwards.**

Being an existing directory entry that later introduces a Pro tier is a much
stronger position than applying as a fresh closed-source paid product. The
listing is a one-time PR, and I found no delisting mechanism for registries that
later monetize.

### 1.4 Steps to submit

**Step 1 — Fix registry metadata** in `registry.json:2-4`:

- `name`: `"craftui"` → `"@craftui"` (the namespace form every index entry uses)
- `homepage`: currently the GitHub repo → change to `https://www.craftui.space`.
  This is the link users click from the directory; it should land on the gallery,
  not the source.
- Add an `author` field.
- Add per-item `categories`. These feed `shadcn search`. With 137 items,
  discoverability *is* the point of listing — don't skip this.

**Step 2 — Serve `registry.json` publicly.** In `scripts/build-registry.ts`,
`buildGithubRegistry()` already writes the aggregate file; add a second write
target into `public/`. A few lines. Optional per 1.2, but do it.

**Step 3 — Consider relocating `tier`.** Your built items carry
`"tier": "free"`, which is not a field in the registry-item schema. ✅ VERIFIED
the schema does not set `additionalProperties: false`, so it validates fine and
**will not block the PR**. But `meta` is the sanctioned home for custom data and
is already in your output. Moving it is tidier. Low priority — it touches the
build script plus any site code reading `.tier`.

**Step 4 — Open the PR.**

1. Fork `github.com/shadcn-ui/ui`
2. Add your entry to `apps/v4/registry/directory.json`
3. Run `pnpm validate:registries`
4. Open the PR, wait for team review

⚠️ **The long pole is review latency, which you do not control.** Phases 1.4
steps 1–3 are maybe an hour of work. The PR could sit for a while. Plan the rest
of the roadmap so nothing is blocked on it.

---

## Part 2 — Migrating the install command

### 2.1 What has to be true first

The bare `npx shadcn add @craftui/<name>` **only works once you are in the
index.** Before that, users must add this to their own `components.json`:

```json
{ "registries": { "@craftui": "https://www.craftui.space/r/{name}.json" } }
```

So during the transition your component pages should show:

1. The namespaced command (short, what you want people to share), **and**
2. The one-time `components.json` snippet

You delete the snippet the day the PR merges.

⚠️ **Keep the full-URL form available as a fallback** — it works with zero
config, forever, and it's what someone pasting from a blog post will have.

### 2.2 The real problem: seven copies of the same string

The install command is built by string template in seven separate places:

| File | Line |
|---|---|
| `app/icons/[slug]/[variation]/page.tsx` | 78 |
| `app/loaders/[slug]/page.tsx` | 65 |
| `components/block-gallery/BlockContentPanel.tsx` | 152 |
| `components/block-gallery/BlockPageClient.tsx` | 65 |
| `components/loader-gallery/LoaderContentPanel.tsx` | 124 |
| `components/ui-gallery/UIContentPanel.tsx` | 43 |
| `components/icon-gallery/IconContentPanel.tsx` | 137 |

Every one hardcodes `` `npx shadcn@latest add ${baseUrl}/r/…` ``.

**→ Build one helper — `lib/registry.ts` — and route all seven through it.**

```ts
// shape, not final code
export function installCommand(name: string, opts: {
  tier: "free" | "pro";
  hasAccess: boolean;
}): { command: string; setupSnippet?: string; locked: boolean }
```

This matters more than it looks. Three separate upcoming changes all touch this
exact string: the namespace switch (Part 2), the Pro/free branch (Part 5), and
the paid-user check (Part 5). With seven copies you will edit seven files three
times and miss one. **Do this before the paid tier, not after.**

Good news: your item names are flat and globally unique (`assertNoDuplicateNames`),
so they map onto `@craftui/<name>` with no collisions. No renaming needed.

---

## Part 3 — Turning sign-in back on

Clerk is fully installed and deliberately switched off. Turning it on is
un-commenting plus filling one empty file.

**Step 1 — Re-enable the provider.** `app/layout.tsx:21-29` has the Clerk imports
commented out, and the `<ClerkProvider>` wrapper is commented at the top and
bottom of the JSX return. Uncomment. Note it must wrap **outside**
`ThemeProvider`.

**Step 2 — Re-enable `UserSync`.** Commented at `app/layout.tsx:206`. It pushes
the Clerk user into your zustand store (`lib/store.ts`) so client components can
read auth state without a round trip.

**Step 3 — Check the middleware kill-switch.** `proxy.ts` disables auth entirely
when `NEXT_PUBLIC_CLERK_DISABLED === 'true'`. Make sure that env var is unset in
production. ⚠️ This is a footgun: a stray env var silently turns off all route
protection. Consider inverting it so auth is on unless explicitly disabled in
local dev.

**Step 4 — Write `UserModel.ts`.** It is currently **an empty 0-byte file** at
`app/api/models/UserModel.ts`. This is the foundation for Part 4. Minimum shape:

```ts
{
  clerkId: string;        // indexed, unique — the join key to Clerk
  email: string;
  createdAt: Date;
  // entitlement fields — see Part 4
}
```

Key design point: **Clerk owns identity, Mongo owns entitlement.** Don't try to
store subscription state in Clerk metadata. Keep one `clerkId` as the join key
and let your DB be the source of truth for what someone has paid for.

**Step 5 — Sync on sign-up.** When a user signs up, a row must appear in Mongo.
Two options:

- A Clerk webhook → `app/api/webhooks/clerk/route.ts` → upsert user. Reliable,
  fires even if the user never opens the app again.
- Lazy upsert on first authenticated API call. Simpler, no webhook secret to
  manage, but the row doesn't exist until they do something.

⚠️ Recommend the webhook. Lazy upsert produces confusing gaps when you later
want to email users or count signups.

---

## Part 4 — How payment works (model, not gateway)

Deliberately gateway-agnostic — this is the data model and lifecycle, which stays
the same whichever provider you pick.

### 4.1 The core idea: entitlements, not payments

Do not store "this user paid." Store **"this user is entitled to X until Y."**

A payment is an *event*. An entitlement is *state*. Conflating them is what makes
refunds, expiry, and plan changes painful later.

```ts
// on the user document, or a separate collection
entitlement: {
  plan: "free" | "pro";
  status: "active" | "expired" | "cancelled" | "refunded";
  grantedAt: Date;
  expiresAt: Date | null;   // null = perpetual (one-time purchase)
  source: "purchase" | "manual" | "gift";
}
```

Reading it is then one boolean, everywhere in the app:

```ts
const hasPro = e.plan === "pro"
  && e.status === "active"
  && (e.expiresAt === null || e.expiresAt > new Date());
```

**Write this as one shared function and never inline the check.** It'll be called
from the UI, the API route, and the registry gate — all three must agree.

### 4.2 Lifecycle

```
User clicks "Get Pro"
  → gateway checkout (out of scope)
  → payment succeeds
  → gateway calls your webhook
  → webhook verifies signature          ← critical, see below
  → upsert entitlement: plan=pro, status=active, expiresAt=…
  → user's next request sees hasPro === true
```

Three rules that matter regardless of provider:

1. **The webhook is the source of truth, never the browser redirect.** A user
   landing on `/success` proves nothing — they can navigate there directly. Only
   grant entitlement from a signature-verified server-to-server webhook.
2. **Verify the webhook signature.** An unverified webhook endpoint is a public
   "make me Pro" button.
3. **Make it idempotent.** Gateways retry. Key on the provider's event ID and
   ignore duplicates, or a retry double-extends someone's subscription.

### 4.3 Subscription vs one-time

⚠️ This is a product decision you haven't made yet, and it changes the schema:

- **One-time** → `expiresAt: null`. Simplest. But "lifetime access to all future
  components" is a promise that gets expensive.
- **Subscription** → `expiresAt` set, refreshed on each renewal webhook. Needs
  cancellation and failed-payment handling.
- **Hybrid (common for component libraries)** → pay once, get everything
  published *up to that date*. Needs a `purchasedAt` on the entitlement compared
  against a `publishedAt` on each item. More schema, fairest model.

The entitlement shape above supports all three. Decide before writing the check
function.

### 4.4 Also handle

- **Expiry**: nothing "runs out" on its own. Either check `expiresAt` on read
  (recommended — no cron needed) or run a sweeper job.
- **Refund/chargeback**: webhook sets `status: "refunded"`. Access stops on next
  read.
- **Manual grants**: `source: "manual"` for comps, testers, your own account.
  You will need this on day one.

---

## Part 5 — Enforcement: the two-layer gate

### 5.1 Why the UI gate alone is not enough

The plan of "sign in → check DB → show the install command only if paid" is the
right **UX**, and you should build it. But understand precisely what it does and
doesn't do.

Your registry URLs are **deterministic**: `/r/{slug}-{variation}.json`. Your
galleries publish every slug. Once anyone sees the pattern from a single free
component, the paid URLs are guessable by hand.

And critically: **`public/r/*.json` is served statically.** Next.js returns those
files before any of your code executes. The sign-in check never runs. Repo
visibility is irrelevant — the file is on the CDN, and the full source is in the
`content` field.

**Making the repo private does not gate anything.** It protects source at rest.
It does nothing about a file your own server is publishing.

### 5.2 The fix is small, because you're already writing the logic

You need the same entitlement check in two places:

| Layer | Where | Keyed on | Purpose |
|---|---|---|---|
| **UI** | Gallery pages | Clerk session | Show/hide the command, pitch the upgrade |
| **HTTP** | `app/api/r/[filename]/route.ts` | Bearer token | Actually enforce it |

The route already exists with the TODO in the right place. It currently reads
from `public/r/` — which is the bit that has to change.

### 5.3 The build split

In `scripts/build-registry.ts`:

- **Free items** → `public/r/*.json` as today. Static, CDN-cached, no token,
  publicly installable. **This is what keeps you eligible for the directory
  listing.**
- **Pro items** → a **non-public** directory, e.g. `registry/pro/*.json`. Never
  served statically. Only reachable through the gated route.

The `tier` field the build already emits is the discriminator, so this is mostly
a change to the output path, not a re-architecture.

⚠️ **Critical:** if a pro item ever lands in `public/`, it is public
permanently — assume it's been scraped. Add a build assertion that fails if any
item with `tier: "pro"` was written into `public/r/`. You already have this
instinct in the codebase (`assertOutputComplete`, `assertNoDuplicateNames`) —
same pattern.

### 5.4 The token

The CLI is not a browser and has no Clerk session. It authenticates with a token
the user pastes into their own `components.json`:

```json
{ "registries": { "@craftui": {
    "url": "https://www.craftui.space/r/{name}.json",
    "headers": { "Authorization": "Bearer ${CRAFTUI_TOKEN}" } } } }
```

`${CRAFTUI_TOKEN}` is expanded from their `.env.local` by the shadcn CLI. This is
a **native, documented shadcn feature** — no custom tooling on your side.

You need:

- **Issuing**: generate a token per user, show it on `/dashboard` (route already
  exists and is already protected in `proxy.ts`)
- **Storage**: store a *hash*, not the token itself
- **Lookup**: token → user → entitlement check
- **Revocation**: regenerate button; invalidate on refund

And a genuinely nice touch: **the CLI displays your error response body to the
user.** So a 401 can say:

> This component requires CraftUI Pro. Get your token at craftui.space/pricing

### 5.5 Route logic

```
GET /r/<name>.json  (with optional Authorization header)
  ├─ item is free?           → serve from public/r/            (200)
  ├─ item is pro + no token  → 401 + upgrade message
  ├─ token invalid/revoked   → 401 + "invalid token" message
  ├─ entitlement not active  → 403 + "subscription expired" message
  └─ entitled                → serve from registry/pro/        (200)
```

⚠️ Two operational notes:

- A dynamic route **loses static CDN caching**. Set explicit cache headers on the
  free path so your most-installed components don't hit origin every time.
- Decide whether the listed directory URL points at the static path or the
  dynamic route. Cleanest is `@craftui` (free, static, listed) as one namespace
  and `@craftui-pro` (gated) as a second, never submitted. That keeps the listed
  registry unambiguously "publicly accessible" no matter how the requirement in
  1.3 is interpreted.

### 5.6 What this does not solve

A Pro component installed by a paying customer lands in their repo as plain
source. They can republish it. **The token gates distribution, not
redistribution** — enforcement past that point is licensing, not engineering.
This is true of every registry in this market, including the paid ones already in
the index. Price accordingly and don't over-invest in technical protection.

---

## Recommended sequence

Ordered so nothing blocks on the PR review you don't control:

| # | Step | Depends on | Why here |
|---|---|---|---|
| 1 | `lib/registry.ts` helper, convert 7 call sites | — | Everything else edits this string |
| 2 | Registry metadata fixes + public `registry.json` | — | Small, needed for the PR |
| 3 | **Submit directory PR** | 2 | Do it while public + free. Review is slow — start the clock |
| 4 | Turn Clerk on, write `UserModel.ts` | — | Parallel with PR review |
| 5 | Entitlement schema + check function | 4 | Decide subscription model first (4.3) |
| 6 | UI gate on install command | 1, 5 | Your original idea; ships the pricing UX |
| 7 | Build split free/pro + assertion | 5 | Must precede any real pro item |
| 8 | Token issuing + gated route | 5, 7 | Turns the UI gate into real enforcement |
| 9 | Swap commands to `@craftui/…` | 1, 3 merged | Only after listing lands |

Steps 1–4 are safe to start immediately. **Do not publish a single pro component
before step 7 is done** — a pro item sitting in `public/r/` even briefly should
be treated as permanently leaked.

---

## Open decisions

1. **Subscription, one-time, or hybrid?** (4.3) Changes the entitlement schema.
   Decide before step 5.
2. **One namespace with mixed gating, or `@craftui` + `@craftui-pro`?** (5.5)
   Two namespaces is safer for listing eligibility.
3. **Does the repo actually need to go private?** Given 1.3, and that repo
   privacy provides no protection for served components (5.1), the benefit may be
   smaller than the cost to your directory listing. ⚠️ Worth reconsidering.
4. **Which items become Pro?** Retroactively paywalling something already
   published free will be noticed and screenshotted. Safer to launch Pro with
   *new* components only.

---

## Sources

- [Registry Directory](https://ui.shadcn.com/docs/directory)
- [Registry Index / submission](https://ui.shadcn.com/docs/registry/registry-index)
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [Authentication](https://ui.shadcn.com/docs/registry/authentication)
- [registry.json spec](https://ui.shadcn.com/docs/registry/registry-json)
- Live index: `https://ui.shadcn.com/r/registries.json`
