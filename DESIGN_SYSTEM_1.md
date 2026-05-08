# Joon Design System

> This file is the single source of truth for Claude Code.
> Read this before writing any component, layout, or style.
> All values here are locked — do not invent new colors, sizes, or spacing.

---

## Fonts

Two fonts only. No exceptions.

| Use case | Family | Import |
|---|---|---|
| All UI text | Inter | Already in project |
| Code, IDs, dates, versions, numbers in tables | JetBrains Mono | Already in project |

**Never use Geist, system-ui, or any other font family.**

---

## Type Scale

Every text node in the product uses one of these 12 styles. No other sizes, weights, line heights, or letter spacings are permitted.

| Token | Family | Weight | Size | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `--type-display` | Inter | Bold | 46px | 46px | -0.03px | Hero stat numbers (e.g. "730") |
| `--type-stat-num` | Inter | Bold | 30px | 34px | -0.02px | Metric tile numbers (e.g. "98") |
| `--type-stat-unit` | Inter | Bold | 18px | 24px | -0.02px | Metric tile units (e.g. "%" "h") |
| `--type-heading` | Inter | Medium | 18px | 24px | 0px | Card titles, section headings |
| `--type-body` | Inter | Regular | 12px | 18px | -0.2px | Default body text, nav items, labels |
| `--type-body-medium` | Inter | Medium | 12px | 18px | -0.2px | Emphasized labels, active nav, subtitles |
| `--type-body-semibold` | Inter | Semi Bold | 12px | 18px | -0.2px | Data values, counts |
| `--type-caption` | Inter | Regular | 10px | 16px | -0.2px | Timestamps, deltas, secondary info |
| `--type-caption-medium` | Inter | Medium | 10px | 16px | -0.2px | Keyboard shortcuts, small badges |
| `--type-mono` | JetBrains Mono | Regular | 12px | 18px | -0.2px | Task IDs, dates, version strings |
| `--type-mono-medium` | JetBrains Mono | Medium | 12px | 18px | -0.2px | Numeric data in tables |
| `--type-mono-small` | JetBrains Mono | Regular | 10px | 16px | -0.2px | Version numbers, small codes |

**Rules:**
- Font sizes are even numbers only: 10, 12, 18, 30, 46
- Never use fractional sizes (11.5px, 12.1px etc.)
- When a stat tile shows "98%" — "98" is `--type-stat-num` (30px), "%" is `--type-stat-unit` (18px) in the same text layer
- **Pick from the 12 tokens above. Never roll a custom font / weight / size combination.** If you can't find a match, the right answer is to either pick the closest token or raise the question — not invent a new one inline. The shared style fragments at the top of `src/app/detection/page.tsx` (`T_HEADING`, `T_BODY`, `T_BODY_MED`, `T_BODY_SEMI`, `T_CAPTION`, `T_CAPTION_MED`, `T_MONO_SMALL`, `T_MONO_MED`, `T_DISPLAY`, `T_STAT_NUM`, `T_STAT_UNIT`) implement these tokens — use them in inline styles instead of typing `fontFamily / fontWeight / fontSize / lineHeight / letterSpacing` by hand.

### Component → token assignments

Spelled out so future code lands on the right token without guessing:

| Element | Token |
|---|---|
| StatusBar identity title ("Detection Engineering · Dawn") | `--type-body` (Inter Regular 12px) |
| StatusBar status label ("Active") | `--type-body` |
| StatusBar ⌘K kbd chip | `--type-caption` |
| StatusBar "Last 7 days" pill button label | `--type-body-medium` |
| StatusBar "Updated 2h ago" | `--type-body` |
| Sidebar nav item label | `--type-body` (active state same weight, darker color) |
| Sidebar "Workspace" section label | `--type-body-medium` |
| Sidebar `v0.43.2` version | `--type-mono-small` |
| Card title | `--type-heading` |
| Card subtitle | `--type-body` |
| Stat tile number ("98") | `--type-stat-num` |
| Stat tile unit ("%", "h") | `--type-stat-unit` |
| Stat tile caption | `--type-body` |
| Hero display number ("730") | `--type-display` |
| Delta badge ("↑ +7%") | `--type-caption` |
| Workload group label | `--type-body-medium` |
| Workload child id (DET--730) | **ID Pill** — `--type-mono-small` font, **animated shimmer text fill**: `background-image: linear-gradient(90deg, #9747FF 0%, #B67EFF 50%, #9747FF 100%)` + `background-size: 200% 100%` + `animation: joon-shimmer 2.5s linear infinite` clipped to text via `background-clip: text` + `-webkit-text-fill-color: transparent`. The lighter purple peak sweeps left → right across the ID, matching the description's shimmer. Two-element structure: an outer wrapper that paints the gradient border, and an inner pill with the actual content. **Outer wrapper:** `display: inline-block; padding: 1; border-radius: 999; background: linear-gradient(90deg, rgba(151,71,255,0.15), rgba(204,165,255,0.15))` (15% opacity gradient `#9747FF → #CCA5FF`). The 1px padding is what makes the gradient visible as a border ring. **Inner pill:** `display: flex; padding: 2px 8px; gap: 4; border-radius: 999`, with `background-color: #1a1c22` (= `--bg-card`, the Card's bg) plus `background-image: linear-gradient(rgba(151,71,255,0.05), rgba(151,71,255,0.05))` layered on top. The visual result is identical to a single `rgba(151,71,255,0.05)` painted over the Card bg, but the inner pill is now **fully opaque** — that's required because the inner sits on top of the outer wrapper's gradient, and a semi-transparent inner would let the gradient bleed through and darken the fill. Don't simplify back to `background: rgba(151,71,255,0.05)`. Don't try to do this with `border: 1px solid <gradient>` or layered backgrounds clipped to `padding-box / border-box` either — `border-image` doesn't honor `border-radius` for rounded shapes, and layered clips still blend in the inner area. **The gradient border is an explicit exception to the "no borders on containers" rule** — this pill is intentionally treated as an identity tag with brand styling. Don't generalize the exception or the wrapper-with-padding technique. |
| Workload child name ("Detection WN-730") | `--type-body` with **animated left-to-right shimmer text**: `background-image: linear-gradient(90deg, rgba(255,255,255,0.25) 0%, #FFF 50%, rgba(255,255,255,0.25) 100%)` + `background-size: 200% 100%` + `animation: joon-shimmer 2.5s linear infinite` + `background-clip: text` + `-webkit-text-fill-color: transparent`. The gradient's bright peak (full white) sweeps left → right across the text continuously, signaling that the workload is in progress. Baseline (25% white) on either side lets the peak read as a moving highlight. Note: Figma exports may show line-height `17.4` / letter-spacing `-0.195` — that's noise; map to the canonical `--type-body` (18 / -0.2). |
| Workload child **status** ("Validating…", "Rule_generation…") | `--type-caption` + `color: var(--green)` + `width: 94px; flex-shrink: 0` — green sans-serif, fixed-width column so all status labels align across rows. Note: Figma exports may show line-height `15.95` / letter-spacing `-0.195` — that's noise; map to the canonical `--type-caption` (16 / -0.2). |
| Workload child time ("1h 36min") | `--type-mono-small` |
| Last Covered row name | `--type-body` |
| Last Covered date | `--type-mono-small` |
| Last Covered "Deployed" pill | `--type-caption-medium` |
| Heatmap column header — category ("Reconnaissance") | `--type-body` w/ `--text-secondary` |
| Heatmap column header — percentage ("72%") | `--type-body` w/ `--text-primary` |
| Heatmap cell — technique id ("T1595") | `--type-body` w/ `--text-primary` (white for legibility on tier-tinted bg) |
| Heatmap cell — technique name ("Active Scanning") | `--type-caption` w/ `--text-secondary` |
| Heatmap legend label ("100%", "75%"...) | `--type-caption` w/ `--text-secondary` |
| ~~Heatmap tooltip "93%"~~ | _retired — replaced by the column-header + cell layout_ |
| ~~Heatmap tooltip technique id (T1190)~~ | _retired_ |
| ~~Heatmap tooltip technique name~~ | _retired_ |

### Known exceptions (allowed, don't expand)

These are the *only* places where text breaks the type scale. New code must not add to this list without a design-system update.

| Element | Style | Why |
|---|---|---|
| Sidebar "joon" wordmark | Inline SVG, rendered at **78 × 20** (`viewBox="0 0 90 23"`, scaled down from native 90×23 to maintain aspect ratio at height 20), white fills, `margin: 8px 6px 8px 10px`, `padding: 6px 6px 6px 4px`, `display: inline-flex` | Brand mark — vector asset, not text. Lives inline in `page.tsx` so it travels with the self-contained file. Don't refactor to a `<Image>` import unless the asset gets reused elsewhere. When changing the rendered height, scale width proportionally (`width = round(height × 90/23)`) so the logo doesn't distort. |
| Sidebar nav-row avatar initials (only for items without an `avatarUrl`) | Inter Medium 8px / line-height 1 | The 16×16 circle won't fit a 10px label; 8px is pragmatic. **Most sidebar nav rows now use an `avatarUrl` instead of initials** — initials are the fallback when no image is assigned. |

---

## Colors

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `--bg-page` | `#0f1116` | Outermost page background |
| `--bg-base` | `#1e2026` | **Sidebar (left rail) only.** |
| `--bg-card` | `#1a1c22` | **Top-level cards in MainContent — Card surfaces and the floating StatusBar.** |
| `--bg-elevated` | `#1e2026` | **Inner Card surfaces** — every card-shaped element nested inside a top-level Card (stat tiles, expanded queue groups, Last Covered rows, Teamwork rows, heatmap tooltip). Same value as `--bg-base`; kept as a separate token so the call site states intent (sub-card vs sidebar). |
| _(no token, raw hex)_ | `#1f2126` | StatusBar action pill buttons (⌘K kbd chip, "Last 7 days" date button). One shade brighter than `--bg-elevated` so action buttons read as interactive against the StatusBar surface. Kept as raw hex for now — promote to a token if reused elsewhere. |
| `--bg-icon` | `#292b31` | Icon button background; also active sidebar nav item |

> Brightness hierarchy: `bg-page (#0f1116) < bg-card (#1a1c22) < bg-base / bg-elevated (#1e2026)`. The page is darkest, top-level cards are slightly lighter and float in front of it, and the sidebar + Inner Cards share the lightest tier so they read as "elevated chrome". Sidebar and Inner Cards intentionally use the same hex — but use the right token at the call site (`--bg-base` for the rail, `--bg-elevated` for nested sub-cards).
>
> **Don't mix these up.** `--bg-card` is the card color (matches its name). `--bg-base` is reserved for the sidebar — the name is legacy. If you find yourself reaching for `--bg-base` for anything other than the sidebar, you're probably looking for `--bg-card`.

### Borders

**Borders are reserved for buttons and action-items only.** Cards, sub-cards, the sidebar, the StatusBar, badges, avatars, list rows, and tooltips render with **no border** — depth comes from background color alone.

| Token | Hex | Usage |
|---|---|---|
| `--border` | `#23252a` | Button outlines (icon buttons, pill buttons, kbd chips) — NOT for cards |
| `--border-subtle` | `rgba(255,255,255,0.02)` | Sidebar icon-button outlines (very faint) — NOT for cards |
| `--border-input` | `#2d3038` | Input field borders |

> Decorative ring effects (e.g. the bg-card ring around overlapping Teamwork avatar pips) are not "borders" in the design-system sense — they're visual offsets and are allowed. The StatusBar "Active" dot uses `box-shadow` rather than `border` for its halo — see StatusBar → Status indicator dot for why.
>
> **Registered border exception (1):** the Workload child ID pill (`< > DET--730` with gradient text) uses a 1px **gradient** border (`#9747FF → #CCA5FF` at 15% opacity) implemented as an outer wrapper with `padding: 1` and the gradient as `background`, holding the inner content pill. This is one of two non-button container borders allowed in the system; do not generalize the wrapper-with-padding technique to other identity tags without an explicit design-system update.
>
> **Registered border exception (2):** the **Floating Status Pills** (the two glass pills that replace the StatusBar in scrolled state — see StatusBar → Scrolled state below) each carry `border: 1px solid #23252a` (`var(--border)`). The 1px outline is what gives the translucent gradient + backdrop blur enough definition to read against arbitrary content scrolling underneath. These pills act as floating chip containers for action items (avatar/identity on the left; ⌘K, date button, refresh on the right) — the pill IS the action surface, so it gets a button-tier border. Only the two pills get this treatment; don't generalize to other floating containers.

### Text

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#f2f4f7` | Primary text |
| `--text-secondary` | `#b4b9c2` | Secondary text, nav items, labels |
| `--text-tertiary` | `#858a94` | Muted text, placeholders, metadata |
| `--text-disabled` | `#5e6370` | Disabled states, version numbers |

### Brand — Green (primary accent)

| Token | Hex / Opacity | Usage |
|---|---|---|
| `--green` | `#03d07d` | Delta badges, success text, active indicators |
| `--green-bg` | `#03d07d` at 5% | Badge backgrounds |
| `--green-stroke` | `#03d07d` at 25% | Badge borders |
| `--heatmap-100` | `#07d582` at 100% | Heatmap — full coverage |
| `--heatmap-50` | `#07d582` at 50% | Heatmap — partial |
| `--heatmap-25` | `#07d582` at 25% | Heatmap — low |
| `--heatmap-10` | `#07d582` at 10% | Heatmap — minimal |
| `--green-deep` | `#154a3a` | Deployed badge background |

#### Heatmap tiers — DetectionCoverageHeatmap

Each tier pairs a cell background with a 2px accent-bar color. Add a new tier by extending **both** `tokens.css` and the `HEATMAP_TIERS` map in `src/app/detection/page.tsx`.

| Tier | `--heatmap-tier-*-bg` | `--heatmap-tier-*-bar` |
|---|---|---|
| `100` | `#163931` | `#03d07d` |
| `75`  | `#17322d` | `#0aa467` |
| `50`  | `#182a29` | `#117852` |
| `25`  | `#192326` | `#174c3c` |
| `0`   | `#11181a` | `#0c261e` |
| empty (no detection) | `--heatmap-empty` `#17191f` | — (no bar rendered) |

~~`--heatmap-100` `#07d582` / `--heatmap-50` rgba(7,213,130,0.50) / `--heatmap-25` rgba(...0.25) / `--heatmap-10` rgba(...0.10)~~ _retired 2026-05-08_ — single-hue opacity scale used by the previous flat-tile heatmap. Tokens still exist in `tokens.css` for back-compat but are not referenced; remove on the next pass.

### Accent — Blue

| Token | Hex | Usage |
|---|---|---|
| `--blue` | `#2684ff` | Jira connector, links, blue delta badges |
| `--blue-bg` | `#2684ff` at 5% | Blue badge backgrounds |
| `--blue-mid` | `#4a90e2` | Stacked bar — drafts segment |
| `--blue-light` | `#6993be` | Stacked bar — proposals segment |

### Accent — Purple

| Token | Hex | Usage |
|---|---|---|
| `--purple` | `#9747ff` | Accent where needed |
| `--purple-bg` | `#9747ff` at 5% | Purple badge backgrounds |

### Semantic

| Token | Hex | Usage |
|---|---|---|
| `--red` | `#da1b1b` | Errors, destructive actions |
| `--white-5` | `rgba(255,255,255,0.05)` | Subtle overlays |
| `--white-2` | `rgba(255,255,255,0.02)` | Very subtle overlays |

---

## Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| `--card-padding` | `20px` | Card padding — all four sides uniform |
| `--card-radius` | `16px` | Top-level card border radius (outer surfaces) |
| `--card-radius-inner` | `8px` | Inner element border radius (panels nested inside a top-level card) |
| `--card-radius-sub` | `4px` | Sub-element border radius (chips, pills, list rows, very small surfaces) |
| ~~`--card-border`~~ | _retired_ | Cards have no border — see Borders section. Token may still exist in tokens.css for now but should not be referenced in new code. |
| `--card-title-gap` | `0px` | Gap between card title and subtitle |
| `--section-gap` | `12px` | Gap between every floating card / row in MainContent (single canonical gap, top-level cards only). Sub-card layouts **inside** a Card — stat tile 2×2 grid, Total Rules ↔ stat-grid body grid, etc. — use `8px`. |
| `--shell-padding` | `12px` | Frame gutter around the whole app — applied as `padding: 0 12px` on the outer shell (horizontal), `marginY: 12` on the sidebar, and `paddingY: 12` inside `<main>` (vertical inside scroll). |
| `--shell-gap` | `20px` | Gap between sidebar and main content area — internal separator, deliberately larger than the frame gutter. |
| `--main-max-width` | `1400px` | MainContent max width (centered horizontally beside sidebar) |
| `--sidebar-width` | `280px` | Left sidebar fixed width |
| `--statusbar-padding` | `16px 20px` | StatusBar internal padding (vertical horizontal). Was named `--topbar-min-padding` until the component was renamed to StatusBar. |
| `--icon-btn-size` | `34px` | Icon button container (width + height) |
| `--icon-btn-radius` | `100px` | Icon button border radius |
| `--icon-size` | `16px` | Icon size inside button |
| `--nav-item-height` | `30px` | Sidebar nav item height |
| `--badge-radius` | `999px` | Badge / pill border radius |

---

## Page Layout

The detection page is a single self-contained file. There is **no `layout.tsx`** for `/detection` — sidebar, StatusBar, and content all live in `src/app/detection/page.tsx`.

### Outer shell

```
display: flex
height: 100vh
overflow: hidden
padding: 0 0 0 12px      /* left frame gutter only — right is 0 so the MainContent scroll meets the viewport edge */
gap: 20px                /* gap between sidebar and MainContent (kept at 20 — internal separator, not part of the frame) */
background: var(--bg-page)
```

Two flex children: `<Sidebar />` then `<MainContent />`. Outer is `overflow: hidden` so the page itself never scrolls — only MainContent scrolls.

**Frame gutter is 12px, applied via different elements depending on side. The split is so MainContent's scrollbar meets the viewport edge while the content inside still reads as 12px-inset:**

- The **outer shell** owns the *left* gutter via `padding: 0 0 0 12px`. Right padding is 0 so the MainContent wrapper (and its scrollbar) reaches the viewport's right edge — no visible gap on the right.
- The **sidebar** owns its own *vertical* gutter via `marginTop: 12; marginBottom: 12`. It floats with 12px from the viewport top/bottom and stays in place while MainContent scrolls.
- The **MainContent wrapper** has no vertical margin/padding and extends the full 100vh — that way its scroll boundary is the viewport edge.
- The **inner `<main>`** owns the vertical gutter AND the right-side gutter for the content via `paddingTop: 12; paddingRight: 12; paddingBottom: 12`. At rest, the first card sits 12px below the viewport top; when scrolled, that 12px scrolls away and the card extends all the way up to the viewport edge before clipping. The `paddingRight: 12` keeps cards 12px off the viewport's right edge — it lives on the inner `<main>` (not the wrapper) so the scrollbar stays flush at the viewport edge while the content reads as inset.

Don't put `padding-y` or `padding-right` on the outer shell or on the wrapper — both push the scrollbar inward, leaving a visible gap between the scrollbar and the viewport edge. The right gutter belongs on the inner `<main>` only.

### Sidebar (left rail — fixed, not scrolling)

```
display: flex
width: 280px
flex-direction: column
align-items: flex-start
gap: 4px
flex-shrink: 0
align-self: stretch                /* fills the shell's content height */
margin-top: 12px                   /* vertical frame gutter — owned here, not on outer shell */
margin-bottom: 12px
background: var(--bg-base)         /* #1e2026 — the lighter rail color */
border-radius: 16px
/* no border — depth comes from bg-base vs bg-page */
```

The sidebar is a floating card. Stays put while MainContent scrolls. Each direct child needs `align-self: stretch` (because the parent uses `align-items: flex-start`, children won't stretch by default).

Internal sections, top to bottom:
1. **Brand row** — `min-height: 56px; padding: 8px 10px`. "joon" wordmark left, two icon buttons (Search, Plus) right at 34×34, `background: rgba(255,255,255,0.02)`, `border: 1px solid rgba(255,255,255,0.02)`, icons at 14×14.
2. **Primary nav** — `padding: 0 8px; gap: 4px`. Nav items: `height: 30px; padding: 5px 8px; border-radius: 5px; gap: 10px`. Active item: `background: var(--bg-icon)` + text `var(--text-primary)`. Section nav rows use a 16×16 avatar circle on the left, holding a person's photo. Mapping: Detection → `/Avatar_Sean.png`, Investigation → `/Avatar_Helen.png`, Hunting → `/Avatar_Helen.png`, Validation → `/Avatar_Valery.png`. Pass via `avatarUrl` on `<NavRow>`. Avatar circle: `width: 16; height: 16; border-radius: 50%; background-color: #1a1c22 (fallback); background-image: url(...); background-size: cover; background-position: center`. If no avatar is available, fall back to `initials` (8px Inter Medium centered in the circle).
3. **Workspace section** — `padding: 18px 8px 0`. Header row with "Workspace" label (Inter Medium 12px `var(--text-tertiary)`) + ChevronDown 10×10. Three nav items (Customer Profile / Memory / Settings) using Lucide icons.
4. **Spacer** — `flex: 1; align-self: stretch`.
5. **Bottom row** — `padding: 6px 8px 8px; gap: 6px`. Collapse icon button + version string `v0.43.2` (JetBrains Mono 10px `var(--text-disabled)`, `margin-left: auto`).

### MainContent (center column — scrolls)

```
/* Outer wrapper — extends the full 100vh so its scroll boundary is the viewport edge */
flex: 1 0 0
min-width: 0
overflow-y: auto
display: flex
justify-content: center
/* NO vertical margin / padding here — that's what lets content scroll to the viewport edge */

/* Inner <main> — the actual centered column. Owns the scroll's vertical gutter
   AND the right-side content gutter (since the outer shell has no right padding). */
display: flex
width: 100%
max-width: 1400px              /* canonical content width */
flex-direction: column
align-items: flex-start
gap: 12px                      /* canonical gap between top-level cards / row groups */
padding-top: 12px              /* 12px breathing room before the first card at rest */
padding-right: 12px            /* keeps cards 12px off the viewport's right edge while the wrapper's scrollbar stays flush at the edge */
padding-bottom: 12px           /* same below the last card */
```

The `padding-top` / `padding-bottom` on `<main>` is part of the **scroll content**, not the frame. At rest you see 12px of page bg above the first card; as the user scrolls down, that 12px scrolls away and the first card extends all the way to the viewport top before it gets clipped. Same on the bottom. (Earlier versions put `padding-y` on the outer shell — that inset the scroll container and chopped cards inside the gutter; don't reintroduce that.)

The 12px gap applies to **every** card-to-card / row-to-row step inside MainContent — between the StatusBar, between cards, between row groups, between the two columns of a side-by-side row, and between cards stacked in a sub-column. **Any sub-card layout inside a top-level Card uses a smaller `8px` gap** — this includes the 2×2 stat tile grid inside Health & Performance *and* the body-level grid that splits the Total Rules Inner Card from the stat tile grid (i.e., the `gridTemplateColumns: "640px 1fr"` row). Treat 8px as the canonical inside-a-card gap; reach for 12px only at the MainContent (between top-level cards) level.

Children that should fill the full 1400px need `align-self: stretch` (because of `align-items: flex-start`). **Per-card width caps:** ProposalDrivers and Teamwork cards each have `max-width: 600px` set on their `<Card>` style. The Active Workload row uses `gridTemplateColumns: "1fr 600px"` — the right column is fixed at `600px` (where Proposal Drivers + Teamwork stack), and Active Workload Queue takes the remaining `1fr`, growing flexibly with MainContent's width. The bottom Last Covered + Heatmap row uses `gridTemplateColumns: "minmax(0, 469fr) minmax(0, 625fr)"` — the `minmax(0, ...)` is mandatory because the Heatmap card has very wide intrinsic content (14 × 145px columns ≈ 2150px) and a plain `469fr 625fr` would let the heatmap column blow past its allocation.

> **`minmax(0, fr)` rule:** any grid row containing a card whose content can exceed the column's width (horizontal scroll, very long table, etc.) must use `minmax(0, ...fr)` instead of plain `1fr` / `Nfr`. CSS Grid's default `1fr` resolves to `minmax(auto, 1fr)`, where `auto` honors the item's min-content — and a horizontal-scroll card's min-content is its full unwrapped content. `minmax(0, ...)` overrides that. Pair with `min-width: 0` on the card itself (passed via the `style` prop) for defense in depth — the heatmap's `<Card>` does this. Without both, the inner `overflow-x: auto` never fires because the parent has already grown to fit.

### StatusBar (inside MainContent, scrolls with content)

> Previously named "Topbar" — renamed because the component is a status indicator (avatar, identity, status dot, ⌘K, date range, "Updated 2h ago"), not a navigation bar.

#### Action pill buttons (right side)

The ⌘K kbd chip and the "Last 7 days" date button share a common pill spec — they're the same kind of button at different content widths.

```
display: flex
padding: 8px 10px                         /* uniform 8px vertical / 10px horizontal */
align-items: center
justify-content: center
gap: 6px                                  /* between icon + label + chevron in the date button */
border-radius: 100px
border: 1px solid #23252a                 /* var(--border) — buttons can have borders */
background: #1f2126                       /* slightly brighter than Inner Card #1e2026 — these are interactive surfaces */
```

Don't set an explicit `height` — the padding + content height defines it. Don't use `#1e2026` for the bg (that's the Inner Card / sidebar color); these action buttons are intentionally one shade brighter so they read as interactive against the StatusBar's `#1a1c22` surface.

The StatusBar is **not** edge-to-edge or sticky. It is a floating card at the top of MainContent and scrolls along with the rest of the content.

#### Status indicator dot

The small green dot next to the "Active" label is a 6px solid dot wrapped in a 2px translucent halo (visible total: 10×10).

```
width: 6px
height: 6px
border-radius: 999px
background: #03d07d                              /* var(--green) */
box-shadow: 0 0 0 2px rgba(3, 208, 125, 0.25)    /* var(--green-stroke) */
flex-shrink: 0                                   /* don't collapse in the flex row */
```

**Use `box-shadow`, not `border`, for the halo.** A `border` interacts with `box-sizing` (Tailwind's preflight sets `box-sizing: border-box` globally), so `border: 2px solid` on a 6×6 element renders as 2px of content inside 4px of border — the dot collapses to a sliver. Even with `box-sizing: content-box` overriding the preflight, the result reads faintly because of how the border antialiases against a small element. `box-shadow: 0 0 0 2px <color>` always renders outside the box, doesn't affect layout, follows the border-radius, and gives a clean ring. Use this pattern any time you need a halo around a small element.

```
align-self: stretch
background: var(--bg-card) /* #1a1c22 — same as Card */
border-radius: 16px
padding: 16px 20px
display: flex
align-items: center
justify-content: space-between
/* no border — same rule as cards */
```

Height is determined by content (44px avatar + 16px top/bottom padding ≈ 76px), not fixed.

#### Identity avatar (left side)

44×44 circle holding the user's photo:

```
width: 44px
height: 44px
border-radius: 50%
background-color: var(--bg-icon)             /* #292b31 — fallback color if image fails to load */
background-image: url('/Avatar_Dawn.png')    /* served from joon-app/public/ */
background-size: cover
background-position: center
flex-shrink: 0
```

Use `role="img"` and a descriptive `aria-label` on the div so screen readers announce the avatar. Keep the fallback `background-color` — if the image is missing or slow to load, the circle still renders cleanly. The image lives in `joon-app/public/` (Next.js serves the directory from the site root, so `/Avatar_Dawn.png` resolves to `public/Avatar_Dawn.png`). Sibling avatars in `public/` — `Avatar_Helen.png`, `Avatar_Sean.png`, `Avatar_Valery.png` — are available for Teamwork or other identity contexts when needed.

#### Scrolled state — Floating Status Pills

Once MainContent is scrolled past the StatusBar, the StatusBar's content morphs into **two floating glass pills** anchored at the top of the viewport — identity on the left edge, actions on the right edge. The original StatusBar stays in flow and scrolls naturally; the pills appear as a fixed overlay once the StatusBar's bottom edge passes the viewport top, and disappear again once the user scrolls back to the top.

Implemented as `<FloatingStatusPills visible={…}>` in `src/app/detection/page.tsx`. Trigger: `wrapperRef.current.scrollTop > 88` (StatusBar's offsetTop 12 + height ~76). Use `requestAnimationFrame` to throttle the scroll listener.

**Overlay container** — `position: fixed` so it ignores the scroll wrapper and sits relative to the viewport. The container is purely positional; visibility/animation lives on the inner content row, not on this outer.

```
position: fixed
top: 12                                /* matches the StatusBar's resting top inset */
left: 312                              /* sidebar 280 + shell-padding-left 12 + shell-gap 20 */
right: 0                               /* extends to the viewport's right edge */
z-index: 50
pointer-events: none                   /* MANDATORY — lets clicks pass through to cards underneath; pills re-enable pointer-events themselves */
display: flex
justify-content: center                /* mirrors MainContent's centering wrapper */
opacity: visible ? 1 : 0
transform: visible ? translateY(0) : translateY(-8px)
transition: opacity 200ms ease, transform 200ms ease
```

The 312px left inset is the only place outside the outer shell where sidebar geometry is hardcoded. If the sidebar collapses or its width changes, this value must follow.

**Inner row** — mirrors MainContent's centered column so the pills align with the cards beneath them.

```
width: 100%
max-width: 1400                        /* same as MainContent */
padding-right: 12                      /* same as <main> — keeps the right pill 12px off the viewport edge */
display: flex
justify-content: space-between
align-items: flex-start
flex: 1 0 0
```

**Pill containers** — share a `STATUS_PILL_GLASS` style fragment defined in `src/app/detection/page.tsx`. Padding differs per pill; everything else is invariant.

```
border-radius: 100                     /* full pill */
border: 1px solid #23252a              /* var(--border) — registered exception, see Borders section */
background: linear-gradient(90deg, rgba(26,28,34,0.75) 0%, rgba(31,33,41,0.75) 100%)
box-shadow: 0 2px 20px 0 rgba(0,0,0,0.40)
backdrop-filter: blur(5px)             /* + WebkitBackdropFilter for Safari */
display: flex
align-items: center
gap: 12
pointer-events: auto                   /* re-enables click on the pill itself; the outer is pointer-events: none */
```

The translucent 75%-alpha gradient + backdrop blur is what makes these read as "glass." If you change the alpha to fully opaque, the blur stops doing anything visible and the pill loses the layering effect — keep the 0.75.

| Pill | Padding | Contents |
|---|---|---|
| **Left — identity** | `12px 24px 12px 12px` (asymmetric: extra room on the right after the text) | 36×36 avatar (compact — the regular StatusBar's avatar is 44×44, the pill's is 36×36 to keep the floating chip lean) + identity stack (`Detection Engineering · Dawn` over `● Active`, same content as the StatusBar) |
| **Right — actions** | `12px` uniform | ⌘K kbd chip + "Last 7 days" date button (both keep the StatusBar action-pill spec — `#1f2126` bg + `border: 1px solid #23252a` + `border-radius: 100`) + a `RefreshCw` 12×12 icon paired with "Updated 2h ago" text (icon-text group, gap 6, color `#858a94`). The refresh icon only appears in the floating pill — the regular StatusBar shows "Updated 2h ago" without an icon. |

**Animation:** opacity + 8px translateY drop, 200ms ease both ways. The drop direction (down on enter, up on exit) reads as "pill arrives from above, leaves upward" — matches the natural reading of a header docking.

**Why fixed, not sticky:** sticky inside a flex column with `justify-content: center` is unreliable — the sticky element ends up positioned against the flex baseline, not the scroll viewport. `position: fixed` + `pointer-events: none` outer + `pointer-events: auto` per pill is the most predictable pattern for a transient overlay that must not block clicks.

#### Top edge fade (scroll mask)

In tandem with the pills, a fixed gradient overlay softens content scrolling past the viewport top so cards don't visually "cut" at the edge. Sits inside MainContent's wrapper as a sibling of `<main>` and the floating pills.

**Outer container** — fixed, full top band, no paint of its own:

```
position: fixed
top: 0
left: 312                              /* matches the pills' left inset — sidebar 280 + shell-padding 12 + shell-gap 20 */
right: 0
height: 60
pointer-events: none
z-index: 40                            /* MUST be lower than the pills' 50 so pills paint cleanly on top */
opacity: isScrolled ? 1 : 0
transition: opacity 200ms ease
aria-hidden                            /* purely decorative */
```

**Inner layers** — four absolutely-positioned children with `inset: 0`. Three masked backdrop-blur bands plus a color overlay on top. Each blur layer's `mask-image` confines its blur to a horizontal slice of the band:

| Layer | DOM order | `backdrop-filter` | `mask-image` (where the blur is visible) |
|---|---|---|---|
| Blur band 3 (lightest, bottom) | 1st child | `blur(1px)` | `linear-gradient(transparent 33%, #000 66%, #000 100%)` — peaks y=40–60 |
| Blur band 2 (medium, middle) | 2nd child | `blur(2px)` | `linear-gradient(transparent 0%, #000 33%, #000 66%, transparent 100%)` — peaks y=20–40 |
| Blur band 1 (heaviest, top) | 3rd child | `blur(4px)` | `linear-gradient(#000 0%, #000 33%, transparent 66%)` — peaks y=0–20 |
| Color overlay | 4th child (top of stack) | — | `background: linear-gradient(to bottom, #0f1116 0%, rgba(15,17,22,0.55) 50%, transparent 100%)` |

Always set both `maskImage` and `WebkitMaskImage` (Safari hasn't dropped the prefix on mask-image yet). Same for `backdropFilter` / `WebkitBackdropFilter`.

**Stacking order matters.** Heaviest blur sits HIGHER in the DOM (later sibling) so it composites on top of the lighter blurs in their overlap zones. The color overlay is the last child so the page-bg paint is fully opaque at the top edge — placing it under the blurs would let blurred content show through there.

**Trigger:** `wrapperRef.current.scrollTop > 4` (a tiny dead zone to avoid jitter from sub-pixel scrollTop reports). Earlier than the pills' threshold of 88, because the fade should appear the moment content starts moving past the top edge — not wait for the StatusBar to fully scroll out.

**Why these specs:**
- **Page-bg gradient (`#0f1116 → 55% at midpoint → transparent`)**: the fade works by literally painting the page bg color over the top of the scroll content with a falloff. Cards underneath stay rendered; the gradient just obscures them progressively. The 55% midpoint stop biases the curve slightly toward the top (a pure linear gradient would be 50% at midpoint) — enough that cards read as fading without going so dark that they disappear entirely through the band. Earlier iteration sat at 70% midpoint and felt too heavy; lowered to 55% on 2026-05-02. Don't try to do this with `mask-image` on the WRAPPER — that mask would also apply to the pills (since they're descendants), and they shouldn't fade. The masks here are scoped to the inner blur layers only.
- **Progressive blur (1 / 2 / 4 px)**: doubling each step is the canonical pattern — the eye reads each step as roughly equivalent. Heavier blur near the top complements the stronger color overlay there; lighter blur at the bottom keeps content readable as it leaves the fade. Three layers is the minimum that reads as "smooth gradient blur"; pushing to four adds GPU cost without much visual gain.
- **Height 60**: long enough for a noticeably soft transition that brackets the floating pills' vertical span (top 12, ~60px tall → bottom ~72). The pills overlap most of this height in the side regions; the fade is visually consumed in the **middle gap between the two pills** (where cards scroll up to the viewport edge with no pill in front) and in the **12px strip above the pills**. Earlier iteration was 40px with a pure linear gradient and no blur — bumped to 60 + biased curve + progressive blur on 2026-05-02. Midpoint opacity tuned down from 0.7 → 0.55 the same day.
- **z-index 40 < pills' 50**: pills must paint over the fade. If reversed, the pills would themselves get the gradient overlay and look washed out at the top.
- **Hidden at rest (`opacity: 0` when not scrolled)**: the fade band would otherwise overlay the StatusBar's top edge at scrollTop=0 (StatusBar top is at viewport y=12, fade bottom at y=60 → 48px overlap), making the StatusBar look faded for no reason. The 200ms opacity transition handles the on/off cleanly. **Important:** the opacity goes on the OUTER container, not on the individual blur layers — animating opacity on a `backdrop-filter` element creates a stacking context that breaks the blur during the transition. Outer-only opacity sidesteps that.

**Two scroll thresholds, one listener:** the rAF-throttled scroll listener writes both `isScrolled` (>4) and `showPills` (>88) so fade and pills share one source of truth. Don't add a second scroll listener for the fade.

---

## Component Rules

### Card (generic wrapper)

```
background: var(--bg-card)               /* #1a1c22 */
border-radius: var(--card-radius)        /* 16px — default / top-level */
padding: var(--card-padding)             /* 20px all sides */
```

**Cards have no border.** Separation from the page background comes from the `--bg-card` (#1a1c22) fill against the darker `--bg-page` (#0f1116) shell. Inner Cards inside a Card use `--bg-elevated` (#1e2026) — see the Inner Card section below.

**Radius levels** — pick one based on where the card sits in the hierarchy:

| `variant` | Token | Value | Use for |
|---|---|---|---|
| `default` (default) | `--card-radius` | `16px` | Top-level cards on the page (Health & Performance, Active Workload Queue, etc.) |
| `inner` | `--card-radius-inner` | `8px` | Panels nested inside a top-level card (stat tiles, expanded queue groups) |
| `sub` | `--card-radius-sub` | `4px` | Sub-elements (list rows, chips, very small surfaces) |

Nesting goes outer → inner → sub. Don't apply `default` (16px) inside another card — the doubled radius reads as a layout error.

Pass `noPadding` only when content manages its own padding (e.g. tabbed cards, cards with full-bleed headers).

### Inner Card

Any card-shaped element nested inside a top-level Card. **Every nested rectangular surface uses this treatment** — they share visual properties so the page reads as a coherent set of "card → inner card" relationships rather than ad-hoc surfaces.

```
background: var(--bg-elevated)            /* #1e2026 */
border-radius: var(--card-radius-inner)   /* 8px */
/* padding: context-dependent (see below) — no border */
```

In code, spread the `INNER_CARD` style fragment defined at the top of `src/app/detection/page.tsx`:

```tsx
<div style={{ ...INNER_CARD, padding: "12px 14px", display: "flex", ... }}>
```

**Where Inner Card applies (canonical list):**

| Surface | Padding | Notes |
|---|---|---|
| Health & Performance "Total Rules" left panel | `16px 24px` | `display: flex; flex-direction: column; align-items: flex-start; gap: 12; align-self: stretch; width: 640px`. Children that need full width (stacked bar, breakdown list, **the 730 + delta row**) require explicit `align-self: stretch` because of `align-items: flex-start`. The 730 + delta row uses `display: inline-flex; justify-content: space-between; align-items: flex-end` so the display number sits at the left and the delta badge sits at the right edge of the panel, both bottom-aligned. |
| Stat tile (Health & Performance 2×2 grid) | `16px` all | Internal layout: icon-circle + delta badge top, stat number + caption bottom |
| Active Workload Queue group **toggle row** | `0` (button manages its own) | Inner Card treatment on the **toggle only** — both collapsed and expanded states show the toggle wrapped in the Inner Card surface. Expanded children sit *outside* the Inner Card on the parent Card's bg (see next row). The group is structured as a transparent flex-column wrapper containing two siblings: the Inner-Card-wrapped toggle, and (when expanded) the children section. **Accordion behavior:** at most one group is expanded at a time. Clicking a collapsed group expands it AND collapses any other open group. Clicking the open group collapses it (no group is open). Single state value: `useState<number \| null>` with the open index, or `null` when none is open. **Expand/collapse animation:** the children section is wrapped in a 2-div helper that animates `grid-template-rows: 1fr` ↔ `0fr` (200ms ease) plus `opacity: 1 ↔ 0` (160ms ease). Inner clipper has `overflow: hidden` so the content shrinks visibly during collapse. The grid trick lets us animate to/from auto-height without hardcoding a `max-height`. Render the wrapper for any group whose `children` array is non-empty — don't gate it on `isOpen` (that breaks the exit animation since the element is removed from the DOM). |
| Active Workload Queue **expanded children section** | `16px 14px 12px 38px` | **Not an Inner Card** — sits on the parent Card's bg (`var(--bg-card)`). The 38px left padding indents children under the toggle's chevron. **`16px` padding-top** is the spacing between the toggle Inner Card above and the first sub-item. `display: flex; flex-direction: column; gap: 12px` between sub-items so each row has its own breathing room (matches the canonical 12 we use elsewhere). **The `12px` padding-bottom is intentional** — it adds breathing room between the last sub-item and the next group's toggle (on top of the queue list's `gap: 6px`, total ~18px). Without it, the next group feels glued to the last child. **Tree connectors** (vertical line + L-curves) sit absolutely-positioned at `left: 20; top: 0` of this section — see "Workload Tree Connectors" below. |
| Last Covered row | `12px 16px` | `display: flex; align-items: center; gap: 12px; align-self: stretch`. Height is content-driven (no fixed height). **Three flat children** — name (with `flex: 1`), Deployed pill, date — not name + a wrapper div around pill+date. The single 12px gap applies between every pair, and `flex: 1` on the name pushes the rest to the right (no `justify-content: space-between` needed). **The date span has a fixed `width: 48px`** so the Deployed pill's right edge aligns to a consistent vertical line across all rows — without it, the pill drifts as date width changes ("Mar 1" vs "Mar 15"). 48px fits up to ~7 mono chars at 10px; widen if longer dates appear. |
| Teamwork row | `12px 14px` | Avatar group + identity column. Avatars: two overlapping 30×30 circles (left at `x=0`, right at `x=21` — 9px overlap). Each pip uses `background-image: url('/Avatar_<Name>.png')` with `background-color: #1a1c22` as fallback, and a `2px solid #1e2026` ring (matches the Inner Card surface behind them) so the overlap reads cleanly. Pass `fromAvatar` / `toAvatar` URLs from the row data. Update the `meta` text to match the avatars assigned. |
| Heatmap cell (DetectionCoverageHeatmap tile) | `12px` all | `height: 52`. Spreads `INNER_CARD` and overrides `background` per coverage tier (`HEATMAP_TIERS[tier].bg` or `HEATMAP_EMPTY_BG`). Bar (2px) + text stack inside, both with `flexShrink: 0`. |
| ~~Heatmap tooltip~~ | ~~`12px` all~~ | _retired 2026-05-08 with the heatmap rewrite — cells now carry the technique id + name directly_ |

Padding varies by content; background and radius are invariant.

**Why same hex as the sidebar?** The sidebar (`--bg-base`) and Inner Cards (`--bg-elevated`) intentionally share `#1e2026`. Both are "elevated chrome" — surfaces that read as more solid than the floating cards in front of the page. Use the right token semantically: `--bg-base` for the rail, `--bg-elevated` for any nested card.

**Decorative rings that match parent bg:** when a child element overlays a card-on-card boundary (e.g. Teamwork's two overlapping avatar pips use a `2px solid` ring to separate them), the ring color matches the surface BEHIND the child — that's the Inner Card now (`#1e2026`), not the parent Card (`#1a1c22`). Audit any such ring effects when an Inner Card is added or moved.

### Card Header

- Title: `--type-heading` (Inter Medium 18px)
- Subtitle: `--type-body` (Inter Regular 12px)
- Gap between title and subtitle: `0px`
- **No separator** between header and content.
- **Header padding: `20px 20px 0`** (top and sides match the card's 20px frame; bottom is 0 so the gap to content is owned solely by the body's `padding-top: 20`).
- **Total title → content gap: 20px exactly.** This is enforced by:
  - `padding-bottom: 0` on the header (so the header doesn't contribute)
  - `padding-top: 20` on the card body (the only contributor)
  - Cards with subtitle + right action will hit 20px exactly. Single-line title + tall right action (e.g. 34px icon button) will measure ~25px because the title is vertically centered in the taller row — that's a known and accepted trade-off; do not work around it by reducing body padding.
- No `min-height` on the header. Height is determined by content.
- Single-line title: `align-items: center`
- Title + subtitle or title + action: `align-items: flex-start`, `justify-content: space-between`

### Tab Bars (inside cards)

- The 1px underline runs **full card width** (edge-to-edge)
- Tab label padding: `0 18px` inside the tab row
- Active tab: `--text-primary` + bottom border `1px solid --text-primary`
- Inactive tab: `--text-tertiary`

### Separators Inside Cards

List row separators (Latest Risks, accordion items, table rows) sit **inside** the content padding — they are NOT edge-to-edge. Tab-bar separators bleed full width. **Card headers have no separator** — title/subtitle sit directly above content with no horizontal rule between them.

### Icon Buttons

```
width: 34px
height: 34px
border-radius: 100px
background: var(--bg-icon)              /* #292b31 */
border: 1px solid var(--border)         /* allowed — this is a button */
display: flex
align-items: center
justify-content: center
```

Icon inside: 16×16px, color `--text-secondary`.

Sidebar icon buttons (Search, Plus, PanelLeftClose) use a fainter outline:

```
background: var(--white-2)              /* rgba(255,255,255,0.02) */
border: 1px solid var(--white-2)
```

Icon inside: 14×14px.

**Brand-icon variant:** when a card-header IconBtn opens that card in an external system (e.g. Jira), use the system's brand `<img>` instead of a Lucide icon. Same 14×14 size, `display: block`, `alt=""` (the `aria-label` on the button conveys meaning). Example: Health & Performance card's right action uses `/jira_icon.svg` to indicate "open in Jira" — the button's `aria-label` is then "Open Health & Performance in Jira".

### Delta Badges (↑ +7%)

```
background: var(--green-bg)             /* #03d07d at 5% */
color: var(--green)                     /* #03d07d */
border-radius: var(--badge-radius)      /* 999px */
padding: 2px 6px
font: --type-caption                    /* Inter Regular 10px */
```

**No border.** Badges are passive labels, not action items. The `--green-stroke` token exists for legacy reasons but is not used on badges.

### Running Badge

Used on Active Workload groups when at least one detection is in progress (e.g. "3 Running"). Same pill shape as DeltaBadge, but with a leading dot that mirrors the StatusBar's "Active" status indicator.

```
font: --type-caption
border-radius: 999px
padding: 2px 6px
background: rgba(3, 208, 125, 0.05)        /* var(--green-bg) */
color: #03d07d                              /* var(--green) */
display: inline-flex
align-items: center
gap: 8px
```

The leading dot:

```
width: 6px
height: 6px
border-radius: 999px
background: #03d07d                         /* var(--green) */
box-shadow: 0 0 0 2px rgba(3, 208, 125, 0.25)  /* var(--green-stroke) — same halo as the StatusBar's Active indicator */
flex-shrink: 0
```

The `box-shadow` halo (not `border`) is mandatory — same reasoning as the StatusBar status dot. The `gap: 8` between dot and text is wider than the 4 used elsewhere because the halo extends 2px outward from the 6px dot, eating ~2px into a tight gap.

### Nav Items (sidebar)

```
height: 30px
padding: 0 8px
font: --type-body                       /* Inter Regular 12px */
color: var(--text-secondary)
border-radius: 0
```

Active state:
```
color: var(--text-primary)
background: var(--bg-card)
border-left: 2px solid var(--text-primary)
```

### Animations

All animation keyframes are defined inline in a `<style>` block at the top of `<DetectionPage>`. (Previously some keyframes lived in `globals.css` but hot-reload wasn't picking them up reliably; inline keeps them attached to the component.)

#### `joon-shimmer` — gradient text sweep

A `@keyframes joon-shimmer` rule defined inline:

```
@keyframes joon-shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}
```

It animates `background-position` so a 3-stop gradient (baseline-peak-baseline) with `background-size: 200% 100%` slides its bright peak from off-screen-left → through center → off-screen-right. Pair with `background-clip: text` + `-webkit-text-fill-color: transparent` to apply the sweep as text fill.

**Usage:** workload sub-item ID pills and description names (signals "in progress / working"). 2.5s duration is the canonical pace — fast enough to read as motion, slow enough not to distract. Don't apply elsewhere unless the element genuinely needs to convey progress.

#### `joon-dot-1` / `joon-dot-2` / `joon-dot-3` — typing-dot indicator

Used for the in-progress workload status text ("Validating", "Rule_generation"). Three trailing dots cycle **0 → 1 → 2 → 3 → 0** via opacity. Three `<span>.</span>` elements after the status text, **all three animated** (1.5s, **`step-end`**, infinite — `step-end` is mandatory so dots snap on cleanly without fading; linear timing makes them appear to fade in independently and reads as "dot moving from one position to another"). Each dot snaps on at a different quarter of the cycle:

- **Dot 1** — `animationName: joon-dot-1` (snaps on at 25%)
- **Dot 2** — `animationName: joon-dot-2` (snaps on at 50%)
- **Dot 3** — `animationName: joon-dot-3` (snaps on at 75%)

```
@keyframes joon-dot-1 { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 1; } }
@keyframes joon-dot-2 { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
@keyframes joon-dot-3 { 0% { opacity: 0; } 75% { opacity: 1; } 100% { opacity: 1; } }
```

The cycle starts at "no dots" (0–25% phase: all hidden), then adds one dot per quarter. With `step-end` timing each dot holds its 0% value (off) until its threshold, then jumps to opacity 1 and holds through 100%. On loop the value snaps back to 0%. Wraps cleanly to zero.

**Don't put the literal `...` in the status data anymore** — the dots come from the animated spans. Status strings are bare ("Validating", not "Validating…").

### Workload Tree Connectors

The expanded children of an Active Workload Queue group are visually connected to the toggle's chevron by a tree spine — a vertical line on the left with L-curves branching out to each sub-item, **each L-curve aligned to its sub-item's pill center**.

```
/* Each node SVG — common attrs */
width: 20px
flex-shrink: 0
display: block                               /* removes the inline-element baseline gap */
overflow: visible                            /* MANDATORY — the path's vertical at x=0.5 and horizontal at y=H sit on the SVG box edges; without `overflow: visible`, the half of each stroke that extends outside the box gets clipped, making the horizontal render at 0.5px while the vertical stays at 1px. With `overflow: visible` both render at the full 1px stroke width. */
stroke: #292b31                              /* var(--border) */
/* viewBox always matches "0 0 20 {height}" — 1:1 with rendered size, no aspect ratio mismatch */

/* Per-position height: */
/*   First node: 27px tall — the spine starts at the children-section top (= bottom of the Inner Card above) and curves to pill 1's center at y=27 (= padding-top 16 + half pill row 11) */
/*   Every other node: 34px tall — matches the row advance (row height 22 + gap 12), so each curve lands on the next pill's center */

/* Four path variants depending on position in the list. The geometry is consistent —
   the curve is always a radius-8 quarter-circle ending at the bottom-right, with
   horizontal continuing to x=14 (giving a 4px gap before the pill). What varies is
   the SVG height and whether there's a vertical continuation below the curve. */

/* "only" — the only child (first AND last). Height 27. No vertical continuation. */
path: "M0.5 0V19C0.5 23.4183 4.08172 27 8.5 27H14"

/* "first" — first child of 2+. Height 27. Full vertical spine continues below the curve
   so it meets the next node's vertical at section y=27. */
path: "M0.5 0V27M0.5 19C0.5 23.4183 4.08172 27 8.5 27H14"

/* "last" — last child of 2+. Height 34. No vertical below the curve — spine terminates. */
path: "M0.5 0V26C0.5 30.4183 4.08172 34 8.5 34H14"

/* "middle" — any node that's neither first nor last. Height 34. Full vertical spine. */
path: "M0.5 0V34M0.5 26C0.5 30.4183 4.08172 34 8.5 34H14"

/* The horizontal stops at x=14 (not the SVG's right edge at x=20) so there's a 4px gap
   between the curve's right end and the pill that follows: tree column at section x=20,
   curve exits at section x = 20 + 14 = 34, pill starts at section padding-left = 38.
   38 - 34 = 4px. */

/* Container */
position: absolute (inside the children section)
left: 20px                                   /* aligns with toggle's chevron column */
top: 0                                       /* spine starts at the children-section top (= bottom of the Inner Card above) — does NOT extend up into the toggle's Inner Card */
display: flex
flex-direction: column
align-items: flex-start
pointer-events: none                         /* purely decorative */

/* No marginTop / negative gap needed — nodes stack edge-to-edge */
```

**Why these numbers:** the children section has `padding-top: 16`, each row is `height: 22`, gap between rows is `12`, so pill centers fall at y = 27, 61, 95 (first pill is 27 from section top: padding 16 + half pill row 11; subsequent pills advance by 34 per row: row 22 + gap 12). With the container at `top: 0` (so the spine starts at the section's top edge, not extending into the Inner Card above):

- **First node** is `27` tall (= section padding-top 16 + 11) so its curve lands on pill 1's center (y=27).
- **Subsequent nodes** are `34` tall (= row 22 + gap 12), so each subsequent curve lands on the next pill's center.

Don't change the row height, row gap, or section padding-top without recomputing — the per-node heights and paths are derived values, not magic numbers. If padding-top changes from 16 to N, the first node's height becomes `N + 11` and the curve in its path shifts down by `N - 16`.

The vertical strokes of stacked nodes (drawn at x = 0.5) sit edge-to-edge. Non-last nodes include a full-height vertical (sub-path `M0.5 0V{H}`) so the spine continues past the curve to meet the next node's vertical. The last node omits that continuation, so the spine cleanly terminates at the final L-curve.

### Connector Chip

Used in card headers to show which external connectors a card draws from (Jira, CrowdStrike Falcon, etc.). It's a pill with a brand-logo circle on the left and a label on the right.

```
/* Pill */
display: flex
padding: 2px 8px 2px 2px               /* tight on the left so the logo circle sits flush */
align-items: center
gap: 4px
border-radius: 100px
background: rgba(255,255,255,0.05)     /* var(--white-5) */

/* Logo circle (first child) */
display: flex
width: 20px
height: 20px
padding: 4px
align-items: center
justify-content: center
gap: 10px
border-radius: 100px
background: #1e2026                    /* var(--bg-elevated) — same as the parent Card / Inner Card surface */
flex-shrink: 0

/* Label (second child) */
font: var(--type-body)
color: var(--text-tertiary)            /* #858a94 — quieter than --text-secondary so the chip reads as metadata, not a primary action */
```

The logo circle's content area is **12 × 12** (20px circle minus 4px padding all around). Pass a brand mark via the `logo` prop on `<ConnectorChip>` — typically an `<img>` element pointing at an SVG asset in `joon-app/public/` (e.g. `/jira_icon.svg`, `/crowdstrike_icon.svg`):

```tsx
<ConnectorChip
  label="Jira"
  color="#2684ff"
  logo={<img src="/jira_icon.svg" alt="" width={12} height={12} style={{ display: "block" }} />}
/>
```

Use `alt=""` on the `<img>` — the chip's label already conveys the meaning, so the icon is decorative for screen readers. If the `logo` prop is omitted, the chip falls back to a 12×12 rounded square in the chip's `color` (placeholder while real brand assets are pending). The chip is intentionally a dynamic element — the consumer of the card can swap connectors freely by changing the props.

For overflow indicators ("+2", "+5", etc.) **don't use ConnectorChip** — use `<NeutralBadge>` instead. NeutralBadge already shares the same pill background and shape but without the logo circle, which is the right visual for "and N more."

Four segments in flex row, **`gap: 4px`** between them:
1. Deployed: `--heatmap-100` (`#07d582`)
2. Drafts: `--blue-mid` (`#4a90e2`)
3. Proposals: `--blue-light` (`#6993be`)
4. In test: `--text-secondary` (`#b4b9c2`)

Height: `12px`. **Asymmetric edge pattern:**

| Segment | `border-radius` (TL TR BR BL) |
|---|---|
| First (left edge) | TL/BL `6px`, TR/BR `2px` — rounded outer (left), 2px inner (right) |
| Middle segments | `2px` — square at the 2px scale on all corners |
| Last (right edge) | TL/BL `2px`, TR/BR `6px` — 2px inner (left), rounded outer (right) |

Outer ends use a `6px` corner (half the bar's 12px height — gives a clean half-circle without clamping); inner ends use a tighter `2px` corner. **Use per-corner properties** (`borderTopLeftRadius`, `borderBottomLeftRadius`, etc.) rather than the four-value shorthand — explicit per-corner is unambiguous in React inline styles and matches Figma's per-corner notation.

### Detection Coverage Heatmap

Card with a horizontally scrollable grid of tactic columns. Each column is a fixed-width vertical stack of Inner-Card-shaped tiles colored by coverage tier. Lives in `src/app/detection/page.tsx` as four reusable primitives — `<HeatmapCell>`, `<HeatmapColumn>`, `<HeatmapLegend>`, `<HeatmapSlider>` — plus the composed `<DetectionCoverageHeatmap>`.

**Why split into primitives**: each piece is reusable on its own — `<HeatmapSlider>` works against any horizontally-scrolling element via its `scrollRef` prop (not heatmap-specific); `<HeatmapCell>` is just an Inner Card with a tier override and could anchor any future tier-colored grid; `<HeatmapLegend>` reads its swatches from `HEATMAP_TIERS` so it stays in sync if the palette changes. Add a new tier by editing **two** places only — `tokens.css` and `HEATMAP_TIERS`.

#### Layout

```
Card (--bg-card #1a1c22, 16 radius)
├── CardHeader (20 sides + top, 0 bottom — title "Detection Coverage Heatmap" + subtitle "Covered by Dawn" + right=IconBtn maximize-2)
└── Body (padding: 20, gap: 28, flex column, min-width: 0)
    ├── Scroll container (display: flex, gap: 8, overflow-x: auto, .no-scrollbar)
    │   └── HeatmapColumn × N (each 145px wide, flexShrink: 0)
    │       ├── Column header (padding: 0 12px — category over percent)
    │       └── HeatmapCell × N (gap: 8 between cells)
    └── Footer (flex, justify: space-between, align: center, alignSelf: stretch)
        ├── HeatmapLegend (5 dots + labels — gap: 16, paddingRight: 86, flexShrink: 0)
        └── HeatmapSlider (custom scroll indicator — flex: 1 0 0, min-width: 160)
```

The 28px body gap brackets the column grid and footer (matches Figma). Title-to-grid gap is the canonical 20 (CardHeader pb=0 + body pt=20).

#### `<HeatmapCell>` — primitive tile

Spreads the canonical `INNER_CARD` style (8px radius) with the cell bg overridden by tier:

```tsx
<div style={{
  ...INNER_CARD,
  background: tier ? HEATMAP_TIERS[tier].bg : HEATMAP_EMPTY_BG,
  height: 52,
  padding: 12,
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexShrink: 0,
}}>
  {tier && (
    <>
      <span style={{ width: 2, alignSelf: "stretch", borderRadius: 100, background: HEATMAP_TIERS[tier].bar, flexShrink: 0 }} />
      <div /* col w/ id (T_BODY #f2f4f7) + name (T_CAPTION #b4b9c2), both ellipsis */ />
    </>
  )}
</div>
```

When `tier === null` the cell renders **only the bg** (no bar, no text) — that's the "no detection at this technique" placeholder. Use `flexShrink: 0` on the cell so the column never collapses inside the scroll container.

#### `<HeatmapColumn>` — primitive column

Fixed `width: 145`, flex-column with `gap: 8`. Header (category + %) sits in `padding: 0 12px` so its text aligns with the cell content's text (which has 12px left padding via the cell's `padding: 12`). `flexShrink: 0` so columns keep their width when the row would otherwise collapse to fit.

#### `<HeatmapLegend>` — primitive

Reads from `HEATMAP_TIERS` so the palette stays the single source of truth. Five rows in a flex with `gap: 16`, each: `8×8` circular dot (`borderRadius: 999`) using the tier's `bar` color + `T_CAPTION` label. `paddingRight: 86` on the legend reserves a guaranteed 86px gap between its last dot and the slider that follows it in the footer (the gap holds even when the footer is narrow).

Don't hardcode a separate legend color list — if you ever change a tier color, the legend should follow without a code change.

#### `<HeatmapSlider>` — reusable scroll indicator

Custom horizontal scroll handle. Tracks the scroll position of any element via a `scrollRef` prop and renders a draggable knob that slides along a thin gradient track. Knob is **fixed size** (20×20) — its position (not its width) reflects scroll progress. Hides itself (`opacity: 0`) when content fits without overflow.

**Track:**

```
flex: 1 0 0
height: 6                                            /* tall enough that the 999px radius reads as a pill — at 3px the clamped 1.5px rounding was effectively invisible */
position: relative
border-radius: 999                                   /* clamps to half-height (3px) — fully rounded pill ends */
border: 1px solid rgba(255,255,255,0.05)             /* very faint outline so the bar reads against the card bg */
background: linear-gradient(90deg,
  #07D582 0%,                                        /* bright green, full --green tier */
  #0ABE77 12.5%,
  #0DA86B 25%,
  #137B54 50%,
  #1E2026 100%                                       /* fades into card-elevated tone at the right */
)
min-width: 160
opacity: visible ? 1 : 0
transition: opacity 200ms ease
```

The gradient is **decorative and fixed** — it does NOT track the scroll progress. It paints a "heat" feel along the bar regardless of position. Don't try to animate the gradient stops in response to scroll; that's not what's being communicated here.

**Knob (thumb):**

```
position: absolute
left: <computed>                                     /* scrollRatio × (trackWidth − 20) */
top: 50%
transform: translateY(-50%)                          /* vertically center on the 3px track */
width: 20
height: 20
border-radius: 8
border: 4px solid rgba(255,255,255,0.10)             /* translucent halo ring */
background: #fff
box-shadow: 0 2px 2px 0 rgba(0,0,0,0.10)
cursor: grab
touch-action: none
box-sizing: border-box                               /* MANDATORY — without it, the 4px border adds 8 to the box and the knob renders 28×28 */
```

With `box-sizing: border-box`, the 20×20 outer footprint is preserved and the white inner area is 12×12 (= 20 − 4 × 2). The translucent border becomes the visible "halo" around a small white square. Don't redesign this with a `box-shadow` instead — `box-shadow` can't be hit-tested for the drag pointer events, and the halo needs to be part of the draggable target.

**Sync mechanism:** `ResizeObserver` on both the scroll element AND the track (so the knob position recalculates on either resize) + a passive `scroll` listener. Drag via `pointer-events` with `setPointerCapture` — works for mouse, touch, and pen.

**It is not heatmap-specific.** Drop it next to any other horizontal scroll surface — pass that surface's ref and it works. The 20×20 knob and 3px gradient track are the canonical "scroll handle" pattern in this app.

**Iteration history:**
- v1 (2026-05-08, retired same day): proportional pill thumb (`width = visible/total × trackWidth`) on a flat `rgba(255,255,255,0.05)` track. Visually too utilitarian — read as a generic scrollbar, not a designed component.
- v2 (2026-05-08, retired same day): fixed 20×20 white knob with halo on a 3px gradient track + `border-radius: 12`. Track was too thin — the radius got clamped to 1.5px (half-height) and the pill ends weren't visibly rounded.
- v3 (current, 2026-05-08): same knob, track bumped to 6px tall + `border-radius: 999` for clearly rounded pill ends.

#### `.no-scrollbar` utility class

Lives in `globals.css`. Hides the native scrollbar (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) without disabling scroll itself. Apply to the scroll container of any element that drives a custom slider UI. The element still scrolls — only the visible scrollbar is suppressed.

#### Data shape

```ts
type HeatmapTier = "100" | "75" | "50" | "25" | "0";
type HeatmapCellData = { tier: HeatmapTier | null; id: string; name: string };
type HeatmapColumnData = { category: string; percent: number; cells: HeatmapCellData[] };
```

`HEATMAP_TACTICS: HeatmapColumnData[]` is the demo data (14 MITRE ATT&CK enterprise tactics). When wiring real data, hand the same shape — the components don't care where the data comes from.

#### Legacy heatmap (retired 2026-05-08)

The previous heatmap was a 7×14 `number[][]` of percentages rendered as 24px-tall opacity-tinted squares plus a floating tooltip card showing "93% / T1190 / Initial Access / 81%". Replaced wholesale; the `HEATMAP` const and `heatColor()` helper were removed. The four `--heatmap-100/50/25/10` tokens are still in `tokens.css` for one cycle in case anything else accidentally references them — remove on a follow-up cleanup.

---

### Lollipop Row (Proposal Drivers chart)

Each row in the Proposal Drivers card is a horizontal lollipop: a track line, a filled portion from left to the value point, and a knob at the value point.

| Element | Token | Notes |
|---|---|---|
| Label (left) | `--text-secondary` (`#b4b9c2`) | Inter Regular 12 — `T_BODY` |
| Track (background line) | `--border` (`#23252a`) | 1px tall, full row width |
| Fill (filled portion) | `--text-primary` (`#f2f4f7`) | 1.5px tall, width = `(value / max) * 100%`. **Neutral, not green** — green is reserved for status/success indicators (DeltaBadge, status dot, Deployed pill). |
| Knob (value point) | `--text-primary` (`#f2f4f7`) | 8×8 circle, centered on the fill's right edge |
| Value (right) | `--text-primary` (`#f2f4f7`) | Inter Semi Bold 12 — `T_BODY_SEMI`, right-aligned |

The lollipop is a neutral data-vis primitive. Don't use `--green` for chart fills/knobs unless the chart is explicitly communicating a positive/success state.

---

## Do / Don't

| ✓ Do | ✗ Don't |
|---|---|
| Use tokens for every color value | Hardcode hex values in components |
| Even font sizes only (10, 12, 18, 30, 46) | Use fractional sizes (11.5, 12.1) |
| Pick one of the 12 type tokens via the `T_*` style fragments | Inline `fontWeight: 700, fontSize: 18` etc. as a one-off |
| Inter or JetBrains Mono only | Use Geist, system-ui, or any other font |
| 20px card padding on all sides | Mix 24px top with 20px sides |
| 0px gap between card title and subtitle | Add spacing between title and subtitle |
| Title sits directly above content with no rule | Add a 1px separator between header and content |
| 20px from title to body content (header padding-bottom 0, body padding-top 20) | Stack 12px header bottom + 20px body top — that's 32px, the bug we removed |
| 12px gap between every card in MainContent (8px only inside sub-card grids) | Mix gap values across the same scale — pick 12 for top-level, 8 for sub-card grids, don't blend |
| Borders only on buttons / action-items (two registered container exceptions: Workload ID pill, Floating Status Pills) | Add a `border` to cards, sub-cards, sidebar, StatusBar, badges, list rows, tooltips |
| Every nested rectangular surface is an Inner Card (`--bg-elevated` + 8px radius) | Use a custom bg/radius for one nested surface and skip it on another |
| Reference `var(--token-name)` in CSS | Use opacity/alpha shortcuts not in the token list |
