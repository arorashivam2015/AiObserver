# AIObserver — Project Specs

## What the app does
AIObserver is a personal blog and portfolio website for Shivam Arora — a field notebook on AI, data science, and observations from production. Not commercial. Personal knowledge sharing.

## Who uses it
Public readers interested in AI/data science, plus potential workshop attendees.

## Tech stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS custom properties (AIObserver design system)
- **Animations:** GSAP 3 + ScrollTrigger
- **Fonts:** Geist Sans + Geist Mono (via `geist` npm package)
- **Deployment:** Vercel
- **Database/Auth:** None (static site — no backend needed)

## Pages
1. **/** (Home) — Full-viewport, no-scroll. Token rain canvas animation. "Watching machines think out loud." headline with GSAP line-reveal. CTAs to Blog + About.
2. **/about** — Career arc with three tabs (Experience / Patents / Competitions). Timeline with hover-to-expand cards. GSAP stagger entrance on tab switch.
3. **/blog** — Filter chips (Topic / Sort) + post list. GSAP stagger on post rows.
4. **/workshop** — Upcoming cohorts (3 cards) + Instructors (Shivam Arora, Kapil Tripathi, Shrey Manish). GSAP entrance on scroll.
5. **/contact** — Minimal form: Name, Email, Message, Send.

## Design system
- Dark default (`#1f2228`), light mode (`#f6f4ef` warm cream)
- Geist Mono for display/headings, Geist for body
- Sharp 0px border-radius (brutalist)
- No emoji icons, no generic gradients
- Light/dark toggle persisted via localStorage

## Data
All content is static (hardcoded). No database.

## What "done" looks like
- All 5 pages render correctly
- Token rain animation works on home
- Light/dark toggle works across all pages
- GSAP animations fire on page load and scroll
- `npm run build` succeeds with no TypeScript errors
- `npm run dev` runs without console errors
