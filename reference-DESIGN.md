---
name: Verdant SaaS
url: https://verdant-saas-21.aura.build/
colors:
  background: '#ffffff'
  background-dark: '#171717'
  text-primary: '#171717'
  text-secondary: '#d4d4d4'
  text-muted: '#737373'
  text-on-dark: '#ffffff'
  primary: '#bbf746'
  primary-hover: '#a3e635'
  primary-active: '#84cc16'
  primary-disabled: '#d9f99d'
  surface-light: '#f5f5f5'
  surface-dark: '#171717'
  border-light: '#e5e5e5'
  border-dark: '#333333'
  link: '#bbf746'
  link-hover: '#a3e635'
  link-visited: '#84cc16'
  focus-ring: '#bbf746'
  badge-new-bg: '#bbf746'
  badge-new-text: '#171717'
typography:
  display:
    family: 'Inter'
    size: 48px
    weight: 600
    line-height: 1.1
  heading-1:
    family: 'Inter'
    size: 48px
    weight: 600
    line-height: 1.1
  body:
    family: 'Inter'
    size: 16px
    weight: 400
    line-height: 1.5
  caption:
    family: 'Inter'
    size: 11px
    weight: 400
    line-height: 1.5
  nav:
    family: 'Inter'
    size: 16px
    weight: 400
    line-height: 1.5
spacing:
  base: 4px
  scale: [4, 8, 16, 24, 32, 48, 64]
radius:
  sm: 4px
  md: 12px
  full: 9999px
elevation:
  card: 'rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.15) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset'
  tooltip: '0px 2px 4px rgba(0,0,0,0.1)'
  modal: '0px 8px 24px rgba(0,0,0,0.2)'
motion:
  duration-base: '0.8s'
  duration-fast: '0.3s'
  easing-standard: 'cubic-bezier(0.16, 1, 0.3, 1)'
  easing-shiny-cta: 'cubic-bezier(0.25, 1, 0.5, 1)'
  easing-strong: 'cubic-bezier(0.22, 1, 0.36, 1)'
layout:
  breakpoints:
    mobile-small: 360px
    mobile-large: 600px
    tablet: 768px
    desktop: 1024px
    desktop-large: 1280px
    desktop-xl: 1536px
components:
  button-primary:
    bg: '{colors.primary}'
    text: '{colors.text-primary}'
    radius: '{radius.md}'
    padding: '14px 24px'
  button-secondary:
    bg: 'transparent'
    text: '{colors.text-on-dark}'
    radius: '{radius.md}'
    padding: '14px 24px'
  button-ghost:
    bg: 'transparent'
    text: '{colors.text-secondary}'
    radius: '{radius.md}'
    padding: '8px 16px'
  card-dark:
    bg: '{colors.surface-dark}'
    text: '{colors.text-on-dark}'
    radius: '{radius.md}'
    shadow: '{elevation.card}'
  input-text:
    bg: '{colors.surface-light}'
    text: '{colors.text-primary}'
    radius: '{radius.sm}'
    padding: '10px 12px'
  nav-link:
    color: '{colors.text-secondary}'
    padding: '8px 12px'
  badge-pill:
    bg: '{colors.badge-new-bg}'
    text: '{colors.badge-new-text}'
    radius: '{radius.full}'
    padding: '4px 10px'
---

# Design System Inspired by Verdant SaaS

## 1. Visual Theme & Atmosphere
Verdant SaaS employs a sophisticated, dark-themed aesthetic, dominated by a deep `#171717` background that provides a dramatic canvas for high-contrast typography and a vibrant `#bbf746` accent green. The hero section features a subtle, dark forest photographic background, creating depth and a sense of calm. Key information is presented with `Inter` typeface, using `48px` `600` weight for display text in `#ffffff`, with the brand's signature green highlighting crucial keywords like "grows".

The design system is characterized by soft, rounded corners with a `12px` radius on primary interactive elements and cards, contrasting with the starkness of the dark background. Subtle, layered shadows provide a sense of elevation without being overly heavy, while line-art icons in the accent green reinforce the brand's identity. The site also incorporates dynamic CSS animations such as `border-spin` and `breathe` for interactive elements, adding a subtle, modern motion layer.

Key Characteristics:
- Dark background (`#171717`) with high-contrast `#ffffff` text.
- Vibrant `#bbf746` green as the primary accent color.
- `Inter` typeface for all text, with `48px` display headings.
- Rounded corners (`12px` radius) on buttons and cards.
- Subtle, layered shadows for depth, like `rgba(0,0,0,0.15) 0px 10px 10px`.
- Monochrome line-art icons in the accent green.
- CSS keyframe animations for interactive elements.

## 2. Color Palette & Roles
The Verdant SaaS color palette is built around a dark primary background, contrasting light text, and a distinctive brand accent green.

-   **Primary**
    -   `primary` (`#bbf746`) — The brand's vibrant accent green, used for primary call-to-action buttons, emphasized text (e.g., "grows"), and interactive elements.
    -   `primary-hover` (`#a3e635`) — A slightly darker shade of green for primary button hover states (inferred from screenshot).
    -   `primary-active` (`#84cc16`) — A darker green for primary button active states, providing clear feedback (inferred from screenshot).
    -   `primary-disabled` (`#d9f99d`) — A lighter, desaturated green for disabled primary buttons, indicating non-interactivity (inferred from screenshot).

-   **Neutral Scale**
    -   `background` (`#ffffff`) — The main page background color for light sections (not visible in hero screenshot, but inferred from token `background` role).
    -   `background-dark` (`#171717`) — The dominant background color for the hero section and dark content areas.
    -   `text-primary` (`#171717`) — Used for primary body text on light backgrounds and text on primary green buttons.
    -   `text-secondary` (`#d4d4d4`) — Secondary text color, often seen on dark backgrounds for navigation links and descriptive text.
    -   `text-muted` (`#737373`) — Muted foreground text, used for less prominent information or helper text.
    -   `text-on-dark` (`#ffffff`) — Primary text color used on dark backgrounds, ensuring high readability.

-   **Surface & Borders**
    -   `surface-light` (`#f5f5f5`) — A very light gray used for subtle background tints, such as input fields and hover states on light elements.
    -   `surface-dark` (`#171717`) — Dark surface color, identical to `background-dark`, used for cards and containers within the dark theme.
    -   `border-light` (`#e5e5e5`) — A light gray for subtle borders, often seen on input fields or outline buttons.
    -   `border-dark` (`#333333`) — A dark gray for subtle borders on dark surfaces, providing minimal separation (inferred from screenshot).

-   **Interactive & System**
    -   `link` (`#bbf746`) — Standard link color, matching the primary accent for interactive text.
    -   `link-hover` (`#a3e635`) — Link color on hover, providing visual feedback (inferred from screenshot).
    -   `link-visited` (`#84cc16`) — Link color for visited states, subtly different from `link` (inferred from screenshot).
    -   `focus-ring` (`#bbf746`) — The color used for interactive element focus rings, reinforcing brand identity (inferred from screenshot).
    -   `badge-new-bg` (`#bbf746`) — Background color for "New" badges, using the primary accent.
    -   `badge-new-text` (`#171717`) — Text color for "New" badges, providing strong contrast on the green background.

## 3. Typography Rules
-   **Font Family**: 'Inter', sans-serif, for all textual content.
    -   `font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";`
    -   `font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;` (for code blocks)
-   **Hierarchy**:
    -   **Display**: `Inter` `48px` `600` · line-height `1.1` · tracking `none` · Used for prominent hero headlines.
    -   **H1**: `Inter` `48px` `600` · line-height `1.1` · tracking `none` · Main page titles and section headers.
    -   **H2**: `Inter` `32px` `600` · line-height `1.2` · tracking `none` · Secondary section titles (inferred from screenshot).
    -   **H3**: `Inter` `24px` `500` · line-height `1.3` · tracking `none` · Card titles and sub-sections (inferred from screenshot).
    -   **Body**: `Inter` `16px` `400` · line-height `1.5` · tracking `none` · Standard paragraph text and descriptive content.
    -   **Caption**: `Inter` `11px` `400` · line-height `1.5` · tracking `none` · Small print, legal text, and helper labels.
    -   **Nav**: `Inter` `16px` `400` · line-height `1.5` · tracking `none` · Top navigation links.
    -   **Code/Mono**: `SFMono-Regular` `14px` `400` · line-height `1.4` · tracking `none` · Code snippets and technical text (inferred).
-   **Principles**:
    -   Maintain strong contrast: Always pair `#ffffff` or `#d4d4d4` text on `#171717` backgrounds for readability.
    -   Emphasize with color: Reserve the `#bbf746` primary green for key words within headlines and interactive elements to guide user attention.
    -   Consistent weighting: Use `Inter` `600` for all primary headings (Display, H1, H2) to establish a clear visual hierarchy.
    -   Ample line-height: Ensure `1.5` line-height for body and caption text to improve readability, especially on dark backgrounds.

## 4. Component Stylings

### Buttons
Verdant SaaS features distinct button styles for primary actions, secondary interactions, and ghost links, all with rounded corners and subtle transitions.

**Primary Button**
A prominent, filled button in the brand's accent green, designed for key calls-to-action. It includes a subtle `border-spin` animation on the `shiny-cta` class.
```css
.button-primary {
  background-color: var(--color-primary, #bbf746);
  color: var(--color-text-primary, #171717);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 400);
  padding: 14px 24px; /* inferred from screenshot */
  border: none;
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  transition: background-color var(--motion-duration-base, 0.8s) var(--motion-easing-shiny-cta, cubic-bezier(0.25, 1, 0.5, 1)), transform var(--motion-duration-fast, 0.3s) ease-out;
}

.button-primary:hover {
  background-color: var(--color-primary-hover, #a3e635); /* inferred from screenshot */
}

.button-primary:active {
  transform: translateY(1px); /* extracted from pseudoStates */
  background-color: var(--color-primary-active, #84cc16); /* inferred from screenshot */
}

.button-primary:disabled {
  background-color: var(--color-primary-disabled, #d9f99d); /* inferred from screenshot */
  color: var(--color-text-muted, #737373); /* inferred from screenshot */
  cursor: not-allowed; /* extracted from pseudoStates */
  opacity: 0.8; /* inferred from screenshot */
}
```

**Secondary Button (Outline)**
A transparent button with a light border, used for less prominent actions or when a primary button would be too visually heavy.
```css
.button-secondary {
  background-color: transparent;
  color: var(--color-text-on-dark, #ffffff);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 400);
  padding: 14px 24px; /* inferred from screenshot */
  border: 1px solid var(--color-border-light, #e5e5e5); /* inferred from screenshot */
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  transition: background-color var(--motion-duration-fast, 0.3s) ease-out, border-color var(--motion-duration-fast, 0.3s) ease-out, transform var(--motion-duration-fast, 0.3s) ease-out;
}

.button-secondary:hover {
  background-color: rgba(229, 229, 229, 0.2); /* inferred from pseudoStates.button-outline */
  border-color: var(--color-text-on-dark, #ffffff); /* inferred from screenshot */
}

.button-secondary:active {
  transform: translateY(1px); /* inferred from shiny-cta:active */
  background-color: rgba(229, 229, 229, 0.3); /* inferred from screenshot */
}

.button-secondary:disabled {
  color: var(--color-text-muted, #737373); /* inferred from screenshot */
  border-color: var(--color-text-muted, #737373); /* inferred from screenshot */
  cursor: not-allowed; /* extracted from pseudoStates */
  opacity: 0.5; /* inferred from screenshot */
}
```

**Ghost Button (Text-only)**
A text-only button, often used for navigation or less critical actions, appearing as a clickable link but with button-like padding.
```css
.button-ghost {
  background-color: transparent;
  color: var(--color-text-secondary, #d4d4d4);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 400);
  padding: 8px 16px; /* inferred from screenshot */
  border: none;
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  transition: background-color var(--motion-duration-fast, 0.3s) ease-out, color var(--motion-duration-fast, 0.3s) ease-out, transform var(--motion-duration-fast, 0.3s) ease-out;
}

.button-ghost:hover {
  background-color: var(--color-surface-dark, #171717); /* inferred from screenshot */
  color: var(--color-text-on-dark, #ffffff); /* inferred from screenshot */
}

.button-ghost:active {
  transform: translateY(1px); /* inferred from shiny-cta:active */
  background-color: rgba(23, 23, 23, 0.8); /* inferred from screenshot */
}

.button-ghost:disabled {
  color: var(--color-text-muted, #737373); /* inferred from screenshot */
  cursor: not-allowed; /* extracted from pseudoStates */
  opacity: 0.5; /* inferred from screenshot */
}
```

### Cards & Containers
Cards are used to group related content, featuring a dark background, subtle border, and a layered shadow for depth.

**Standard Card (Dark)**
A dark-themed card used for feature highlights or content blocks, providing a contained area for information.
```css
.card-dark {
  background-color: var(--color-surface-dark, #171717);
  color: var(--color-text-on-dark, #ffffff);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 400);
  padding: 24px; /* inferred from screenshot */
  border: 1px solid var(--color-border-dark, #333333); /* inferred from screenshot */
  border-radius: var(--radius-md, 12px);
  box-shadow: var(--elevation-card, rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.15) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset);
  transition: box-shadow var(--motion-duration-fast, 0.3s) ease-out, transform var(--motion-duration-fast, 0.3s) ease-out;
}

.card-dark:hover {
  box-shadow: 0px 1px 0px 0px rgba(0,0,0,0.08), 0px 6px 6px 0px rgba(0,0,0,0.12), 0px 14px 14px 0px rgba(0,0,0,0.18), 0px -1px 0px 0px inset rgba(0,0,0,0.12); /* inferred from screenshot, slightly more pronounced */
  transform: translateY(-2px); /* inferred from screenshot */
}
```

### Inputs & Forms
Standard text input fields with a subtle light background and clear focus states.

**Text Input**
A basic text input field with a light background and a subtle border, designed for user data entry.
```css
.input-text {
  background-color: var(--color-surface-light, #f5f5f5);
  color: var(--color-text-primary, #171717);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 400);
  padding: 10px 12px; /* inferred from screenshot */
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: var(--radius-sm, 4px);
  outline: none;
  transition: background-color var(--motion-duration-fast, 0.3s) ease-out, border-color var(--motion-duration-fast, 0.3s) ease-out, box-shadow var(--motion-duration-fast, 0.3s) ease-out;
}

.input-text:hover {
  background-color: var(--color-surface-light, #f5f5f5); /* extracted from pseudoStates.edit-input */
  border-color: var(--color-text-muted, #737373); /* inferred from screenshot */
}

.input-text:focus {
  border-color: var(--color-focus-ring, #bbf746); /* inferred from screenshot */
  box-shadow: 0 0 0 2px var(--color-focus-ring, #bbf746); /* inferred from screenshot */
  outline: none; /* extracted from pseudoStates.edit-input */
}

.input-text:disabled {
  background-color: var(--color-surface-light, #f5f5f5); /* extracted from pseudoStates.disabled */
  color: var(--color-text-muted, #737373); /* inferred from screenshot */
  cursor: default; /* extracted from pseudoStates */
  opacity: 0.7; /* inferred from screenshot */
}
```

**Form Label**
Standard label styling for form fields, providing clear descriptions for inputs.
```css
.form-label {
  color: var(--color-text-primary, #171717);
  font-family: var(--typography-body-family, 'Inter');
  font-size: var(--typography-body-size, 16px);
  font-weight: var(--typography-body-weight, 500); /* inferred from screenshot */
  margin-bottom: 8px; /* inferred from screenshot */
  display: block;
}
```

### Navigation
The top navigation bar provides clear links to different sections of the site.

**Top Navigation Bar**
The main navigation area, typically transparent over hero content, with secondary text links.
```css
.nav-bar {
  background-color: transparent; /* inferred from screenshot */
  padding: 16px 64px; /* inferred from screenshot */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute; /* inferred from screenshot */
  top: 0;
  left: 0;
  z-index: 10; /* inferred from screenshot */
}
```

**Navigation Link**
Individual links within the navigation bar, styled for clear readability on dark backgrounds.
```css
.nav-link {
  color: var(--color-text-secondary, #d4d4d4);
  font-family: var(--typography-nav-family, 'Inter');
  font-size: var(--typography-nav-size, 16px);
  font-weight: var(--typography-nav-weight, 400);
  padding: 8px 12px; /* inferred from screenshot */
  text-decoration: none;
  border-bottom: 2px solid transparent; /* inferred from screenshot */
  transition: color var(--motion-duration-fast, 0.3s) ease-out, border-color var(--motion-duration-fast, 0.3s) ease-out;
}

.nav-link:hover {
  color: var(--color-text-on-dark, #ffffff); /* inferred from screenshot */
  border-color: var(--color-primary, #bbf746); /* inferred from screenshot */
}

.nav-link.active,
.nav-link[aria-current="page"] {
  color: var(--color-text-on-dark, #ffffff);
  border-color: var(--color-primary, #bbf746);
  font-weight: var(--typography-nav-weight, 500); /* inferred from screenshot */
}
```

### Links
Standard text links for inline content and secondary actions.

**Standard Link**
Inline text links that use the primary accent color and underline for emphasis.
```css
.link-standard {
  color: var(--color-link, #bbf746);
  text-decoration: underline;
  transition: color var(--motion-duration-fast, 0.3s) ease-out, text-decoration-color var(--motion-duration-fast, 0.3s) ease-out;
}

.link-standard:hover {
  color: var(--color-link-hover, #a3e635); /* inferred from screenshot */
  text-decoration: none;
}

.link-standard:visited {
  color: var(--color-link-visited, #84cc16); /* inferred from screenshot */
}
```

**Secondary Link**
Links used for less prominent actions, often appearing as plain text that highlights on hover.
```css
.link-secondary {
  color: var(--color-text-secondary, #d4d4d4);
  text-decoration: none;
  transition: color var(--motion-duration-fast, 0.3s) ease-out, text-decoration var(--motion-duration-fast, 0.3s) ease-out;
}

.link-secondary:hover {
  color: var(--color-text-on-dark, #ffffff); /* inferred from screenshot */
  text-decoration: underline;
}

.link-secondary:visited {
  color: var(--color-text-secondary, #d4d4d4); /* inferred from screenshot */
}
```

### Badges
Small informational labels, such as the "New Verdant 2.0" pill.

**Pill Badge**
A small, rounded badge used for status or new features, featuring the accent green background.
```css
.badge-pill {
  background-color: var(--color-badge-new-bg, #bbf746);
  color: var(--color-badge-new-text, #171717);
  font-family: var(--typography-caption-family, 'Inter');
  font-size: var(--typography-caption-size, 11px);
  font-weight: var(--typography-caption-weight, 400);
  padding: 4px 10px; /* inferred from screenshot */
  border: none;
  border-radius: var(--radius-full, 9999px);
  display: inline-flex;
  align-items: center;
  gap: 4px; /* inferred from screenshot */
}
```

## 5. Layout Principles
-   **Spacing System**: The spacing system is built on a `4px` base unit, with a scale derived from multiples of this unit.
    -   Base `4px` → `4`, `8`, `16`, `24`, `32`, `48`, `64`
    -   Usage Context:
        -   `4px`: Smallest gaps, icon-to-text spacing.
        -   `8px`: Inline element spacing, button inner padding (vertical).
        -   `16px`: Component internal padding, list item spacing.
        -   `24px`: Card padding, vertical spacing between minor sections.
        -   `32px`: Spacing between major components or form groups.
        -   `48px`: Section padding (vertical), large component separation.
        -   `64px`: Hero section padding, main horizontal page padding.
-   **Grid & Container** _Note: container widths and column counts are not extracted from the source. The values below are reasonable defaults inferred from the visible layout density._
    -   Max Width: `1280px` (inferred from screenshot, content appears centered within a max width).
    -   Columns: `12` columns (inferred, standard grid system).
    -   Gutter: `24px` (inferred, consistent with spacing scale).
    -   Section Padding: `64px` horizontal, `96px` vertical (inferred from screenshot).
-   **Whitespace Philosophy**: Verdant SaaS utilizes generous whitespace to create a sense of openness and focus, particularly around key content and calls-to-action. Ample padding around text blocks and between components on the dark background enhances readability and reduces visual clutter. This approach emphasizes the content and the brand's sophisticated, data-driven identity.
-   **Border Radius Scale**:
    -   `sm` (`4px`): Used for smaller interactive elements like input fields and internal component rounding.
    -   `md` (`12px`): Applied to primary buttons, cards, and main interactive components for a soft, approachable feel.
    -   `full` (`9999px`): Utilized for pill-shaped elements like badges.

## 6. Depth & Elevation
Verdant SaaS uses a subtle, layered shadow system to create depth and hierarchy, particularly for cards and modal elements.
-   **Flat (z-0)**: `none` — Default state for background elements or text.
-   **Card (z-1)**: `rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.15) 0px 10px 10px 0px, rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset` — Applied to cards and elevated content blocks for a subtle lift.
-   **Tooltip/Popover (z-50)**: `0px 2px 4px rgba(0,0,0,0.1)` — Used for small, temporary UI elements that appear above content (inferred, based on `zIndexValues`).
-   **Modal (z-100)**: `0px 8px 24px rgba(0,0,0,0.2)` — Reserved for full-screen overlays and critical interaction prompts (inferred, based on `zIndexValues`).

Shadow Philosophy: The elevation system is designed to be understated, using dark, diffused shadows to provide a sense of depth without distracting from the content. The multi-layered `card` shadow creates a realistic depth effect, while higher z-index elements use more pronounced shadows to clearly indicate their position above other content.

## 7. Do's and Don'ts

### Do's
-   **Do** use `Inter` `48px` `600` for hero headlines, ensuring `#ffffff` on `#171717` for maximum impact.
-   **Do** highlight key words in headlines, such as "grows", with `colors.primary` (`#bbf746`) to draw attention.
-   **Do** apply `radius.md` (`12px`) to all `button-primary` and `card-dark` components for a consistent soft aesthetic.
-   **Do** ensure `text-secondary` (`#d4d4d4`) on `background-dark` (`#171717`) maintains a contrast ratio of 12.09, passing AAA.
-   **Do** use `spacing.scale` values for all padding and margins; specifically, `24px` for `card-dark` internal padding.
-   **Do** implement `transform: translateY(1px)` on `button-primary:active` for a subtle press feedback.
-   **Do** use `border-light` (`#e5e5e5`) for `input-text` borders in their default state.
-   **Do** apply `colors.focus-ring` (`#bbf746`) for `input-text:focus` states, ensuring a clear and branded focus indicator.
-   **Do** ensure `text-primary` (`#171717`) on `background` (`#ffffff`) maintains a contrast ratio of 17.93, passing AAA.

### Don'ts
-   **Don't** use `Inter` `400` weight for any heading element; reserve `600` for H1, H2, and Display.
-   **Don't** introduce any new hex values for text or backgrounds that are not in the defined color palette to maintain brand consistency.
-   **Don't** use `text-muted` (`#737373`) on `surface-light` (`#f5f5f5`); their contrast ratio of 4.35 only passes AA-large, which is insufficient for small text.
-   **Don't** use arbitrary spacing values; stick strictly to the `4, 8, 16, 24, 32, 48, 64` px scale.
-   **Don't** apply `box-shadow` to elements other than `card-dark` or designated elevated components without explicit approval.
-   **Don't** use `text-decoration: underline` on `link-secondary` in its default state; reserve it for `:hover` to indicate interactivity.
-   **Don't** modify the `border-radius` of `badge-pill` from `radius.full` (`9999px`) to ensure its distinct pill shape.
-   **Don't** use `colors.primary` (`#bbf746`) for body text on dark backgrounds; use `text-on-dark` (`#ffffff`) or `text-secondary` (`#d4d4d4`) instead.

## 8. Responsive Behavior
_Note: breakpoints below are extracted from the source. These values are the brand's actual media queries._

-   **Suggested Breakpoints**:
    -   **Mobile Small** (~360px): Adjust typography sizes for `caption` and `body` to prevent overflow.
    -   **Mobile Large** (~600px): Navigation elements collapse into a hamburger menu; main `button-primary` might stack vertically.
    -   **Tablet** (~640px): Cards may transition from single to two-column layouts; horizontal padding adjusts.
    -   **Tablet** (~768px): Navigation links might re-appear; main content area expands.
    -   **Desktop** (~1024px): Full navigation bar is visible; multi-column layouts are established.
    -   **Desktop Large** (~1280px): Content container reaches its maximum width; extra padding applied to sides.
    -   **Desktop XL** (~1536px): Layout accommodates larger screens, often with increased whitespace.
-   **Touch Targets**:
    -   Minimum size for interactive elements is `44px` by `44px` to ensure easy tapping on touch devices (inferred from best practices).
    -   Maintain at least `8px` of clear space between touch targets to prevent accidental activations (inferred from best practices).
-   **Collapsing Strategy**:
    -   Navigation: Top navigation links (`nav-link`) collapse into an off-canvas menu at `600px` breakpoint.
    -   Cards: `card-dark` components transition from a multi-column grid to a single column stack on smaller screens.
    -   Typography: `display` and `heading-1` font sizes will scale down to `32px` on mobile to fit screen width.
    -   Padding: Horizontal section padding will reduce from `64px` to `24px` on mobile for better content utilization.
    -   Forms: `input-text` fields maintain full width on mobile, with labels stacking above inputs.

## 9. Agent Prompt Guide
-   **Quick Color Reference**:
    -   `background`: `#ffffff`
    -   `background-dark`: `#171717`
    -   `text-primary`: `#171717`
    -   `text-secondary`: `#d4d4d4`
    -   `text-muted`: `#737373`
    -   `text-on-dark`: `#ffffff`
    -   `primary`: `#bbf746`
    -   `primary-hover`: `#a3e635`
    -   `primary-active`: `#84cc16`
    -   `primary-disabled`: `#d9f99d`
    -   `surface-light`: `#f5f5f5`
    -   `surface-dark`: `#171717`
    -   `border-light`: `#e5e5e5`
    -   `border-dark`: `#333333`
    -   `link`: `#bbf746`
    -   `link-hover`: `#a3e635`
    -   `link-visited`: `#84cc16`
    -   `focus-ring`: `#bbf746`
    -   `badge-new-bg`: `#bbf746`
    -   `badge-new-text`: `#171717`
-   **Iteration Guide**:
    1.  Always use `colors.primary` (`#bbf746`) for all primary CTA backgrounds.
    2.  Ensure `button-primary` text is `colors.text-primary` (`#171717`) for optimal contrast.
    3.  Set `display` and `heading-1` font size to `48px` with `Inter` `600` weight.
    4.  Utilize `spacing.scale` values for all layout and component spacing, especially `24px` for card padding.
    5.  Apply `radius.md` (`12px`) to all `button-primary` and `card-dark` elements.
    6.  Implement `transform: translateY(1px)` for all active button states.
    7.  Ensure `input-text:focus` shows a `2px` `focus-ring` (`#bbf746`) outline.
    8.  Navigation links (`nav-link`) should transition `color` and `border-color` in `0.3s` `ease-out` on hover.
    9.  `card-dark` elements must use the specified `elevation.card` shadow string.
    10. Ensure `text-secondary` (`#d4d4d4`) on `background-dark` (`#171717`) always passes AAA contrast.
    11. Implement responsive behavior, collapsing navigation to a hamburger menu at `600px` viewport width.
    12. Apply `border-spin` animation to `shiny-cta` elements over `2.5s`.
