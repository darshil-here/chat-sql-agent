# Landing Page Prompt — QueryMind (AI Database Chat App)

## Project Context

**Product Name:** QueryMind *(feel free to swap with your actual name)*
**Tagline:** *Ask anything. Get real answers from your data.*
**What it does:** QueryMind is an AI-powered chat interface that lets non-technical people at a company query their own database using plain English. You type a question like "How many orders did we get last week?" — the AI understands it, queries the company's backend, and returns both the raw query result and a human-readable answer. No SQL. No dashboards. Just ask.

---

## Design System

Use this exact design token reference for all visual decisions.

### Colors
```
background:        #ffffff
background-dark:   #171717
text-primary:      #171717
text-secondary:    #d4d4d4
text-muted:        #737373
text-on-dark:      #ffffff
primary:           #bbf746   ← brand accent (lime green)
primary-hover:     #a3e635
primary-active:    #84cc16
primary-disabled:  #d9f99d
surface-light:     #f5f5f5
surface-dark:      #171717
border-light:      #e5e5e5
border-dark:       #333333
link:              #bbf746
focus-ring:        #bbf746
badge-new-bg:      #bbf746
badge-new-text:    #171717
```

### Typography
- Font family: `Inter` (import from Google Fonts)
- Display/H1: `Inter`, `48px`, weight `600`, line-height `1.1`
- Body: `Inter`, `16px`, weight `400`, line-height `1.5`
- Caption/small: `Inter`, `11px`, weight `400`
- Nav links: `Inter`, `16px`, weight `400`

### Spacing Scale (use only these values)
`4px, 8px, 16px, 24px, 32px, 48px, 64px`

### Border Radius
- `sm`: 4px (inputs)
- `md`: 12px (buttons, cards)
- `full`: 9999px (pill badges)

### Shadows
- Card: `rgba(0,0,0,0.05) 0px 1px 0px 0px, rgba(0,0,0,0.1) 0px 4px 4px 0px, rgba(0,0,0,0.15) 0px 10px 10px 0px, rgba(0,0,0,0.1) 0px -1px 0px 0px inset`

### Motion
- Base duration: `0.8s`
- Fast duration: `0.3s`
- Standard easing: `cubic-bezier(0.16, 1, 0.3, 1)`

### Overall Theme
- **Dark-first**: The page is predominantly dark (`#171717` background)
- High-contrast white text on dark backgrounds
- The lime green (`#bbf746`) is used ONLY for: CTAs, highlighted keywords in headings, badges, icons, and focus rings
- Rounded corners everywhere (12px on cards and buttons)
- Subtle layered shadows for card depth
- CSS keyframe animations for interactive/highlight elements

---

## Page Structure — Section by Section

Build this as a single-page HTML file with embedded CSS and vanilla JS (no frameworks needed).

---

### 1. Navigation Bar

**Layout:** Fixed top navbar, full width, dark background (`#171717`), slight border-bottom (`border-dark: #333333`)

**Left:** Logo — a small leaf/spark icon in `#bbf746` followed by the text **"QueryMind"** in white, `Inter 600`

**Center links (desktop only):**
- Product
- How It Works
- Use Cases
- Docs

**Right:**
- "Log In" ghost text link (white, no background)
- "Get Started →" button — background `#bbf746`, text `#171717`, radius `12px`, padding `14px 24px`

**Mobile:** Collapse center links into a hamburger menu at 600px

---

### 2. Hero Section

**Background:** Dark (`#171717`) with a very subtle dark abstract texture or radial gradient glow in the center (deep olive/forest green glow, barely visible — creates depth without distraction). Do NOT use a photograph.

**Badge (top center):**
A pill badge → background `#bbf746`, text `#171717`, text: `✦ Now with live query streaming`
Radius: `9999px`, padding `4px 10px`, font size `11px`

**Headline (centered):**
```
Talk to your data.
Get real answers, instantly.
```
- Font: `Inter 600`, `48px`, white
- The word **"real"** should be styled in `#bbf746` and italicized to make it pop
- Line height: `1.1`

**Sub-headline (centered, below headline):**
```
QueryMind connects to your company's backend and lets anyone on your team
ask data questions in plain English — no SQL, no dashboards, no waiting on devs.
```
- Font: `Inter 400`, `16px`, color `#d4d4d4`
- Max width: `520px`, centered

**CTA Buttons (centered row):**
- Primary: "Start Querying →" — bg `#bbf746`, text `#171717`, radius `12px`
- Secondary: "See a Demo" — bg transparent, border `1px solid #333333`, text white, radius `12px`
- Gap between buttons: `16px`

**Trust line (below buttons, small):**
```
⊙ No SQL required   ⊙ Connects in minutes   ⊙ Your data stays private
```
- Font size `13px`, color `#737373`, centered

**Hero Visual (below the text block):**
A mock chat UI card (dark card, `#1e1e1e` background, radius `12px`, card shadow).
Show a simulated conversation:
- User message: *"How many new users signed up this month?"*
- AI response: *"There were **1,284 new signups** in May 2025. That's up 18% from last month."*  
  Below that, a collapsible "Query used ▾" showing fake SQL: `SELECT COUNT(*) FROM users WHERE created_at >= '2025-05-01'`
- Style the AI response bubble differently from the user message
- Add a blinking cursor animation at the end of the AI message to suggest it's live

---

### 3. Feature Cards Section

**Section heading (centered):**
```
Everything your team needs to work with data
```
- `Inter 600`, `40px`, white

**Sub-heading:**
```
No technical background required. Just ask, and QueryMind handles the rest.
```
- `Inter 400`, `16px`, `#d4d4d4`

**3 cards in a row** (stack to single column on mobile), each card: bg `#1e1e1e`, radius `12px`, card shadow, padding `24px`

**Card 1 — Plain English Queries**
- Icon: a chat bubble with a spark, in `#bbf746`
- Title: "Ask in plain English"
- Description: "Type your question the way you'd ask a colleague. QueryMind understands context, handles ambiguity, and figures out exactly what data you need."

**Card 2 — Live Backend Queries**
- Icon: a database with arrows, in `#bbf746`
- Title: "Queries your real data"
- Description: "No mock data. No exports. QueryMind connects directly to your company's backend and fetches live results every single time."

**Card 3 — Transparent Results**
- Icon: an eye/magnifying glass, in `#bbf746`
- Title: "See the query, trust the answer"
- Description: "Every response comes with the underlying query so your team can verify results. Full transparency, zero black boxes."

---

### 4. How It Works Section

**Background:** Slightly lighter dark, `#1a1a1a`

**Section heading (centered):**
```
Simple by design
```
- `Inter 600`, `40px`, white

**Sub-heading:**
```
Up and running in minutes. No engineering effort required.
```
- `#d4d4d4`, `16px`

**3 steps in a row** with connecting line between them (decorative horizontal line with dots):

**Step 1 — Connect**
- Icon: plug/link icon, `#bbf746`
- Label: "1. Connect"
- Description: "Point QueryMind to your backend API or database endpoint. Setup takes under 5 minutes."

**Step 2 — Ask**
- Icon: chat bubble icon, `#bbf746`, slightly larger with a glowing ring effect around it (CSS box-shadow glow in `rgba(187,247,70,0.2)`)
- Label: "2. Ask"
- Description: "Your team types questions in plain English. No training needed — it works like any chat app."

**Step 3 — Get Answers**
- Icon: checkmark/chart icon, `#bbf746`
- Label: "3. Get Answers"
- Description: "QueryMind returns a human-readable answer alongside the raw data and the query it ran."

---

### 5. Testimonials / Social Proof Section

**Section heading (centered):**
```
Built for real teams
```
- `Inter 600`, `40px`, white

**Sub-heading:**
```
Here's what happens when your whole team can finally talk to your data.
```

**2 testimonial cards side by side** (stack on mobile), card bg `#1e1e1e`, radius `12px`, card shadow, padding `24px`

**Card 1:**
- 5 stars (★★★★★) in `#bbf746`
- Quote: *"Before QueryMind, our ops team had to wait 2–3 days every time they needed a report. Now they just ask and get it in seconds."*
- Avatar: simple circular placeholder with initials "RK"
- Name: Ravi K.
- Role: Head of Operations, Nexara

**Card 2:**
- 5 stars in `#bbf746`
- Quote: *"I'm not technical at all, but I can now pull up exact sales figures, user counts, or retention rates without bugging any developer."*
- Avatar: initials "PM"
- Name: Priya M.
- Role: Product Manager, Stackflow

---

### 6. CTA / Footer Banner Section

**Background:** Dark card/panel, `#1a1a1a`, rounded corners `12px`, centered on page, max-width `700px`, padding `64px 48px`

**Small icon above heading:** leaf/spark icon in `#bbf746`, size `32px`

**Heading:**
```
Ready to stop waiting on reports?
```
- `Inter 600`, `40px`, white
- The word **"waiting"** italicized and in `#bbf746`

**Sub-text:**
```
Give your whole team the power to query your data — instantly, safely, and without writing a single line of SQL.
```
- `#d4d4d4`, `16px`, max-width `480px`, centered

**Two buttons:**
- Primary: "Start for Free →" — bg `#bbf746`, text `#171717`, radius `12px`
- Secondary: "Book a Demo" — bg transparent, border `1px solid #333333`, text white, radius `12px`

---

### 7. Footer

**Background:** `#171717`
**Top divider:** `1px solid #333333`

**Trusted by line (centered, small caps):**
```
USED BY TEAMS AT
```
Color `#737373`, `11px`, letter-spacing `0.1em`

**Below it, 5 fake company name logos** in plain text styled like brand wordmarks, muted white (`#d4d4d4`), spaced evenly:
```
△ Nexara    ✦ Stackflow    ⌁ Orion    ⊕ PulseOps    ↗ Atelier
```

**Bottom of footer:**
- Left: `© 2025 QueryMind`
- Right: `Privacy · Terms · GitHub`
- All text `#737373`, `13px`

---

## Technical Implementation Notes

- **Single HTML file** with `<style>` block and `<script>` block inline
- Import `Inter` from Google Fonts at the top
- Use **CSS custom properties** (variables) for all colors, radii, and spacing — defined in `:root`
- The **hero chat mock-up** should have a CSS `blink` keyframe animation on the cursor (`|`)
- The **"Get Started" / CTA buttons** should have a subtle `border-spin` CSS animation — a rotating conic gradient border, achieved with a pseudo-element `::before` rotating `360deg` over `2.5s` linear infinite. This creates a "shiny" animated border effect
- **Scroll reveal**: Use `IntersectionObserver` in JS to add a `.visible` class to sections as they enter the viewport, triggering a `opacity: 0 → 1` + `translateY(20px → 0)` CSS transition
- **Responsive**: At `600px` and below, collapse nav links, stack cards, reduce heading sizes to `32px`, and reduce horizontal padding to `24px`
- **Hover states**: Cards should lift slightly (`translateY(-4px)`) with a transition of `0.3s ease-out` on hover. Buttons should transition background color on hover using `0.3s ease-out`
- No external JS libraries. Pure HTML + CSS + vanilla JS only.

---

## What NOT to Do

- Do not use purple gradients, pastel backgrounds, or white hero sections
- Do not use any color outside the defined palette above
- Do not use `Arial`, `Roboto`, or `system-ui` — only `Inter`
- Do not use arbitrary spacing values — only the defined scale
- Do not put `text-decoration: underline` on nav links in their default state
- Do not use `#bbf746` for body text — only for accents, CTAs, and highlighted heading words
- Do not use placeholder lorem ipsum text — use the exact copy provided in each section above
