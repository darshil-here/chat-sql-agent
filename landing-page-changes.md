# Landing Page — Change Instructions

> **Context for the LLM:** This is a prompt that describes how to build a landing page. Your job is to apply every change listed below to that file. Work through each task one by one. Do not change anything that is not mentioned here — especially the Design System section, Typography, Colors, Spacing, Shadows, Motion, and Technical Implementation Notes. Those stay exactly as they are.

---

## Task 1 — Rewrite the Project Context block

**Current text to replace:**
```
QueryMind is an AI-powered chat interface that lets non-technical people at a company query their own database using plain English. You type a question like "How many orders did we get last week?" — the AI understands it, queries the company's backend, and returns both the raw query result and a human-readable answer. No SQL. No dashboards. Just ask.
```

**Replace with:**
```
AskDB is a personal project demonstrating AI-powered chat interface that lets non-technical people at a company query their own database using plain English. The AI model has been fine-tuned to understand natural language questions about a specific dataset and return accurate, human-readable answers alongside the raw database query it ran.
```

Also update the tagline line:
- **Current:** `*Ask anything. Get real answers from your data.*`
- **Replace with:** `*Ask anything. Get real answers from your database.*`

---

## Task 2 — Update the Navbar (Section 1)

**Location:** `### 1. Navigation Bar`

**Change 1 — Remove these two items from the right side of the navbar:**
- "Log In" ghost text link
- "Get Started →" button

**Replace both with a single button:**
```
"View on GitHub →" button — background #bbf746, text #171717, radius 12px, padding 14px 24px
```

**Change 2 — Replace the center nav links:**
- **Current links:** Product · How It Works · Use Cases · Docs
- **Replace with:** Overview · How It Works · Tech Stack · GitHub

---

## Task 3 — Remove the Hero Badge (Section 2)

**Location:** `### 2. Hero Section` → `**Badge (top center):**`

- **Current badge text:** `✦ Now with live query streaming`

**Delete this entire block** (the label and everything under it):

---

## Task 4 — Rewrite the Hero Sub-headline (Section 2)

**Location:** `### 2. Hero Section` → `**Sub-headline (centered, below headline):**`

**Current text:**
```
QueryMind connects to your company's backend and lets anyone on your team
ask data questions in plain English — no SQL, no dashboards, no waiting on devs.
```

**Replace with:**
```
AskDB connects to backend and lets anyone ask data related questions in plain English — no SQL needed.
```

---

## Task 5 — Replace the Hero CTA Buttons (Section 2)

**Location:** `### 2. Hero Section` → `**CTA Buttons (centered row):**`

**Current buttons:**
- Primary: "Start Querying →"
- Secondary: "See a Demo"

**Replace with:**
- Primary: "Try the Live Demo →" — bg `#bbf746`, text `#171717`, radius `12px`
- Secondary: "View on GitHub" — bg transparent, border `1px solid #333333`, text white, radius `12px`

---

## Task 6 — Remove the Trust Line (Section 2)

**Location:** `### 2. Hero Section` → `**Trust line (below buttons, small):**`

**Delete this entire block** (the label and everything under it):
```
**Trust line (below buttons, small):**
⊙ No SQL required   ⊙ Connects in minutes   ⊙ Your data stays private
- Font size `13px`, color `#737373`, centered
```

---

## Task 7 — Rewrite the Feature Cards Section heading and cards (Section 3)

**Location:** `### 3. Feature Cards Section`

**Change 1 — Section heading:**
- **Current:** `Everything your team needs to work with data`
- **Replace with:** `What this project demonstrates`

**Change 2 — Sub-heading:**
- **Current:** `No technical background required. Just ask, and QueryMind handles the rest.`
- **Replace with:** `A look at the core technical skills behind this build.`

**Change 3 — Rewrite Card 1:**
- Title stays: "Ask in plain English"
- **Replace description with:** "The model is fine-tuned to understand natural language inputs and map them to the correct database query, handling ambiguous phrasing, varied sentence structures, and context."

**Change 4 — Rewrite Card 2:**
- Title: change from "Queries your real data" → **"Live backend integration"**
- **Replace description with:** "The app connects to a real database backend and fetches live data on every query. No hardcoded responses, no mock data, every answer reflects the actual state of the database."

**Change 5 — Rewrite Card 3:**
- Title stays: "See the query, trust the answer"
- **Replace description with:** "Every AI response surfaces the exact query it ran underneath. This was a deliberate design choice to make the model's reasoning transparent and verifiable."

---

## Task 8 — Rewrite the How It Works Section (Section 4)

**Location:** `### 4. How It Works Section`

**Change 1 — Section heading:**
- **Current:** `Simple by design`
- **Replace with:** `How it works under the hood`

**Change 2 — Sub-heading:**
- **Current:** `Up and running in minutes. No engineering effort required.`
- **Replace with:** `The technical flow from question to answer.`

**Change 3 — Rewrite Step 1:**
- Label: change "1. Connect" → **"1. User Asks"**
- **Replace description with:** "The user types a question in plain English into the chat interface, for example, 'How many orders came in last week?'"

**Change 4 — Rewrite Step 2:**
- Label: change "2. Ask" → **"2. AI Interprets"**
- **Replace description with:** "The fine-tuned model parses the question, determines intent, and constructs the appropriate database query to fetch the right data."

**Change 5 — Rewrite Step 3:**
- Label: change "3. Get Answers" → **"3. Answer Returned"**
- **Replace description with:** "The backend runs the query against the live database and the AI returns both a human-readable answer and the raw query for full transparency."

---

## Task 9 — Delete the Testimonials Section entirely (Section 5)

**Location:** `### 5. Testimonials / Social Proof Section`

**Delete this entire section** from the `### 5.` heading all the way down to (and including) the last line of Card 2 (`- Role: Product Manager, Stackflow`), and the `---` divider after it.

After deletion, renumber the remaining sections:
- Old Section 6 (CTA Banner) → becomes **Section 5**
- Old Section 7 (Footer) → becomes **Section 6**

---

## Task 10 — Rewrite the CTA Banner Section (now Section 5)

**Location:** `### 6. CTA / Footer Banner Section` (will be renumbered to `### 5.`)

**Change 1 — Heading:**
- **Current:** `Ready to stop waiting on reports?`
- **Replace with:** `Try it out yourself`
- The word **"yourself"** should be italicized and in `#bbf746` (same treatment as "waiting" was)

**Change 2 — Sub-text:** — Delete the Sub-text Section entirely
- **Current:** `Give your whole team the power to query your data — instantly, safely, and without writing a single line of SQL.`

**Change 3 — Replace both buttons:**
- Primary: "Try the Live Demo →" — bg `#bbf746`, text `#171717`, radius `12px`
- Secondary: "View Source on GitHub" — bg transparent, border `1px solid #333333`, text white, radius `12px`

---

## Task 11 — Rewrite the Footer (now Section 6)

**Location:** `### 7. Footer` (will be renumbered to `### 6.`)

**Change 1 — Delete the "Trusted by" block entirely:**

Remove these lines:
```
**Trusted by line (centered, small caps):**
USED BY TEAMS AT
Color `#737373`, `11px`, letter-spacing `0.1em`

**Below it, 5 fake company name logos** in plain text styled like brand wordmarks, muted white (`#d4d4d4`), spaced evenly:
△ Nexara    ✦ Stackflow    ⌁ Orion    ⊕ PulseOps    ↗ Atelier
```

**Change 2 — Rewrite the bottom footer line:**
- **Current:** Left: `© 2025 QueryMind` · Right: `Privacy · Terms · GitHub`
- **Replace with:** Left: `Built by [Your Name] · 2025` · Right: `GitHub · Live Demo`
- All text `#737373`, `13px` (unchanged)

---

## Task 12 — Scan and fix leftover product/SaaS language throughout the file

After completing all tasks above, do a final pass through the entire file and replace any remaining instances of the following phrases. These are product-marketing phrases that don't belong in a portfolio project description:

| Find | Replace with |
|------|-------------|
| "your team" | "you" or remove entirely |
| "your company's backend" | "the backend" or "the connected database" |
| "your company" | remove or replace with "the project" |
| "your data" | "the data" |
| "no waiting on devs" | remove |
| "anyone on your team" | remove or replace with context-appropriate phrasing |
| "Start for Free" | "Try the Live Demo" |
| "Book a Demo" | "View Source on GitHub" |
| "Get Started" | "View on GitHub" |

---

## Summary of Sections After All Changes

Once all tasks are complete, the file should describe a landing page with exactly these sections in this order:

1. Navigation Bar
2. Hero Section
3. Feature Cards Section ("What this project demonstrates")
4. How It Works Section ("How it works under the hood")
5. CTA Banner ("Try it out yourself")
6. Footer (name + GitHub + Live Demo only)
