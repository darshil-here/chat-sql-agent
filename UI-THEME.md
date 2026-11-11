# UI theme

The source of truth is `app/globals.css`. There is no separate theme file and no `tailwind.config`. Tailwind v4 reads the CSS directly.

Two token sets live in that file:

1. Chat and app tokens that switch between light and dark.
2. Landing page tokens that stay dark in both themes.

---

## Chat and app tokens

Dark mode is the `.dark` class on `<html>`. `components/theme-provider.tsx` toggles the class and stores the choice in `localStorage` under `theme`.

| Token | Light | Dark | Utility |
| --- | --- | --- | --- |
| `--bg-app` | `#ffffff` | `#0d0b0c` | `bg-background` |
| `--bg-panel` | `#f5f5f5` | `#131113` | `bg-panel` |
| `--bg-elevated` | `#e5e5e5` | `#1a181b` | `bg-elevated` |
| `--bg-composer` | `rgba(245,245,245,0.95)` | `rgba(34,30,33,0.86)` | `bg-composer` |
| `--text-primary` | `#171717` | `#e7e4e6` | `text-text-primary` |
| `--text-secondary` | `#525252` | `#a7a2a6` | `text-text-secondary` |
| `--text-muted` | `#737373` | `#7d787c` | `text-text-muted` |
| `--border-subtle` | `rgba(0,0,0,0.10)` | `rgba(255,255,255,0.10)` | `border-border-subtle` |
| `--border-strong` | `rgba(0,0,0,0.16)` | `rgba(255,255,255,0.16)` | `border-border-strong` |
| `--accent-positive` | `#22c55e` | `#32d74b` | `text-accent-positive` |
| `--accent-warning` | `#eab308` | `#f4bf4f` | `text-accent-warning` |
| `--accent-danger` | `#ef4444` | `#ff6b6b` | `text-accent-danger` |
| `--accent-focus` | `#6b7280` | `#8a8f98` | `border-accent-focus`, `ring-accent-focus` |
| `--accent-brand` | `#4d7c0f` | `#bbf746` | `text-accent-brand`, `bg-accent-brand` |
| `--selection-bg` | `#4d7c0f` | `#bbf746` | `::selection` only |
| `--selection-text` | `#ffffff` | `#171717` | `::selection` only |
| `--shadow-soft-value` | `0 10px 30px rgba(0,0,0,0.10)` | `0 10px 30px rgba(0,0,0,0.35)` | `shadow-soft` |

The values are wired into Tailwind through `@theme inline`. Add a new token in both `:root` and `.dark`, then map it in `@theme inline` so a utility exists.

### Usage

- Page background: `bg-background`
- Card or panel: `bg-panel`
- Nested surface: `bg-elevated`
- Default copy: `text-text-primary`
- Supporting copy: `text-text-secondary`
- Labels and metadata: `text-text-muted`
- Dividers and card borders: `border-border-subtle`
- Brand icon or link: `text-accent-brand`
- Error state: `text-accent-danger`, `border-accent-danger/30`

Do not hardcode `#fff` or `#000` in chat components. Use the tokens so both themes keep working.

---

## Landing page tokens

The landing page is intentionally dark in both themes. These values do not change when the theme changes.

| Token | Value | Use |
| --- | --- | --- |
| `--lp-bg` | `#171717` | Page background |
| `--lp-surface-mid` | `#1a1a1a` | Alternate section background |
| `--lp-card-surface` | `#1e1e1e` | Cards and chat mockup |
| `--lp-text-on-dark` | `#ffffff` | Headlines and primary copy |
| `--lp-text-secondary` | `#d4d4d4` | Body copy |
| `--lp-text-muted` | `#737373` | Footer and meta text |
| `--lp-primary` | `#bbf746` | CTA, links, accents |
| `--lp-primary-hover` | `#a3e635` | CTA hover |
| `--lp-border-dark` | `#333333` | Borders |
| `--lp-badge-text` | `#171717` | Text on lime buttons |
| `--lp-shadow-card` | layered black shadow | Card elevation |

The landing page also uses `--font-inter` from `next/font`.

---

## Typography

| Role | Font | Variable |
| --- | --- | --- |
| Body and chat | Geist Sans | `--font-geist-sans` |
| Code and SQL | Geist Mono | `--font-geist-mono` |
| Landing page | Inter | `--font-inter` |

All three are loaded in `app/layout.tsx` with `next/font/google`. No font files are checked into the repo.

---

## Radius and shadow

Components use Tailwind's default radius scale: `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`.

There is no custom radius token. If you need one, add `--radius-*` in `@theme`.

`shadow-soft` is the only custom shadow. It reads `--shadow-soft-value`, so it changes with the theme.

---

## Motion

- Hover and focus transitions: 150ms to 300ms.
- Chat guide open and close: 300ms with `cubic-bezier(.16,1,.3,1)`.
- Landing sections fade in with `.scroll-reveal` and an `IntersectionObserver`.
- The primary CTA uses `.btn-shiny`, a rotating conic gradient on hover.

Keep new motion short and understated. Avoid bounce easing.

---

## Accessibility

- Keep `text-text-muted` on `bg-panel` for secondary copy. It is the lowest contrast pair in the system.
- Every icon-only button needs an `aria-label`.
- Focus states use `ring-accent-focus` or `border-accent-focus`.
- Do not rely on color alone for status. The tool card pairs color with an icon and a label.
