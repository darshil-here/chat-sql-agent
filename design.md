# OpenCode-Inspired Design System (for our AI Chat App)

## 1) Reference Sources
- Repo: `https://github.com/chris-tse/opencode-web`
- Primary token file: `/Users/darshil/Documents/Codex/2026-05-28/okay-listen-to-me-i-will/opencode-web/src/index.css`
- Core UI primitives: `src/components/ui/*` (`button`, `input`, `textarea`, `select`, `avatar`, `scroll-area`)
- Chat layout patterns: `src/App.tsx`, `src/components/Chat/*`
- Visual reference: attached screenshot (dark terminal-style OpenCode session UI)

## 2) What the Repository Uses Today (Base System)
This project uses Tailwind v4 + shadcn-style CSS variables (`components.json` style: `new-york`, baseColor `neutral`).

### 2.1 Core Radius Tokens
- `--radius: 0.625rem` (10px)
- `--radius-sm: calc(var(--radius) - 4px)` => 6px
- `--radius-md: calc(var(--radius) - 2px)` => 8px
- `--radius-lg: var(--radius)` => 10px
- `--radius-xl: calc(var(--radius) + 4px)` => 14px

### 2.2 Semantic Color Tokens (from `index.css`)
#### Light
- `--background: oklch(1 0 0)`
- `--foreground: oklch(0.145 0 0)`
- `--card: oklch(1 0 0)`
- `--primary: oklch(0.205 0 0)`
- `--primary-foreground: oklch(0.985 0 0)`
- `--secondary: oklch(0.97 0 0)`
- `--muted: oklch(0.97 0 0)`
- `--muted-foreground: oklch(0.556 0 0)`
- `--border: oklch(0.922 0 0)`
- `--input: oklch(0.922 0 0)`
- `--ring: oklch(0.708 0 0)`
- `--destructive: oklch(0.577 0.245 27.325)`

#### Dark
- `--background: oklch(0.145 0 0)`
- `--foreground: oklch(0.985 0 0)`
- `--card: oklch(0.205 0 0)`
- `--primary: oklch(0.922 0 0)`
- `--primary-foreground: oklch(0.205 0 0)`
- `--secondary: oklch(0.269 0 0)`
- `--muted: oklch(0.269 0 0)`
- `--muted-foreground: oklch(0.708 0 0)`
- `--border: oklch(1 0 0 / 10%)`
- `--input: oklch(1 0 0 / 15%)`
- `--ring: oklch(0.556 0 0)`
- `--destructive: oklch(0.704 0.191 22.216)`

## 3) Typography System (Observed)
No custom webfont is configured in this repo; it currently relies on default sans stack from Tailwind/browser.

### 3.1 Type Scale in Components
- Page title: `text-2xl font-bold`
- Body/control text: `text-sm`
- Inputs/textarea: `text-base md:text-sm`
- Labels: `text-sm font-medium`
- Select labels/helper: `text-xs`

### 3.2 Recommended Font Choice for Our Chat App
To match the screenshot mood (terminal-like, modern):
- UI sans: `Inter` or `Geist Sans`
- Optional mono for code/system labels: `JetBrains Mono` or `Geist Mono`

## 4) Spacing + Sizing System (Observed)
Tailwind spacing rhythm is 4px-based.

### 4.1 Key Spacing Tokens to Standardize
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px

### 4.2 Component Metrics From Repo
- App container: `max-w-4xl`, `p-4`
- Chat scroll panel: `rounded-lg`, `border`, `p-4`, `mb-4`
- Message row gap: `gap-3`
- Bubble padding: `p-3`
- Input/button row gap: `gap-2`
- Button heights: `h-8`, `h-9`, `h-10`
- Input control height: `h-9`
- Avatar size: `size-8`

## 5) OpenCode Screenshot Style Profile (What We Should Build)
The screenshot is darker and more atmospheric than the current repo defaults. Use this as our target visual direction.

### 5.1 Visual Characteristics
- Near-black canvas, subtle warm tint
- Thin low-contrast borders/dividers
- Muted text hierarchy (not pure white)
- Dense top bar + workspace status row
- Floating input composer with soft translucent panel
- Minimal accent usage (green activity dots, restrained highlights)

### 5.2 Recommended Dark Token Set (for our app)
Use these tokens as our implementation baseline:

```css
:root {
  --radius: 10px;

  --bg-app: #0d0b0c;
  --bg-panel: #131113;
  --bg-elevated: #1a181b;
  --bg-composer: rgba(34, 30, 33, 0.86);

  --text-primary: #e7e4e6;
  --text-secondary: #a7a2a6;
  --text-muted: #7d787c;

  --border-subtle: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.16);

  --accent-positive: #32d74b;
  --accent-focus: #8a8f98;
  --accent-warning: #f4bf4f;
  --accent-danger: #ff6b6b;

  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.35);
}
```

## 6) Component Specs For Our AI Chat UI

### 6.1 App Shell
- Full-height layout (`100vh`)
- Top chrome (tab strip style) and secondary status strip
- Main canvas center-aligned with max readable width

### 6.2 Conversation Area
- Large empty-state breathing room
- Message list with vertical rhythm of 12-16px
- Assistant bubbles: dark neutral panel
- User bubbles: slightly lighter/different neutral for contrast
- Tool/status bubbles:
  - running: subtle neutral + tiny spinner/dots
  - success: neutral + green text/accent dot
  - error: low-sat red text + tinted red border

### 6.3 Composer
- Docked/floating bottom composer
- Rounded container (`radius-lg`), translucent dark fill, soft border
- 3 logical zones:
  - Prompt textarea
  - Model/mode selectors (compact)
  - Action icons + send button

### 6.4 Controls
- Default control height: 36px (`h-9`)
- Compact variant: 32px (`h-8`)
- Horizontal padding: 12-16px
- Focus ring: 3px translucent ring using `--accent-focus`

## 7) Motion + Interaction
- Use short transitions (`120ms` to `180ms`) for hover/focus/press
- Avoid bouncy effects; keep motion understated
- Streaming indicator: pulsing dots with low amplitude
- Preserve keyboard-first UX (`Enter` send, `Shift+Enter` newline)

## 8) Accessibility Baseline
- Maintain readable contrast for `text-primary` and `text-secondary`
- Minimum hit area: 32x32 for icon controls
- Distinguish states by color + icon/text (not color alone)
- Visible focus states on all interactive elements

## 9) Implementation Plan For Our App
1. Add semantic CSS variables (Section 5.2) to our global stylesheet.
2. Map existing components to semantic tokens (`bg`, `text`, `border`, `ring`).
3. Implement shell layout (top bars, conversation canvas, floating composer).
4. Unify control sizes (`h-8/h-9/h-10`) and spacing rhythm (8/12/16/24).
5. Add status colors for run/success/error tool states.
6. Tune typography with chosen sans + mono pairing.

## 10) Notes / Reality Check
- The `opencode-web` repo currently has mostly base shadcn neutral theming and does not fully match the attached screenshot's polished dark aesthetic.
- This spec intentionally combines:
  - exact repository token architecture, and
  - screenshot-aligned dark styling direction,
so we can build a UI that feels like the OpenCode interface you want.
