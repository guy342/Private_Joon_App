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
| ~~Stat tile number ("98")~~ | _retired with Health & Performance redesign — there are no more stat tiles_ |
| ~~Stat tile unit ("%", "h")~~ | _retired_ |
| ~~Stat tile caption~~ | _retired_ |
| Health & Performance "Total rules" label | `--type-body` w/ `--text-secondary` |
| Health & Performance "730" hero number | `--type-display` |
| Health & Performance "/ 1,250" total | `--type-body` w/ `--text-tertiary` |
| Health & Performance breakdown row label ("Deployed", "Proposals", "In test") | `--type-body` w/ `--text-secondary` |
| Health & Performance breakdown row value | `--type-body-semibold` w/ `--text-primary` |
| Telemetry uptime "98%" | `--type-stat-num` (98) + `--type-stat-unit` (%) |
| Telemetry completeness "98%" | `--type-stat-unit` (98) + bolded `--type-body-semibold` (%) |
| Response time "4.2 / 18.5" | `--type-stat-unit` + bolded `--type-body-semibold` (h) |
| Response time caption ("To fix", "To close gaps") | `--type-body` w/ `--text-secondary` |
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
| WorkloadDistribution table header ("ID", "Rule Name"…) | `--type-body` w/ `--text-tertiary` |
| WorkloadDistribution data cell text (id, rule name, technique, status…) | `--type-body` w/ `--text-primary`; selected row's ID column shifts to weight 600 |
| WorkloadDistribution Category chip ("Execution") | `--type-caption` via `<NeutralBadge size="md">` |
| WorkloadDistribution SeverityBadge ("Critical" / "High" / "Medium" / "Low") | `--type-caption` w/ severity-tier color |
| WorkloadDistribution SearchField placeholder ("Search rules by name, tact") | `--type-body` w/ `--text-secondary` |
| WorkloadDistribution FilterPill label ("All Statuses" / "All Activities") | `--type-body` w/ `--text-secondary` |
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

### Severity (workload / detection severity tiers)

| Token | Hex | Usage |
|---|---|---|
| `--severity-critical` | `#e40054` | Critical-severity badge fg (WorkloadDistribution + future severity surfaces) |
| `--severity-critical-bg` | `rgba(228, 0, 84, 0.05)` | Critical-severity badge bg |
| `--severity-high` | `#ff7300` | High-severity badge fg |
| `--severity-high-bg` | `rgba(255, 115, 0, 0.05)` | High-severity badge bg |

Medium and Low **reuse** existing brand tokens — same hex, different semantic role at the call site:
- Medium → `--green` / `--green-bg` (`#03d07d`)
- Low → `--blue` / `--blue-bg` (`#2684ff`)

Don't add `--severity-medium` / `--severity-low` aliases — they'd be hex-identical to `--green` / `--blue` and just create a token-vs-token decision at every call site.

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

Children that should fill the full 1400px need `align-self: stretch` (because of `align-items: flex-start`). **Per-card width caps:** ProposalDrivers and Teamwork cards each have `max-width: 600px` set on their `<Card>` style.

**MainContent card stack (top → bottom):**

1. `<StatusBar />` — full-width
2. **Row 1** — `gridTemplateColumns: "880px minmax(0, 1fr)"`, gap 12, **`height: 420` + `minHeight: 420`** — Health & Performance (left, 880px fixed) + Proposal Drivers (right, fills). The fixed 420 cascades down: Card stretches via grid `align-items: stretch` (default); H&P's body div has `flex: 1 0 0 + minHeight: 0` to fill the remaining height after CardHeader; the right-stack grid splits the resulting space 50/50.

> **`height` + `minHeight` together** is mandatory for fixed-height rows that are flex items (i.e. inside `<main>`'s flex column). `height: 420` alone sets the flex basis, but `<main>`'s default `flex-shrink: 1` (which Tailwind v4's preflight allows to bypass content min-height) clamps the row down to its content min-size — observed in practice dropping from 420 to 228. Adding `minHeight: 420` enforces a hard floor the flex algorithm can't shrink below. Always pair the two for any fixed row height inside `<main>`.
3. **Row 2** — `gridTemplateColumns: "880px minmax(0, 1fr)"`, gap 12 — Active Workload Queue (left, 880px fixed) + a flex column on the right (`gap: 12, minWidth: 0`) stacking Teamwork above Last Covered
4. `<DetectionCoverageHeatmap />` — full-width
5. `<WorkloadDistribution />` — full-width

The 880px is the canonical "primary card" width for two-column rows. Both rows use the same template so the left edges of Health & Performance and Active Workload Queue line up vertically.

`minmax(0, 1fr)` on the right column is mandatory — without the `0` lower bound, a card with wide intrinsic content (e.g. Proposal Drivers' max-width 600 lollipop rows) could blow past its allocation. Same rule we use on the bottom rows whenever a card with wide intrinsic content might force its column wider.

> **`minmax(0, fr)` rule:** any grid row containing a card whose content can exceed the column's width (horizontal scroll, very long table, etc.) must use `minmax(0, ...fr)` instead of plain `1fr` / `Nfr`. CSS Grid's default `1fr` resolves to `minmax(auto, 1fr)`, where `auto` honors the item's min-content — and a horizontal-scroll card's min-content is its full unwrapped content. `minmax(0, ...)` overrides that. Pair with `min-width: 0` on the card itself (passed via the `style` prop) for defense in depth — the heatmap's `<Card>` does this. Without both, the inner `overflow-x: auto` never fires because the parent has already grown to fit.
>
> **The same rule applies to ROW splits (height).** When two cards need to split a parent's height 50/50 and they have different intrinsic min-heights, **don't** use `display: flex; flex-direction: column` with `flex: 1 0 0` on each — the flex algorithm starts each item from its min-content size and distributes only the FREE space, so the taller-content card eats more of the parent's height. Use `display: grid; gridTemplateRows: minmax(0, 1fr) minmax(0, 1fr)` instead — the `minmax(0, ...)` rows ignore content min-size and always split exactly evenly. The H&P right column does this for Telemetry uptime + the bottom row.

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

### Health & Performance

Top-of-page card. Three-zone layout: Total Rules panel on the left (fixed 516px), and a vertical right column with Telemetry uptime above and a row of Telemetry completeness + Response time below. Lives in `src/app/detection/page.tsx`. Built on four reusable primitives — `<StackedRulesBar>`, `<RulesBreakdownRow>`, `<Sparkline>`, `<DotGrid>` — plus the existing `<Card>` / `<CardHeader>` / `<IconBtn>` / `<DeltaBadge>` / `INNER_CARD`.

#### Layout

```
Card (--bg-card #1a1c22, 16 radius, alignSelf: stretch)
├── CardHeader (title + subtitle + Jira IconBtn)
└── Body (padding: 20, flex row, gap: 8, alignItems: stretch)
    ├── Total Rules panel (Inner Card, flex: 1 0 0 + minWidth: 0, padding: 20 24 24, gap: 16) — splits evenly with the right stack inside the 880px outer
    │   ├── Header row (label + DeltaBadge ↑ 1.6%)
    │   ├── Big stat (T_DISPLAY "730" + T_BODY "/ 1,250")
    │   └── Bar + list wrapper (flex-col, gap: 24, flex: 1 0 0, alignSelf: stretch) — fills the remaining panel height
    │       ├── <StackedRulesBar/>
    │       └── List (flex-col, padding: 0 4px, justify-content: space-between, alignItems: center, flex: 1 0 0, alignSelf: stretch)
    │           ├── <RulesBreakdownRow Deployed/>
    │           ├── <RulesBreakdownSeparator/>
    │           ├── <RulesBreakdownRow Proposals/>
    │           ├── <RulesBreakdownSeparator/>
    │           └── <RulesBreakdownRow In test/>
    └── Right stack (flex: 1, **CSS Grid** with `gridTemplateRows: minmax(0, 1fr) minmax(0, 1fr)`, gap: 8, minWidth: 0, minHeight: 0)
        ├── Telemetry uptime (Inner Card) — first grid row, fills evenly with the bottom row
        │   ├── Header row (label + DeltaBadge)
        │   └── Bottom row: T_STAT_NUM/UNIT "98%" + <Sparkline/>
        └── Bottom row (flex row, gap: 8, minHeight: 0, minWidth: 0) — second grid row, fills evenly with Telemetry uptime
            ├── Telemetry completeness (Inner Card, content-sized, flexShrink: 0)
            │   ├── Label + small stat "98%"
            │   └── <DotGrid filled={98}/>
            └── Response time (Inner Card, flex: 1, minWidth: 0, flex-col, gap: 12)
                ├── Label "Response time"
                └── Data div (flex-col, justify-content: flex-end, alignItems: flex-start, gap: 12, flex: 1 0 0, alignSelf: stretch) — pins data lines to bottom of available height
                    ├── <ResponseTimeRow value="4.2" unit="h" caption="To fix"/>
                    ├── 1px separator (alignSelf: stretch)
                    └── <ResponseTimeRow value="18.5" unit="h" caption="To close gaps"/>
```

#### `<StackedRulesBar>` — primitive

Three-segment progress bar (16px tall, gap 4) representing rule status distribution. Asymmetric corner radii so the outer ends are rounded pills and the inner ends stay subtly squared. Segment widths are visual-fixed per the design (Deployed grows to fill; Proposals 75px; In test 6px sliver) — wire to data-proportional widths when integrating real data.

| Segment | Background | Width | Corners (TL TR BR BL) |
|---|---|---|---|
| Deployed | `linear-gradient(to right, #026a40, #03d07d)` | `flex: 1 0 0` | 100/2/2/100 |
| Proposals | `#6af0ba` | `75px` | 2/2/2/2 |
| In test | `#e8fff6` | `6px` | 2/100/100/2 |

The three segment colors are also the three breakdown-row dot colors (`#03d07d` → Deployed, `#6af0ba` → Proposals, `#e8fff6` → In test). Same palette across the bar and dots — single source of truth visually. These are inlined raw hex (not tokens) because they're scoped to this single visualization; promote to tokens if reused elsewhere.

#### `<RulesBreakdownRow color label value>` — primitive

Dot + label (left), value (right). Height 38, alignSelf: stretch. Dot is `10×10` rounded-999 in the segment color. Reusable for any "list with category color indicator" pattern.

#### `<RulesBreakdownSeparator>` — primitive

Hairline 1px line at `--border` (#23252a), alignSelf: stretch. Rendered as a **sibling** flex item between rows (not nested inside `<RulesBreakdownRow>`) so it participates in the parent list's `justify-content: space-between` distribution. With 3 rows + 2 separators as 5 evenly-spaced flex children, each separator naturally lands at the midpoint between its two adjacent rows.

> **Why sibling-rendered, not row-internal**: nesting the separator inside the row would tie it to the row's height/position. With sibling rendering, the parent's space-between can distribute rows AND separators across the available height as 5 equal stops — which is the only way to get clean midpoint separators when the list is `flex: 1 0 0` and grows to fill its container.

#### `<Sparkline data height color strokeWidth>` — primitive

SVG `<polyline>` over normalized data. Uses `viewBox` + `preserveAspectRatio="none"` so the curve **stretches horizontally** to fit any container width without distorting the stroke (`vector-effect="non-scaling-stroke"` keeps the line at the requested px width regardless of horizontal scale). Default color `#03d07d` (brand green).

Reusable: pass any `data: number[]` — the polyline normalizes to fit the box vertically. Default height 52, stroke 1.5.

#### `<DotGrid filled total columns dotSize gap>` — primitive

N×M grid of small dots representing percentages. `filled` dots use `--green` (`#03d07d`); the remainder use `rgba(3,208,125,0.20)` (dimmed green). Defaults: 100 total, 25 columns × 4 rows, dot size 4, gap 4. Reusable for any "out of N" progress visualization.

#### Type token mapping (Figma → design system)

The Figma uses several font sizes that don't exist in the canonical 12-token scale. They're mapped to the closest existing token rather than introducing one-off sizes:

| Element | Figma | Mapped to |
|---|---|---|
| Total rules "730" | Inter Bold 64 / 46 | `T_DISPLAY` (Inter Bold 46/46) |
| Telemetry uptime "98%" | Inter Bold 44 + 24 | `T_STAT_NUM` (30) + `T_STAT_UNIT` (18) |
| Telemetry completeness "98%" | Inter Bold 20 + 12 | `T_STAT_UNIT` (18) + bolded `T_BODY_SEMI` (12) |
| Response time "4.2 / 18.5" | Inter Bold 20 + 12 | `T_STAT_UNIT` (18) + bolded `T_BODY_SEMI` (12) |
| Breakdown row values "210 / 95 / 72" | Geist Semi Bold 14 / 16 | `T_BODY_SEMI` (Inter SemiBold 12/18) — Geist isn't in the project per Fonts rule |

If the visual hierarchy ever feels too compressed, the right move is **adding canonical tokens** (e.g. `T_STAT_LG` 44/normal, `T_STAT_MID` 20/22) — not inlining `fontSize` overrides at call sites. None added in this iteration; revisit if multiple components want the larger scale.

#### Retired patterns

The previous Health & Performance had a 4-tile 2×2 grid on the right (`<StatTile icon stat unit caption delta>` with Lucide icon-circle + delta badge per tile) and a 4-segment stacked bar (Deployed / Drafts / Proposals / In test). Both retired with this redesign:
- `<StatTile>` is gone — its right-column slot is replaced by Telemetry uptime + Telemetry completeness + Response time as separately-shaped Inner Cards.
- "Drafts" is no longer a tracked breakdown category — only Deployed / Proposals / In test remain.
- The lucide icons that were exclusive to StatTile (`HeartPulse`, `ShieldCheck`, `Signal`, `Timer`) are removed from the imports.

---

### Detection Coverage Heatmap

Card with a horizontally scrollable grid of tactic columns. Each column is a fixed-width vertical stack of Inner-Card-shaped tiles colored by coverage tier. Lives in `src/app/detection/page.tsx` as four reusable primitives — `<HeatmapCell>`, `<HeatmapColumn>`, `<HeatmapLegend>`, `<HeatmapSlider>` — plus the composed `<DetectionCoverageHeatmap>`.

**Why split into primitives**: each piece is reusable on its own — `<HeatmapSlider>` works against any horizontally-scrolling element via its `scrollRef` prop (not heatmap-specific); `<HeatmapCell>` is just an Inner Card with a tier override and could anchor any future tier-colored grid; `<HeatmapLegend>` reads its swatches from `HEATMAP_TIERS` so it stays in sync if the palette changes. Add a new tier by editing **two** places only — `tokens.css` and `HEATMAP_TIERS`.

#### Layout

```
Card (--bg-card #1a1c22, 16 radius)
├── CardHeader (20 sides + top, 0 bottom — title "Detection Coverage Heatmap" + subtitle "Covered by Dawn" + right=IconBtn maximize-2)
└── Body (paddingY: 20, no horizontal padding, gap: 28, flex column, min-width: 0)
    ├── Scroll container (display: flex, gap: 8, overflow-x: auto, .no-scrollbar, paddingLeft: 20, paddingRight: 20)
    │   └── HeatmapColumn × N (each 145px wide, flexShrink: 0)
    │       ├── Column header (padding: 0 12px — category over percent)
    │       └── HeatmapCell × N (gap: 8 between cells)
    └── Footer (flex, justify: space-between, align: center, alignSelf: stretch, paddingLeft: 20, paddingRight: 20)
        ├── HeatmapLegend (5 dots + labels — gap: 16, paddingRight: 86, flexShrink: 0)
        └── HeatmapSlider (custom scroll indicator — flex: 1 0 0, min-width: 160)
```

The 28px body gap brackets the column grid and footer (matches Figma). Title-to-grid gap is the canonical 20 (CardHeader pb=0 + body pt=20).

**Edge-to-edge scroll bleed:** horizontal padding lives on the **scroll container itself** (`paddingLeft/Right: 20`), not on the body wrapper. The padding becomes part of the scroll content, so:
- At rest (`scrollLeft = 0`): the 20px left padding is visible, columns sit 20px off the card's left edge.
- Mid-scroll: the padding scrolls off and columns reach the card's actual left/right edges — the heatmap content bleeds edge-to-edge as the user pans.
- At max scroll: the 20px right padding is visible after the last column, mirroring the rest position on the other side.

The footer keeps its horizontal padding fixed at 20px (legend and slider are anchored relative to the card edges, independent of scroll position).

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

**Cursor-tracking spotlight (hover):** every cell carries a soft radial glow that follows the cursor while hovering. The cell is `position: relative; overflow: hidden`; mouse `clientX/Y` minus the cell's `getBoundingClientRect()` gets written to the cell's own `--spot-x` / `--spot-y` CSS variables via `el.style.setProperty` inside `onMouseMove` — direct DOM writes, no React re-render per move. A sibling overlay (`position: absolute; inset: 0; pointer-events: none; mix-blend-mode: plus-lighter`) renders `radial-gradient(140px circle at var(--spot-x) var(--spot-y), color-mix(in oklab, <spotlight color> 28%, transparent), transparent 65%)`. The overlay's `opacity` toggles between 0 and 1 via a `useState` hover flag with a 180ms ease-out transition, so enter/leave fades but cursor motion stays GPU-cheap. Spotlight color = the tier's `bar` for tier-tinted cells, `--text-primary` (`#f2f4f7`) for empty cells. **`mix-blend-mode: plus-lighter`** is what makes the glow look like light: it adds the gradient color to whatever is beneath, brightening both the bg and the text inside the spot rather than overlaying them. Don't drop the blend mode for a flat `rgba` fill — you'll get a muddy disk instead of a torch.

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
height: 3                                            /* matches Figma; box-sizing border-box means content area is 1px (3 − 2 × 1px border), gradient renders in that strip */
position: relative
border-radius: 3                                     /* explicit — clamps to 1.5 (half-height) */
border: 1px solid rgba(255,255,255,0.05)             /* very faint outline so the bar reads against the card bg */
background: linear-gradient(90deg,
  #07D582 0%,                                        /* bright green, full --green tier */
  #0ABE77 12.5%,
  #0DA86B 25%,
  #137B54 50%,
  #1E2026 100%                                       /* fades into card-elevated tone at the right */
)
background-clip: padding-box                         /* gradient stops at the border's inner edge — without this the gradient bleeds through the translucent border at the corners and produces a faint stray-pixel artifact on the right end */
box-sizing: border-box                               /* keeps the 3px height inclusive of border */
min-width: 160
max-width: 360                                        /* keeps the slider compact on wide viewports — the leftover space sits between legend and slider via the footer's justify-content: space-between */
opacity: visible ? 1 : 0
transition: opacity 200ms ease
```

**Single-layer rule**: the bar must be ONE div with `border`, `border-radius`, and `background` all set on the same element. Don't introduce a wrapper just for the border or another for the gradient — splitting causes the corner clip and the border stroke to render against different bounding boxes, which produces stray pixels at the rounded ends. The thumb is the only descendant; everything else lives on the track div itself.

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
background: #fff
cursor: grab
touch-action: none
className: "heatmap-slider-thumb"                    /* drop shadow + hover halo — see globals.css */
```

Drop shadow and hover halo both live on the `.heatmap-slider-thumb` CSS class via **stacked `box-shadow`s** — the drop shadow always present, plus a `0 0 0 4px <color>` spread shadow that animates from `rgba(255,255,255,0)` → `rgba(255,255,255,0.10)` on `:hover`. Transition fires on `box-shadow` (not on the rule swap), so both shadows interpolate cleanly together.

**Why box-shadow, not border:** a `border` sits INSIDE the box (with `box-sizing: border-box` it shrinks the white center to 12×12 on hover, with `content-box` it would push surrounding content). The halo needs to live OUTSIDE the 20×20 knob so the white center stays full size in both states. `box-shadow` with positive spread is the right primitive — it always paints outside the box and doesn't participate in layout. The drag pointer events still hit-test against the 20×20 knob itself; the halo is purely a visual.

Don't add an inline `box-shadow` on the thumb — it would override the class's declaration and break the hover transition. Drop shadow lives in the class.

**Sync mechanism:** `ResizeObserver` on both the scroll element AND the track (so the knob position recalculates on either resize) + a passive `scroll` listener. Drag via `pointer-events` with `setPointerCapture` — works for mouse, touch, and pen.

**It is not heatmap-specific.** Drop it next to any other horizontal scroll surface — pass that surface's ref and it works. The 20×20 knob and 3px gradient track are the canonical "scroll handle" pattern in this app.

**Iteration history:**
- v1 (2026-05-08, retired same day): proportional pill thumb (`width = visible/total × trackWidth`) on a flat `rgba(255,255,255,0.05)` track. Visually too utilitarian — read as a generic scrollbar, not a designed component.
- v2 (2026-05-08, retired same day): fixed 20×20 white knob with halo on a 3px gradient track + `border-radius: 12`. Track was too thin — the radius got clamped to 1.5px (half-height) and the pill ends weren't visibly rounded.
- v3 (2026-05-08, retired same day): same knob, track bumped to 6px tall + `border-radius: 999`.
- v4 (2026-05-08, retired same day): same dimensions, `border-radius: 3`. Designer flagged a stray green pixel at the right end — turned out to be the gradient bleeding through the translucent border at the rounded corner.
- v5 (2026-05-08, retired same day): track back to **3px height** + `border-radius: 3`, with `background-clip: padding-box` and `box-sizing: border-box`. Halo always visible.
- v6 (2026-05-08, retired same day): hover halo via `.heatmap-slider-thumb` CSS class using a `border`. Halo lived INSIDE the 20×20 box (border-box), shrinking the white center to 12×12 on hover but never visibly extending around the knob — designer flagged it as "invisible".
- v7 (current, 2026-05-08): same hover trigger, but halo is a **`0 0 0 4px <color>` spread `box-shadow`** instead of a border. Lives outside the box so the white center stays 20×20 and the halo extends to a 28×28 visual footprint. Drop shadow stacked into the same `box-shadow` declaration so both shadows transition together. Slider also gained `max-width: 360` on the track for ~30% shorter rendering on wide viewports.

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

### Workload Distribution

Card with a search/filter header and a 10-column data table. Lives in `src/app/detection/page.tsx`. Built on three new reusable primitives — `<SearchField>`, `<FilterPill>`, `<SeverityBadge>` — plus the existing `<Card>` / `<CardHeader>` / `<IconBtn>` / `<NeutralBadge>` (now with a `size` prop).

#### Layout

```
Card (--bg-card #1a1c22, 16 radius, alignSelf: stretch, minWidth: 0)
├── CardHeader (20 sides + top, 0 bottom)
│   ├── Left: title "Workload Distribution" (T_HEADING) + subtitle "Tickets & Backlog" (T_BODY tertiary)
│   └── Right: action group (flex, gap: 12)
│       ├── SearchField (width: 247)
│       ├── FilterPill icon=ListFilter label="All Statuses"   (width: 132)
│       ├── FilterPill icon=ListFilter label="All Activities" (width: 132)
│       └── IconBtn (ArrowUpRight 14×14)
└── Body (padding: 16 20 20)
    └── Grid (10 columns: 100, 267, 7×minmax(0, 1fr), 44)
        ├── Header row × 10 cells (T_BODY tertiary, borderBottom: 1px var(--border))
        └── Data row × N — flat grid using `display: contents` row wrappers so a
            single onClick covers all 10 cells; selected row gets bg --bg-elevated
            and the action column reveals the ArrowUpRight icon. ID cell weight
            shifts 400 → 600 on selection.
```

The table is a single CSS grid (not nested rows) so columns align automatically. Each "row" is a fragment-equivalent (`display: contents`) wrapper — its only purpose is to attach a single `onClick` to all ten cells. The wrapper itself is invisible to layout, so the grid sees a flat sequence of cells.

#### `<SearchField>` — primitive

```
height: 34
padding: 0 12
border-radius: 100
background: rgba(255,255,255,0.05)         /* --white-5 — input-like surface, lighter than the action pills */
display: flex, gap: 4, alignItems: center
flex-shrink: 0
```

Search icon (16×16, `--text-secondary`) + placeholder text (`T_BODY` `--text-secondary`, ellipsis). Currently a display-only `<div>`; promote to a real `<input>` when wiring real state. `width` is a prop (number or string).

#### `<FilterPill>` — primitive (dropdown-shaped button)

Same shape as the StatusBar's "Last 7 days" date button, generalized to take any lucide icon + label. Pattern:

```
height: 34
padding: 0 13
border-radius: 100
border: 1px solid var(--border)            /* registered button border */
background: #1f2126                         /* StatusBar action-pill color (raw hex, see Backgrounds) */
T_BODY, color: --text-secondary
flex-shrink: 0
```

Layout: `[icon 16] [label, ellipsis]` (left-grouped) and `[ChevronDown 11]` (right-anchored), with `justify-content: space-between`. Width prop optional.

The `#1f2126` background is the same raw-hex used by StatusBar action pills — this is the second documented use, so promote to a token (`--bg-action-pill`) on the next refactor pass. Until then keep the raw hex. **Don't** use `--bg-icon` (#292b31) for these — that token is reserved for icon-only buttons.

#### `<SeverityBadge>` — primitive

```
font: T_CAPTION
border-radius: 999
padding: 2px 10px
background: SEVERITY_COLORS[tier].bg
color:      SEVERITY_COLORS[tier].fg
```

Reads from `SEVERITY_COLORS` (in `page.tsx`) so the palette is the single source of truth. Adding a new tier means editing `tokens.css` (if non-existing color) AND `SEVERITY_COLORS`.

#### `<NeutralBadge size="sm" | "md">` — extended

The existing NeutralBadge gained a `size` prop. `sm` (default) keeps its prior `padding: 2px 6px` for small labels like "+2" / "3". `md` uses `padding: 2px 10px` and is what the WorkloadDistribution **Category** chips use. Same bg/color either way (`rgba(255,255,255,0.05)` / `--text-tertiary`).

#### Row hover treatment

The row "selected" visual is **purely a hover state** — no click handler, no React state. Implemented entirely in CSS via three classes on the row's children:

| Class on cell | What hover does |
|---|---|
| `.workload-cell` (every cell) | bg `transparent` → `--bg-elevated` (#1e2026) on `.workload-row:hover` |
| `.workload-cell-id` (ID cell only) | font-weight `400` → `600` (Inter Semi Bold) on `.workload-row:hover` |
| `.workload-cell-action-icon` (the ArrowUpRight `<svg>`) | `opacity: 0` at rest → `1` on `.workload-row:hover`. Icon is always rendered; only its alpha animates. |

The row wrapper has `display: contents` so the grid still sees a flat sequence of cells — but `:hover` still fires on the wrapper when the cursor is over any descendant, and the cascade reaches all the cells in one rule. **250ms ease-out** on the bg + icon opacity — long enough to read as a deliberate fade (not a snap), short enough not to drag when the cursor is moving down the table fast. `ease-out` fronts the speed so the row "lands" softly into its hovered state.

Don't reintroduce a `useState`-driven hover/selected pattern: pure CSS is faster (no React re-render on every mouseenter) and the row treatment never needs to outlive the cursor's presence over it.

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

**Content area layout:** `display: flex; padding: 20px; flex-direction: column; justify-content: space-between; align-items: flex-start; flex: 1 0 0; align-self: stretch`. Rows distribute via `space-between` across the full card height (no fixed `gap`), so the chart fills whatever vertical space the grid row gives it — first row pinned to top under the header, last row pinned to bottom, remaining rows evenly spaced. Because `align-items: flex-start` doesn't stretch children on the cross axis, each `ProposalRow` carries its own `align-self: stretch` to keep the lollipop bars full-width (same pattern as the Total Rules left panel).

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
