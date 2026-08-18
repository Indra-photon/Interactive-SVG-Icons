# CraftUI — Registry Listing, Sign-in & Paid Tier

A step-by-step plan covering four things, in the order they should be built:

1. Getting listed in the official shadcn registry directory
2. Migrating install commands to `npx shadcn add @craftui/<name>`
3. Turning the sign-in layer back on
4. Adding the payment/entitlement layer and enforcing it

Written 2026-08-12, last updated 2026-08-14. Everything marked ✅ VERIFIED was
checked against the live shadcn index or this repo. Everything marked ⚠️ is a
judgement call or an assumption you should confirm.

---

## STATUS — read this first

| Step | State |
|---|---|
| 1. `lib/registry.ts` helper, 7 call sites | ✅ **DONE** |
| 2. Registry metadata + serving `registry.json` | ✅ **DONE** |
| 2c. Install-blocking bug fixes + guards | ✅ **DONE** (unplanned, see 2.3) |
| 3. Submit directory PR | 🟡 **SUBMITTED, AWAITING REVIEW** |
| 2b. Per-item `categories` | ⬜ deferred, optional |
| 4–9 | ⬜ not started — **resume here** |

**The open PR:** https://github.com/shadcn-ui/ui/pull/11498 — one file, +7 −0.
Entry validated against the real rules; nothing further is in our control.

Check whether it has landed:

```bash
curl -s https://api.github.com/repos/shadcn-ui/ui/pulls/11498 | grep '"merged":'
curl -s https://ui.shadcn.com/r/registries.json | grep -c '@craftui'   # 0 → 1 when live
```

⚠️ **Merged ≠ live.** The index is served from a deployment, so there is a lag
between the PR merging and the CLI resolving `@craftui`. The `grep -c` is the
check that tells you users can actually install.

**Next action when you pick this up:** Step 4 — turn Clerk on and write
`app/api/models/UserModel.ts` (still a 0-byte file). Nothing about it depends on
the PR.

---

## Part 0 — What you already have

Before planning anything, it's worth being precise about the starting point,
because a lot of this is already built.

| Asset | Where | State |
|---|---|---|
| Registry source of truth | `registry.json` | 136 items ✅ (also served at `public/r/registry.json`) |
| Built registry files | `public/r/*.json` | 142 files ✅ |
| Install-command helper | `lib/registry.ts` | ✅ single source for every command shown on the site |
| Build script | `scripts/build-registry.ts` | duplicate detection, stale-file pruning, case-rename safety, plus four assertions added in 2.3 ✅ |
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

**`registry.json` must be served at the *registry* root, not the site root.**
Requirement 3 says "`/registry.json` and `/component-name.json` in the root of
the registry" — for us the registry root is `/r`, because that is what the `url`
template points at. Checking the wrong path (`craftui.space/registry.json`) made
this look optional; checking the right one showed we were the outlier:

```
smoothui.dev/r/registry.json              200
skiper-ui.com/registry/registry.json      200
chanhdai.com/r/registry.json              200
shadcn-ui-blocks.com/r/registry.json      200
www.craftui.space/r/registry.json         404   ← was the gap, now fixed
```

✅ Fixed in Step 2 — `buildGithubRegistry()` now writes both the repo-root copy
and `public/r/registry.json`.

### 1.2b Three things the docs do not tell you

Learned the hard way while submitting; they cost real time.

**1. `logo` is required in practice.** The published `registries.json` shows four
fields, but the source `directory.json` has five. ✅ VERIFIED: **277 of 277**
entries carry a `logo` — an inline SVG string, attributes single-quoted so it
embeds in JSON without escaping. Submitting without one would likely bounce.

**2. `validate:registries` makes no network calls.** It does *not* fetch your
registry. It is a local zod check of `directory.json` only:

```
name         /^@[a-zA-Z0-9][a-zA-Z0-9-_]*$/
homepage     valid URL
url          must contain the {name} placeholder
description  string
logo         string
```

Your live endpoints still matter — for reviewers and for real installs — but not
for this script. Running it locally means a full monorepo `pnpm install` to
re-derive a five-field type check.

**3. CI runs that validation for you.**
`.github/workflows/validate-registries.yml` triggers on any PR touching
`apps/v4/registry/directory.json`. So the **GitHub web UI is the better
submission route** — same validation, no clone, no `pnpm install`, and web
commits are signed automatically. ⚠️ First-time contributors need a maintainer to
approve the workflow run before it executes.

That workflow also blocks reserved namespaces: `@shadcn`, `@ui`, `@blocks`,
`@components`, `@block`, `@component`, `@util`, `@utils`, `@registry`, `@lib`,
`@hook`, `@hooks`, `@theme`, `@themes`, `@chart`, `@charts`. ✅ `@craftui` is
clear.

**Also worth knowing:** `owner/repo/item` addresses work against any public
GitHub registry with **no submission at all**. The directory listing is
specifically what buys the `@craftui` namespace.

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

### 1.4 Steps to submit — ✅ DONE, recorded for reference

**Step 1 — Registry metadata**, in `buildGithubRegistry()`,
`scripts/build-registry.ts`:

- ❌ **`name` does NOT take an `@`.** An early draft of this plan said to change
  `"craftui"` → `"@craftui"`. That is wrong: the docs' own example uses
  `"name": "acme"`. The `@` form belongs **only** in the directory index entry.
  The build script now carries a comment saying so, to stop it being "fixed".
- ✅ `homepage` → `https://www.craftui.space` (the link users click from the
  directory; it should land on the gallery, not the source).
- ✅ `author` added.
- ⬜ Per-item `categories` — **deferred, this is Step 2b.** They feed
  `shadcn search`. `GithubRegistryItem` has no `categories` field, so it means
  extending the interface and all four builders. Your component `config.json`
  files already carry `category` and `tags`, so the data exists. Not an
  eligibility requirement.

**Step 2 — Serve `registry.json`.** ✅ Done — writes to the repo root *and*
`public/r/registry.json`. See 1.2 for why the path matters.

**Step 3 — Relocating `tier`.** ⬜ Not done, and fine. Built items carry
`"tier": "free"`, not a registry-item schema field. ✅ VERIFIED the schema does
not set `additionalProperties: false`, so it validates and did not block the PR.
`meta` is the sanctioned home for custom data. Tidiness only.

**Step 4 — The PR.** ✅ Submitted via the **GitHub web UI** (see 1.2b #3 — no
clone or `pnpm install` needed): https://github.com/shadcn-ui/ui/pull/11498

The final entry, for reference if it ever needs resubmitting:

```json
{
  "name": "@craftui",
  "homepage": "https://www.craftui.space",
  "url": "https://www.craftui.space/r/{name}.json",
  "description": "Animated, interaction-first components for React: 70+ loaders, interactive SVG icons, plus blocks, sections and UI primitives. Built with Tailwind CSS v4 and Motion, with every animation hand-tuned rather than generated.",
  "logo": "<svg …>"
}
```

The logo is generated from `app/icon.svg` — comments stripped, whitespace
collapsed, double quotes swapped for single. Regenerate it with the one-liner in
2.4 if the mark changes.

**Reading the PR checks** — what is and isn't yours to fix:

| Check | Meaning |
|---|---|
| Signed commits ✅ | Web-UI commits are GitHub-signed automatically |
| Socket Security ✅ | Dependency scanner; a JSON-only diff always passes |
| **Vercel – ui ❌** | *"Authorization required to deploy"* — Vercel won't build previews for outside forks. **Every external PR hits this. Not actionable.** |
| **Validate Registries** *(absent)* | Sits in "N workflows awaiting approval" until a maintainer approves the run. Not a failure. |
| Review required / Merging blocked | Ordinary branch protection |

⚠️ **The long pole is review latency, which you do not control.** Plan the rest
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

### 2.2 The seven copies of the command — ✅ DONE

The install command used to be built by string template in seven places. All now
route through **`lib/registry.ts`**:

```ts
registryItemName(slug, variation)   // "trash-default"
resolveBaseUrl(override?)           // env → window.origin → localhost
registryUrl(name, baseUrl?)
installCommand(name, baseUrl?)
```

`grep -rn "shadcn@latest add" app components` now returns exactly one hit:
`lib/registry.ts`. (Three matches under `components/craftui/ui/accordion/examples/`
are demo copy inside component previews — leave them.)

Converted call sites, for orientation:

| File | Line |
|---|---|
| `app/icons/[slug]/[variation]/page.tsx` | 77 |
| `app/loaders/[slug]/page.tsx` | 64 |
| `components/block-gallery/BlockContentPanel.tsx` | 153 |
| `components/block-gallery/BlockPageClient.tsx` | 66 |
| `components/loader-gallery/LoaderContentPanel.tsx` | 118 |
| `components/ui-gallery/UIContentPanel.tsx` | 44 |
| `components/icon-gallery/IconContentPanel.tsx` | 132 |

Two notes for whoever extends this:

- `resolveBaseUrl()` absorbed **three** different inline derivations. It falls
  back to `window.location.origin` so preview deploys without
  `NEXT_PUBLIC_SITE_URL` don't advertise `localhost`.
- Locals are named `installCmd`, not `installCommand` — the latter shadows the
  imported function.

This is the single seam for the remaining work: the namespace switch (Step 9),
the Pro/free branch and the paid-user check (Steps 6–8) all edit this one file
instead of seven.

Item names are flat and globally unique (`assertNoDuplicateNames`), so they map
onto `@craftui/<name>` with no collisions. No renaming needed.

### 2.3 ⚠️ The bugs a real install found — ✅ FIXED

**Not in the original plan. The most valuable thing in this document.**

The registry passed every static check — valid schema, every URL 200, no inlined
`content` — while **36 of 136 items could not be installed at all.** A manual
`npx shadcn@latest add` is what surfaced it.

**Bug 1 — `"motion/react"` in `dependencies` (36 items, 20 config files).**
That is the *import path*; the package is `motion`. npm reads a bare
`owner/repo` string as GitHub shorthand and tries
`ssh://git@github.com/motion/react.git` → `Permission denied (publickey)`. The
SSH error is a red herring.

**Bug 2 — `feature-ai-01` depended on four items that don't exist.** Its config
pointed at `craftui.space/r/{badge,button,card,separator}-default.json`. Those
are **shadcn base primitives**; they belong as bare names (`"badge"`), which
resolve against the `@shadcn` registry. The item itself fetched fine — the
install died at dependency resolution.

Both shipped silently because neither is a schema violation.

**Guards added** (`scripts/build-registry.ts`, wired in at the build chain):

| Guard | Catches |
|---|---|
| `assertValidDependencies()` | any dependency npm would read as `owner/repo`; scoped `@scope/name` still allowed |
| `assertRegistryDepsResolve()` | self-referencing `/r/<name>.json` with no matching built item (seeded with `UNMANAGED_FILES` so `craftui-base` doesn't false-positive) |
| `assertNoInlinedContent()` | file `content` leaking into the aggregate `registry.json` (requirement 4) |
| `assertNoReservedNames()` | an item named `registry` overwriting the index — invisible to the duplicate check |

Both new guards were verified by re-introducing each bug and confirming the build
dies. **A passing assertion you have never seen fail is not evidence.**

### 2.4 Rules of thumb earned here

1. **Run a real `npx shadcn@latest add` in a scratch project before any
   release.** Nothing else in the pipeline catches install-time breakage.
2. **Rebuild the registry after touching any `components/craftui/**` source.**
   A rebuild revealed `feature-ai-01-default.json` had been serving pre-fix code
   since commit `4dd1630` — the source was edited, the registry never rebuilt.
3. **Use `npm run build:registry`**, never `tsx` directly. It loads `.env`;
   without `NEXT_PUBLIC_SITE_URL` the script bakes `localhost` into every
   `registryDependencies` entry. That has shipped once before — see the comment
   at `resolveBaseUrl()` in the build script.
4. Regenerate the directory logo from `app/icon.svg` when the mark changes:
   strip comments, collapse whitespace, swap `"` for `'`.

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
| ✅ 1 | `lib/registry.ts` helper, convert 7 call sites | — | Everything else edits this string |
| ✅ 2 | Registry metadata fixes + served `registry.json` | — | Small, needed for the PR |
| ✅ 2c | Install-blocking bug fixes + build guards | — | Unplanned; 36 items were broken (2.3) |
| 🟡 3 | **Submit directory PR** | 2 | Submitted — PR #11498, awaiting review |
| ⬜ 4 | Turn Clerk on, write `UserModel.ts` | — | **Resume here.** Parallel with PR review |
| ⬜ 5 | Entitlement schema + check function | 4 | Decide subscription model first (4.3) |
| ⬜ 6 | UI gate on install command | 1, 5 | Your original idea; ships the pricing UX |
| ⬜ 7 | Build split free/pro + assertion | 5 | Must precede any real pro item |
| ⬜ 8 | Token issuing + gated route | 5, 7 | Turns the UI gate into real enforcement |
| ⬜ 9 | Swap commands to `@craftui/…` | 1, 3 merged | Only after listing lands |
| ⬜ 2b | Per-item `categories` | — | Optional; improves `shadcn search` ranking |

Step 4 is safe to start now. **Do not publish a single pro component before step
7 is done** — a pro item sitting in `public/r/` even briefly should be treated as
permanently leaked.

---

## Open decisions

1. **Subscription, one-time, or hybrid?** (4.3) Changes the entitlement schema.
   Decide before step 5.
2. **One namespace with mixed gating, or `@craftui` + `@craftui-pro`?** (5.5)
   Two namespaces is safer for listing eligibility.
3. **Does the repo actually need to go private?** Given 1.3, and that repo
   privacy provides no protection for served components (5.1), the benefit may be
   smaller than the cost to your directory listing. ⚠️ Worth reconsidering —
   especially now that the PR is in review as an open-source registry.
4. **Which items become Pro?** Retroactively paywalling something already
   published free will be noticed and screenshotted. Safer to launch Pro with
   *new* components only.
5. **Should the paid gate live at `app/api/r/[filename]/route.ts` or a new
   route?** That handler already exists and already carries
   `TODO: Add auth check when premium icons are added` — but it currently reads
   from `public/r/`, which is also served statically, so gating it alone changes
   nothing. Whichever route wins must read pro items from a **non-public**
   directory. See 5.3.

---

## Loose ends worth knowing

Not blockers, but they'll bite whoever picks this up.

- **`proxy.ts` has an auth kill-switch.** `NEXT_PUBLIC_CLERK_DISABLED === 'true'`
  disables route protection entirely. ⚠️ Consider inverting it so auth is on
  unless explicitly disabled in local dev — one stray env var currently removes
  all protection silently.
- **`NavBar.tsx:103` trips the React Compiler lint rule** (`setState` inside an
  effect, for collapse-on-route-change). Pre-existing and left alone; fixing it
  means restructuring how the nav closes.
- **The nav pill is tight.** `min(240px, 100vw - 48px)` now holds logo + name +
  `⌘K` chip + theme toggle. First thing likely to break on narrow screens.
- **`app/favicon.ico`** — 26KB Next.js starter default. `app/icon.svg` is the
  real favicon now; delete the `.ico` or browsers may keep serving the old one.
- **Brand assets**, if the mark needs changing: `components/Logo.tsx`
  (`LogoMark` + `Logo`), `app/icon.svg` (simplified for small sizes), and
  `--brand-mark` in `app/globals.css` — light `#24a0ed`, dark `#41a4ff`, derived
  from the homepage CTA's `--gradient-button`. The nav currently renders the mark
  monochrome (`text-nav-foreground`) by choice; the favicon and directory logo
  are blue.

---

## Sources

- [Registry Directory](https://ui.shadcn.com/docs/directory)
- [Registry Index / submission](https://ui.shadcn.com/docs/registry/registry-index)
- [Namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [Authentication](https://ui.shadcn.com/docs/registry/authentication)
- [registry.json spec](https://ui.shadcn.com/docs/registry/registry-json)
- Live index: `https://ui.shadcn.com/r/registries.json`
