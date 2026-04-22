# EH! JADI GA? — Design System

> **"Eh! Jadi ga?"** — Indonesian slang roughly meaning _"Hey! Are we going or not?"_ That spark of spontaneous, hopeful hesitation right before a group chat finally commits to a trip. That _is_ the brand.

EH! JADI GA? is an **Indonesian tour agency** built for Gen Z who plan trips in their group chats and book on their phone. The brand is **humble, playful, but professional** — a friend who knows the good spots, not a corporate travel conglomerate.

---

## Product surface

| Line of business | What it is |
|---|---|
| **Private Trip** | Fully customised itinerary for a group. Pick destination + dates + style. |
| **Open Trip** | Join a public group heading to a scheduled destination. Budget-friendly, great for solo travellers. |
| **Glamping** | Book one of several glamping properties — standalone, or as an **add-on** to a Private Trip. |
| **Corporate Trip** | Company outings, team retreats, offsites. More formal RFP-style flow. |

**Primary surface:** mobile web (Gen Z → phone-first). Desktop is a considered secondary. Native app is _not_ in scope yet.

---

## Sources reviewed

| Source | Path / URL | Status |
|---|---|---|
| Logo mark | `uploads/ejg-mark-primary.svg` → `assets/ejg-mark-primary.svg` | ✅ Used |
| Primary typeface | `uploads/PlusJakartaSans-*.ttf` → `fonts/` | ✅ Used |
| Codebase repo | `github.com/mjohantito/EJG-Website` | ⚠️ **Returned 409 (empty/inaccessible)** — nothing to pull in. Built visual system from brand brief + logo alone. |

> **Caveat:** The GitHub repo `mjohantito/EJG-Website` was inaccessible at build time (409). If there's existing code/Figma for the brand, please re-share it so we can align the UI kit to the real product instead of a fresh visual interpretation.

---

## What's in this folder

| File / folder | Purpose |
|---|---|
| `README.md` | This document. Context, content + visual foundations, iconography. |
| `SKILL.md` | Agent Skills manifest — lets this system be installed as a Claude skill. |
| `colors_and_type.css` | All design tokens as CSS variables. **Start here for any build.** |
| `fonts/` | Plus Jakarta Sans (Variable + Variable Italic). |
| `assets/` | Logos, brand marks, illustrations, icons. |
| `preview/` | Small HTML cards that populate the Design System tab. One card per sub-concept — type, colors, spacing, radii, buttons, chips, form inputs, cards, badges, mobile nav, etc. |
| `ui_kits/website/` | **Marketing website UI kit.** Mobile-web-first. `index.html` runs an interactive click-through prototype of 6 screens: Home → Explore → Trip detail → Booking → Confirmation → Glamping. Open it to play with the flow. Components live in `components.jsx`, per-screen JSX in `screens.jsx`, mock data in `data.js`, styles in `styles.css`. |

### Quick start for a designer/agent

1. `@import` or `<link>` `colors_and_type.css` — tokens + base typography come free.
2. Copy `assets/ejg-mark-primary.svg` and the `fonts/` folder into your project.
3. Lift component patterns from `ui_kits/website/components.jsx` + `styles.css`.
4. Re-read **CONTENT FUNDAMENTALS** and **VISUAL FOUNDATIONS** below before writing copy or picking colors.

---

## CONTENT FUNDAMENTALS — how we write

### Voice in one breath
> A friendly Indonesian local who's been on every trip you're dreaming of, casually texting you back in the group chat. Warm, confident, a bit cheeky. Never salesy, never uses hype words.

### Rules of thumb

**Language:** **Indonesian-first** on primary surfaces; English used naturally for CTAs and tech vocabulary (it's how Gen Z actually talks — _code-switching_ is a feature, not a bug). Never stiff formal Indonesian (`Anda sekalian…`). Use `lo/kamu`, not `Anda`.

**Person:** **"Kamu"** (informal, warm) for the reader. **"Kita"** for the brand + customer together — we're going on this trip _together_. Avoid "kami" (distancing).

**Casing:** Sentence case everywhere. The brand name `EH! JADI GA?` is the only all-caps thing — it _earns_ it by being a spoken exclamation. Headlines use sentence case. Buttons use Sentence case too ("Pesan sekarang", not "PESAN SEKARANG" or "Pesan Sekarang").

**Punctuation:**
- Exclamation points are used but not spammed — one per screen max.
- Question marks as prompts ("Mau ke mana nih?") — they invite, they don't interrogate.
- Em dashes — for conversational asides, like this.
- Ellipses for trailing thought ("Masih mikir…") — _not_ for suspenseful marketing.

**Emoji:** **Very restrained.** Brand voice comes from _words_, not stickers. Occasional use in casual surfaces (confirmation toasts, empty states): 🏕️ 🌋 🏝️ 🚐 — always location/activity, never feelings (no 😍 💯 🔥). **Never** in headlines or legal copy. Buttons are text-only.

**Numbers:** Prices formatted `Rp 1.250.000` (Indonesian dot-separator). Durations as `3H2M` (3 Hari 2 Malam) on cards, full form in body ("3 hari 2 malam").

### Vibe words
_warm • humble • knowing • a bit cheeky • reliable • local • for the grup chat_

### Anti-vibe words
_luxury • curated • elevated • bespoke • unlock • elevate • unforgettable • hidden gem_

### Copy examples

| Surface | ✅ On-brand | ❌ Off-brand |
|---|---|---|
| Hero headline | Mau ke mana nih weekend ini? | Discover Your Next Unforgettable Adventure |
| Subhead | Trip & glamping yang bisa di-split sama grup, tanpa ribet. | Curated luxury experiences for the modern traveler |
| Primary CTA | Liat trip | Explore Now → |
| Secondary CTA | Nanti aja dulu | Skip for later |
| Price | Mulai Rp 650K / orang | Starting at just Rp 650,000!! |
| Empty state | Belum ada trip di sini. Tapi tenang, lagi diracik. | No results found. |
| Confirmation | Sip. Booking kamu udah masuk — kita kabari H-3 ya. | Your booking has been successfully submitted! |
| Error | Waduh, ada yang nyangkut. Coba lagi? | An error occurred. Please try again. |
| Loading | Sabar bentar… | Loading, please wait… |
| Corporate surface | Outing kantor? Kita bantu rancang dari A sampai Z. | Premium corporate travel solutions |

### Tone spectrum by surface
| Surface | Tone | Why |
|---|---|---|
| Hero / marketing | Most playful | Gen Z scroll — hook fast |
| Trip cards | Playful-neutral | Info-dense, stay scannable |
| Booking flow | Warm but clear | Money involved — confidence matters |
| Confirmation / success | Playful again | Relief = celebrate a bit |
| Corporate pages | **Dialed down 40%** | Decision-makers, not group chat |
| Legal / T&C | Plain + correct | No jokes near money and liability |

---

## VISUAL FOUNDATIONS

### 1. Color — four hero colors, nothing else

The brand runs on **four** core colors. That restraint is the system's personality.

| Token | Hex | Role |
|---|---|---|
| `--ejg-ink` | `#252525` | Primary. Ink. Type, primary CTAs, logo fill, nav. Near-black (not pure). |
| `--ejg-matahari` | `#F3D543` | Signature yellow (_matahari_ = "sun"). Accent, highlight, full-bleed hero sections. |
| `--ejg-kertas` | `#EEEAE2` | Warm off-white (_kertas_ = "paper"). Default page background. |
| `--ejg-putih` | `#FFFFFF` | Pure white. Card surfaces against the warm kertas bg. |

**Rules:**
- Default background is `kertas`, _not_ white. White is for cards and elevated surfaces so they pop against the paper.
- **Primary CTA is `ink` on `kertas` or `matahari`.** The combination of black buttons with occasional yellow blocks is the signature look.
- **Matahari is used loudly, not sparingly.** Unlike most brands' accents, yellow is a proper bg option here: full-bleed hero blocks, entire sections, big CTAs. But pair with ink type — never yellow text on light bg (contrast fails).
- **No other hues** except semantic states (success/warning/danger/info — see tokens). No blues, greens, or oranges as decoration.
- **No gradients** between brand colors. Flat color only.
- Supporting neutrals (`ink-soft`, `stone`, `fog`, `kertas-2`) are all warm-tinted — no cold grays.

**Contrast check:**
- `ink` on `kertas`: 13.8:1 ✅
- `ink` on `matahari`: 11.2:1 ✅
- `ink` on `putih`: 15.6:1 ✅
- `matahari` on `ink`: 11.2:1 ✅ (but for _large_ type only, feels uncomfortable at small sizes)

### 2. Type — one family, heavy weight contrast

**Family:** **Plus Jakarta Sans** (variable, 200–800) everywhere. Indonesian-friendly diacritic coverage, geometric but humanist, good at both display and body.

**Rhythm:**
- Display / H1 / H2 → `800` or `700`, tight leading (`1.08–1.2`), negative letter-spacing (`-0.02em`)
- Body → `400`, relaxed leading (`1.6`)
- Eyebrow / tag → `700`, ALL CAPS, `+0.12em` letter-spacing, orange
- Italic is used expressively for _quotes_ and _conversational emphasis_ ("Beneran gitu?") — not for italicising book titles

**Mobile-first scale** defined in `colors_and_type.css`. Minimum body size 16px. Tap targets always ≥ 44px.

### 3. Spacing — 4px base, generous
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96. Mobile screens breathe. Vertical rhythm typically `--sp-8` between sections, `--sp-4` within cards.

### 4. Backgrounds
- **Default:** flat `--ejg-kertas`. The default for 90% of surfaces.
- **Hero / feature sections:** full-bleed photo — always a real travel photograph, never illustration, never stock-grin people. Protection gradient is a bottom-aligned `linear-gradient(180deg, transparent 0%, rgba(26,26,26,0.6) 100%)` when text sits on photo.
- **Subtle textures:** a very faint repeating paper-grain noise at 3% opacity is allowed on large hero blocks. Never on cards.
- **No gradients** between brand colors. Flat color + photography only.

### 5. Imagery
- **Warm and golden-hour biased.** The yellow brand color is a _cue_ — photos should feel like they were taken in that same warm light.
- Grain/film feel preferred over crisp digital-sharp. Slight desaturation is fine.
- **People** in photos are candid, mid-laugh, mid-walk — _never_ posed looking at camera. Backs-of-heads, feet-on-ground, shared-meals. Shows trips as they _feel_.
- Placeholder convention when a real photo isn't available: solid `--ejg-matahari` block with ink-colored label.

### 6. Cards
- Background `#FFFFFF` (pure white) on `kertas` body — gives a subtle paper-on-paper layer.
- Border: **1px solid `--ejg-fog`** (always a border, not shadow-only — we like the "stamped" feel).
- Radius: `--r-lg` `20px` — soft but clearly rectangular.
- Shadow: `--shadow-sm` resting, `--shadow-md` on hover. Never more than `--shadow-lg`.
- Padding: `--sp-4` mobile, `--sp-6` desktop.

### 7. Borders & dividers
- Primary border color: `--ejg-fog` `#E2DCCB`.
- Dividers between list items: `1px solid --ejg-fog`. Hairlines only.
- Stronger border `--border-strong` for form inputs on focus-out.

### 8. Corner radii — a ladder
- Chips, small buttons, pill filters: `--r-pill` (fully rounded)
- Primary buttons: `--r-md` `14px` — rounded but rectangular
- Cards: `--r-lg` `20px`
- Hero / image blocks: `--r-xl` `28px`
- Modal sheets: `--r-2xl` `36px` top-only (bottom sheet)

### 9. Shadows
- **Low and soft only.** See tokens: `xs / sm / md / lg`. No neon glow, no colored shadow, no stacked 6-shadow "glass" effects.
- Shadow color is always ink-tinted (`rgba(26,26,26,…)`), not pure black.

### 10. Animation
- **Easings:**
  - `--ease-out-soft` (default) for most enter/leave
  - `--ease-spring` (subtle, _0.34, 1.56, 0.64, 1_) for playful moments — trip card hover, toggle switches, success toasts
- **Durations:** `120ms / 200ms / 360ms`. Never longer than 500ms except hero parallax.
- **Fades preferred over slides** for content swaps. Page transitions: 200ms cross-fade.
- Bouncy spring is _seasoned_ in carefully — never on every button.

### 11. Hover / press states
- **Hover:** primary buttons darken to `primary-hover` (6% darker). Cards lift with `shadow-md` + `translateY(-2px)`. Links underline on hover.
- **Press:** buttons `scale(0.97)` + darker `primary-press`. Cards no transform on press, just ink-tint the background 2%.
- **Focus ring:** `--ring` — 3px forest-tinted halo, always visible for keyboard users.

### 12. Transparency & blur
- Used sparingly. Only on:
  - Sticky nav after scroll: `rgba(245,241,232,0.8)` + `backdrop-filter: blur(14px)`.
  - Bottom-sheet scrim: `rgba(26,26,26,0.5)` — no blur on scrim (perf, mobile).
- Never on cards, buttons, or text surfaces.

### 13. Layout rules
- **Mobile-first breakpoints:** `< 640px` (mobile), `640–1024px` (tablet), `≥ 1024px` (desktop).
- **Mobile gutter:** `--sp-5` (20px). **Desktop max width:** `1200px` centered with `--sp-8` gutters.
- **Sticky elements:** bottom primary-action bar on mobile booking flows (safe-area-inset-bottom aware). Sticky top nav on scroll.
- Content never touches viewport edge on mobile.

### 14. Protection devices
- **Gradient protection** on photo + text compositions (see §4).
- **Capsule pills** for metadata over photos (e.g. "3H2M" badge) — pure white bg, ink text, `--r-pill`, `--shadow-sm`.

### 15. Iconography — see next section

---

## ICONOGRAPHY

### Approach
**Line icons, 1.75px stroke, rounded caps and joins, 24×24 grid.** Friendly geometry. Never filled-solid by default. Never two-tone.

### Icon source
**Lucide** (MIT, CDN-available: `https://unpkg.com/lucide@latest`) — matches our stroke-weight and rounded-cap philosophy better than Heroicons (which are square-cap).

> **Substitution flagged:** Lucide is used as a stand-in. If there's an existing EJG icon set in a future Figma file, swap it in and remove the CDN.

### Usage rules
- **Size:** 20px inline with body text, 24px in nav, 28–32px in cards / feature blocks, 48–64px in empty states.
- **Color:** `currentColor` — icons inherit text color. Accent-color icons (orange) reserved for one-off highlights (like price icons).
- **Stroke:** use the library default (`1.75` round). Do not scale stroke-width manually.
- Pair with a text label whenever possible — icon-only nav is only allowed with `aria-label`.

### Emoji
**Very restrained** — see Content Fundamentals. Used as _accent_ on casual surfaces only: 🏕️ 🌋 🏝️ 🚐. Never in type-heavy UI, never in buttons.

### Unicode decorative chars
Allowed sparingly: `→` (arrows after CTAs), `•` (inline separators), `·` (for dates like `17 Mei · 3H2M`). Never typographic quotes (`""`) in UI — real quote characters (`""`).

### Logo / mark
The primary mark (`assets/ejg-mark-primary.svg`) is a **geometric interrobang** — an exclamation mark plus a question mark, fused. Captures the brand promise (spontaneous decision + uncertainty) in one glyph.

- **Minimum size:** 24px tall in UI, 32px on marketing.
- **Clear space:** at least the width of the `!` bar on all sides.
- **Color:** default ink (`#1A1A1A`). On dark backgrounds, use `--ejg-kertas`. A forest-colored variant is acceptable for the rare sticker / stamp context.
- **Never:** rotate, stretch, add a gradient, place on a busy photo without protection.

---

## Tokens cheat-sheet

```css
/* Core four */
--ejg-ink              #252525   /* primary — CTAs, type, logo */
--ejg-matahari         #F3D543   /* signature yellow — accent + hero blocks */
--ejg-kertas           #EEEAE2   /* warm off-white — default bg */
--ejg-putih            #FFFFFF   /* pure white — card surface */

/* Surfaces */
--bg                   var(--ejg-kertas)
--surface              var(--ejg-putih)
--border               #DDD6C8   /* fog */
--fg-1                 var(--ejg-ink)
--fg-2                 #3A3A3A   /* body */
--fg-3                 #7A756B   /* meta */

/* Corners */
--r-md                 14px      /* button */
--r-lg                 20px      /* card */
--r-pill               999px     /* chip */

/* Motion */
--ease-spring          bounce
--dur-base             200ms
```
