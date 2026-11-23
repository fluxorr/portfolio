Portfolio UI / UX Design Specification
Project: byflux.me — Full redesign
Version: 1.0 — 22 November 2026
Primary audience: founders, independent businesses, teams hiring a design-minded web developer
Secondary audience: product/design teams evaluating design-engineering ability
Goal: convert qualified visitors into website design and development inquiries, while demonstrating craft.
01. Creative direction
Concept: An independent digital studio in the form of one person.

The site must look as if a small, highly attentive design studio made it, but speak honestly in the first person. The first five seconds must answer: (1) what I do, (2) why my work looks different, (3) where to see it, and (4) how to hire me.
- Mobbin influence: editorial minimalism, confident typography, crisp rhythm, disciplined whitespace, restrained monochrome palette, high-quality interface imagery, quiet hierarchy.
- Cofounder influence: tactile elevated cards, soft dimensional shadows, inset highlights, layered UI compositions, small crafted decorative details, considered hover states.
- Do not copy: either site's brand, layout exactly, marketing text, artwork, icons, distinctive illustrations or trade dress. Do not import Cofounder's pixel-art landscape or Mobbin's screenshot-collage identity.
- Overall feel: premium / Swiss editorial / precise / human / subtly playful. It should not look like a developer terminal, generic SaaS landing template, agency buzzword site, Figma community template, or a colorful illustration gallery.
Visual formula: 70% editorial flatness + 20% tactile surfaces + 10% meaningful motion.
Design principles
1. Sell outcomes, then show skill. Visitors buy sites, not a long inventory of technologies.
2. Work dominates. Real screenshots and interactions are the strongest evidence. Illustration supports, never substitutes for proof.
3. Depth is selective. Elevate project frames and the hero illustration, not every text box.
4. Short, not sparse. Fewer sections with clearer messages. Keep useful proof visible.
5. Motion explains. Each animated object should demonstrate craft, transformation, or an actual product interaction.
6. No invented social proof. Do not fabricate testimonials, client names, revenue, results, case-study research, or screenshots.
02. Positioning and conversion
One-sentence positioning: An independent designer and developer who designs and builds thoughtful, performant websites for founders and growing teams.

Primary CTA: Start a project (opens an email with a helpful subject or a verified contact destination configured centrally).
Secondary CTA: Explore my work (scrolls to work).
Tertiary CTA: GitHub (external, visible only where relevant).

Above-the-fold non-negotiables: statement of service, short description, one strong CTA, a smaller work CTA, one recognizably custom visual, and an immediate hint of work below. Avoid vague “building the future” language.

Suggested final hero copy:
- Eyebrow: INDEPENDENT DESIGNER & DEVELOPER (no false availability claim).
- H1: I design websites people want to use. Then I build them.
- Support: From the first layout to the finished build, I help founders turn ideas into sharp, fast, genuinely useful websites.
- Buttons: [Start a project] / [Explore my work]
- Optional micro-line: Design · Development · Motion (only if genuinely offered).
Copy rule: A nontechnical buyer should understand all primary copy. Mention engineering depth in the capabilities section, not as a wall of React/Next.js logos in the hero.

CTA routing: Repeated at navbar, hero, immediately after work, and final contact strip. On mobile, make contact easy to find but avoid an intrusive persistent banner. Prefer a mailto link until a verified booking link or contact form is available. Provide a small optional prefilled inquiry template: project type, timeline, and existing website/reference. Never claim a response window or availability unless explicitly configured.

Analytics: Instrument cta_start_project, cta_work, project_open, contact_copy, and external_profile_click. Count qualified inquiries and actual projects, not just clicks. Measure improvement after launch rather than declaring it “high converting” without evidence.
03. Information architecture — one concise page
Order is intentional. Users decide if they want the service before deciding how technically impressive the developer is.
Order	Section	Primary question answered	Approx. desktop height
00	Navigation	Who is this? How do I contact them?	72–80px
01	Hero + animated figure	What do they build, and what is their taste?	590–720px
02	Selected work	Can they actually design/build well?	1,250–1,550px
03	Services / capabilities	Can they handle my kind of project?	390–520px
04	Experience + brief About	Are they credible, and what is it like working with them?	330–460px
05	Contact + footer	How do I start?	380–520px


Target the overall page to feel deliberately short and fast to scan (not a tall, repetitive agency site). Exact height responds to actual project imagery and mobile flow.
00 / Navigation
- Max-width centered shell, logo/wordmark byflux or selected personal wordmark at left, links Work, What I do, About, with black Start a project button at right.
- 64–72px content area on desktop. Fixed or sticky on scroll with opaque warm-neutral background, 1px bottom border and no blur-glass effect. Avoid a floating pill if it eats vertical space.
- Tiny custom icon optional, no novelty logo that hurts name recognition.
- Mobile: wordmark at left, visible Contact action, simple menu if required; do not hide the CTA behind a hamburger.
01 / Hero — editorial statement and one distinctive figure
Desktop composition: 12-column grid, left copy spans 7–8 columns and right illustration spans 4–5. Left side deliberately typeset. Figure occupies a raised neutral tray with a clean soft border and a very controlled shadow. The hero headline feels large, not oversized. Below CTA row add a small 1-line capabilities signal.

Suggested dimensions: section padding top 100–126px, bottom 116px; H1 max-width 760px, max 2–3 lines, desktop 64–76px with tracking around -0.055em; body 17–19px. Keep primary CTA visible at 1280×800 without scrolling when practical.

Hero Hairline concept: “From layout to launch.” One isometric line-drawn interface frame composed of a large page plane and a few meaningful component planes. As pointer moves across the figure, the layout's component layers align into a clean, assembled interface. An understated readout changes Layout → Interface → Ready (rendered outside the Hairline drawing, not as embedded letters). At rest, the figure must still read clearly as an interface being composed. It communicates the combination of design and implementation. Restrict the animation to one idea; no extra sparkles, fake code, gratuitous 3D spinning, random hardware, or rainbow fills.

The Hairline agent must follow its own hairline-create rules: one figure/one idea, a clear pointer gesture, a strong resting composition, meaning conveyed by geometry, and an inspected/validated result. The figure is for the website; export or integrate it as a component without shipping an entire separate demonstration page in the hero.

Motion sequence: eyebrow appears; headline reveals in two vertical masked line groups; supporting text follows; CTAs settle; the figure resolves last. Total initial entrance around 0.9–1.2 seconds, no “loading” curtain. The illustration may respond subtly to pointer movement, then return to rest. No endless restless loop on every item.

Mobile: headline first, buttons next, figure below; ensure the visual doesn't push all work impossibly far down. Single column with figure around 260–340px tall, cropped intentionally without overflow.
02 / Selected work — the most important section
Header Selected work plus a sentence: A few things I've designed, built, or brought to life. An optional small 2024—2026 label is allowed only if accurate. Avoid Case studies as a heading, because no full case studies exist.

Grid geometry:
- Featured row: one 12-column large visual card, ~470–570px on desktop. Wide screenshot showing the most visually persuasive, relevant website or web app. Left/bottom simple project metadata block; visual occupies ~72% of the area. A simulated browser chrome may be used only around genuine screenshots.
- Second row: two equally sized 6-column cards, 460–540px tall, each with large imagery. If four projects are genuinely worth showing, a fourth may be placed in a final compact row; never add filler just for grid symmetry.
- Keep spacing 22–26px. Cards are soft neutral framed stages, not bright color blocks. Real product screenshots can preserve their original color internally; the site's UI palette stays neutral.
- Each card must show: project name, one buyer-readable descriptor, what you actually did, and [View live] / [GitHub] links when verified. The project card itself can be a link if accessible and unambiguous.
Candidate projects: Slips, SpeakDown, Aegis, Closely. Their exact selection and ordering are provisional until the agent verifies live assets, accurate descriptions and the fit for website buyers. If a stronger customer-facing website is available, show that first. Do not invent Slips features or claim that any sample project was paid client work.

No fake case studies: Use project stories, not fabricated case-study pages. For each project use a compact truthful structure:

PROJECT NAME / What it is (one concrete line) / My role: Design · Frontend · Full-stack (only those actually true) / View project ↗

Optional tiny expandable “What I built” overlay can include 2–3 verified bullets, but no made-up “The challenge / 300% growth / The solution” narratives. Dedicated deep-dive pages can be added later without blocking launch.

Image art direction: capture real desktop screenshots at native resolution; choose a precise meaningful crop. Use realistic product UI, not AI hallucinated dashboards. Add a phone crop only for projects that actually have a responsive/mobile experience. Browser framing uses ~1px border, small rounded corners, soft grounded shadow. Ensure text in imagery remains legible at typical viewport widths.

Card interactions: hover lifts ~3px and slightly increases shadow; media scales at most 1.015; bottom action bar or project label reveals vertically by ~10–12px with opacity, 180–230ms. No dramatic 3D tilt. On press/tap scale 0.99 for 110ms, then navigate. On touch show all essential links without hover. Keyboard focus uses a visible ring. Avoid nested clickable areas with conflicting behavior.

StageShow assignment: Use StageShow for one selected project demo, NOT for every card and NOT as a generic page transition library. If the chosen product has verifiable interactive screens, choreograph one 6–10 second loop around a single true action (e.g. a user creates or edits an item, the actual UI responds, the state settles). Reuse real UI copy and appearance; stage and crop the demo like an editorial product illustration. No simulated features that don't exist. If verification/assets are missing, ship a strong static screenshot and return to the demo later. Desktop hover/play optional; avoid autoplay video on mobile with no controls.
03 / What I can help with — buyer-first capabilities
Heading: From first sketch to finished website.
Subheading: One person across design and development, without the handoff friction.

Three editorial columns/rows, each with a concise business-facing offer:
1. Website design — Clear structure, visual direction, responsive layouts, and interfaces that feel considered.
2. Development — Fast, responsive websites and web apps, built to be maintained and improved.
3. Interaction & polish — Purposeful motion, custom components, and the little details that make a site feel finished.
Keep each item as a simple bordered row or gently raised card with a numbered label 01 / 02 / 03, a one-line description, and perhaps one small diagram. Avoid an enormous skills tag cloud; show technical specifics as a short secondary strip: React · Next.js · TypeScript · Motion · APIs · Databases only if they truly reflect the work. Add Have something in mind? Start a project below.

A second optional Hairline figure here may show a responsive web frame reflowing from wide to narrow as pointer position changes. It must genuinely demonstrate responsive craft. If it dilutes the page or affects performance, skip it; one outstanding hero figure is better than two generic ones.
04 / Experience + About — compact credibility
Two-column desktop layout, stacked mobile.

Left: A little about me. One short honest paragraph. Suggested copy: I'm an independent designer and developer. I care about the structure behind a website as much as what you see on screen—from clear layouts and interactions to the systems that keep it running.

Right: Experience as a crisp two- or three-row editorial list, company or role, context, dates only when verified. An existing role such as Software Engineer (Digital Marketing) — Viral Ace Media may be used after validating the precise public description and dates. Do not invent additional employers or measurable outcomes. A small GitHub link follows as evidence of engineering depth.

Do not show age, academic year, an inflated title, invented client logos, social-proof metrics, or a tedious timeline. One or two genuinely relevant entries are enough.
05 / Final contact — short and direct
Use a softly raised contact stage on the same neutral background, one of the page's strongest uses of shadow. No big newsletter or long form.
- Eyebrow: HAVE A PROJECT IN MIND?
- Headline: Let's make something worth visiting.
- Body: Need a website designed, built, or improved? Tell me a little about it.
- Primary: Start a project
- Secondary: Email me (only show separately if it provides a distinct action such as copying the verified email address).
- Footer: wordmark, copyright dynamically generated, GitHub, X/LinkedIn only if verified, concise link to selected work.
Optional tiny availability text only if maintained manually. No faux live status indicator or fake scarcity.
04. Design tokens (source of truth)
Neutral palette
Token	Value	Usage
--canvas	#F7F7F5	Main page background; warm-neutral off-white, never pure white
--surface	#FBFBFA	Elevated cards and contact panel
--surface-muted	#F0F0EE	Image stage grounds, subtle chips
--text-strong	#111110	Headlines and high-priority text
--text-body	#41413F	Paragraphs
--text-muted	#72726F	Captions, metadata
--line	#E1E1DE	Main hairline borders
--line-strong	#CFCFCC	Dividers/focus-adjacent borders
--dark	#171716	Primary CTA button
--dark-hover	#2B2B29	Primary CTA hover


Very pale off-white is the base. Near-white is allowed inside cards, so that the cards stand out softly from the canvas. Keep neutral grays neutral; no uncontrolled blue tint or overdone cream/yellow. Colors inside actual project screenshots are allowed.
Typography
- Primary type: Geist Sans or Inter, whichever looks strongest once typeset; install via next/font, not an unlicensed commercial font.
- Accent/metadata: Geist Mono (selective use for eyebrow labels and numbers only). Avoid coding-terminal aesthetics.
- display: clamp(3rem, 5.7vw, 4.75rem), weight 580–650 if variable font, letter spacing -0.05em, line-height 1.04.
- h2: clamp(2.25rem, 4vw, 3.25rem), -0.04em, line-height 1.1.
- h3: 1.375–1.75rem, -0.025em.
- Body 16–18px, line-height 1.5–1.6, max 58–66 characters per line.
- Metadata 11–12px semibold with modest letter spacing, not all-caps everywhere.
- Buttons 14–15px medium.
Grid and spacing
- Content max-width: 1200px; overall shell max-width 1280px including horizontal gutters.
- Desktop side padding 48px (may be 32px on laptop); tablet 28px; mobile 18px or 20px.
- 12-column desktop; 6-column tablet; 1-column mobile.
- Section gaps: 112–136px desktop, 80–96px tablet, 64–80px mobile.
- Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Container radius: 16–20px for visual stages, 12–14px for small cards, 10px for controls. Avoid over-pill-shaped panels. Buttons may use 10–12px radius, not pills by default.
Borders and elevation (Cofounder-inspired, restrained)
:root {
  --shadow-card: 0 1px 1px rgb(17 17 16 / 0.025),
    0 5px 16px rgb(17 17 16 / 0.035),
    0 18px 42px rgb(17 17 16 / 0.025);
  --shadow-card-hover: 0 2px 3px rgb(17 17 16 / 0.035),
    0 12px 28px rgb(17 17 16 / 0.055),
    0 28px 52px rgb(17 17 16 / 0.035);
  --shadow-float: 0 8px 20px rgb(17 17 16 / 0.07),
    0 22px 60px rgb(17 17 16 / 0.055);
  --border-card: 1px solid rgb(17 17 16 / 0.075);
}
Use inner 1px top highlight on some raised panels, if genuinely visible at normal size: inset 0 1px 0 rgb(255 255 255 / 0.65). Dark CTA uses almost no ambient shadow. No glassmorphism, heavy strokes, full-page shadow grids, or 3D card tilt.
Surface treatment
- On the canvas, a barely perceptible neutral radial lightness variation may be used behind the hero illustration, but do not use rainbow gradients or a noisy, gritty texture.
- Project stages can use subtle lines/rules to make UI imagery look purposeful.
- The whitespace is an active part of the design: avoid filling gaps with floating icons and stars.
05. Motion and interaction specification (intensity 7/10)
Motion vocabulary: masked vertical reveals, short y-axis lifts, restrained scale, tiny parallax confined to illustration, tactility on press, choreographed single-purpose UI demos.
Interaction	Timing	Behavior
Hero text load	500–700ms per text group, stagger 65–100ms	Fade and translate Y 18–22px inside masked line wrapper
Hero figure entrance	650–900ms	Fade/scale 0.975→1 after hero copy begins
Section reveal	450–650ms	Y 14→0, opacity 0→1; trigger once, no dramatic scroll effects
Project hover	190–240ms	translateY(-3px), subtle shadow increase, media scale ≤1.015
Vertical action reveal	180–220ms	Content Y +12→0 and opacity 0→1
Button hover	160–190ms	Color shift, arrow slides ~3px; no magnetism
Tap/press	90–130ms	scale 0.99; spring back quickly
Hairline pointer	spring-based	Local, pointer-responsive geometry; quiet rest
StageShow featured demo	6–10s loop	One real flow, rests visibly before resetting


- Default cursor remains native. Optional very small custom cursor accent only inside the illustration viewport; never replace pointer globally, hijack text selection, or obscure a CTA. If there is no clear function, do not use it.
- No magnetic buttons, endless marquee, scroll-jacking, artificial loading screen, noisy particles, bouncing icons, giant spinning rings, or layout-moving hover effects.
- Respect prefers-reduced-motion: reduce: no automatic StageShow playback; show poster, eliminate entrance translations, disable hover parallax, preserve functional feedback.
- Support keyboard and touch; all hover-only information must be available by default on touch.
- Use CSS transitions for small interactions and Motion for orchestrated entrances only. Do not use animation libraries where native CSS is enough.
06. Responsive layouts
≥1280px: content max-width ~1200px, spacious hero 7/5 split, 1 large + 2 medium work stages.
1024–1279px: hero 6/6 or 7/5, slightly smaller headline, 32px margins.
768–1023px: hero copy then illustration or 7/5 split if safe, work stages may switch to one column if images suffer.
≤767px: single-column, 18–20px gutters, H1 42–52px, full-width or stacked CTAs where appropriate, visible contact navigation, project screenshots framed/cropped intelligently. No oversized empty whitespace, no image text below legibility, no horizontal scroll.

Support 320px, 375px, 390px, 768px, 1024px, 1440px and 1920px reviews. Test real touch behavior and focus order.
07. Content + asset requirements
Source of truth: one typed content file for project data, copy, work links, contact info, experience entries and social profiles. Do not hardcode placeholders into presentational components.

Required per work item:
type WorkItem = {
  id: string;
  name: string;
  oneLiner: string;
  contribution: string[];
  image: string;
  imageAlt: string;
  liveUrl?: string;
  repoUrl?: string;
  stageShow?: boolean;
  featured?: boolean;
};
- Obtain and inspect project screenshots from local assets or real running sites. Use those assets only where they truthfully represent the project.
- If the project assets cannot be verified, create a clearly labeled placeholder in the development build and do not publish it as a finished card.
- Do not use fake social proof, fictional customers or unsourced conversion increases.
- Keep meaningful alt text. Decorative Hairline figure gets a short purpose description or is hidden from accessibility tree if text already explains it.
- Use SVG for simple line work, Next Image for screenshots, system-friendly type loading, no webp rasterization of text where avoidable.
08. Technical implementation guidance
- Next.js App Router (current project-compatible version; Next.js 16 is preferred if starting fresh), React, TypeScript, Tailwind CSS v4. Vercel-deployable static or server-rendered pages. No required custom server.
- Use Motion where appropriate, not as a substitute for CSS layout. Keep shadcn or Radix components only if a genuine interaction benefits from them; the final visuals must remain bespoke.
- Use semantic HTML, real anchor navigation, accessible CTA focus states, working external links. Social icons should include labels.
- Avoid fetching GitHub stats on every page load. If a GitHub activity graphic is added, it must be modest and nonblocking; a clear GitHub link is sufficient.
- Centralize site metadata and OG title / description / social image. Use OpenGraph preview that mirrors actual site typography, not a generic logo on a gradient.
- Optimize screenshot sizes, defer below-the-fold media, define image dimensions, and code-split interactive animation components.
- Targets to validate in Lighthouse / web vitals rather than assert: LCP <2.5s on representative mobile test, CLS <0.1, INP <200ms, no significant unused JS. Verify motion frame rate on actual hardware.
- Track CTA and project clicks with privacy-respecting analytics if configured; nothing should depend on analytics to function.
- Use next/font for type. Avoid a heavy cursor library or large render loop.
09. Quality bar and acceptance tests
Design review
- Does it look like one coherent studio? Are all cards driven by the same border/shadow/radius system?
- Does it retain Mobbin-like restraint, even with selective Cofounder-style elevation?
- Is the hero recognizably about website design and development in 5 seconds?
- Are there at least 3 visually compelling, real work samples with verified copy and links?
- Are Hairline illustrations meaningful in their resting pose, not decorative filler?
- Is StageShow attached to one credible product action rather than a fake generic animation?
- Is each CTA obvious and clickable without navigating through multiple menus?
- Are the mobile layout and reduced-motion behavior deliberate?
Functional QA
- All primary and secondary CTAs work; contact destination is verified.
- All links go to intended live/repo pages (no # placeholders in final).
- All hover reveals have touch equivalents and keyboard focus states.
- Screenshot media is optimized and not visually cropped over critical UI.
- No horizontal overflow or layout shifts at target breakpoints.
- SEO metadata, favicon, OG image and social links are verified.
- Animations never delay first meaningful interaction.
- No invented testimonials, statistics, company names, project claims or “case studies.”
10. Execution sequence for Codex
1. Inspect the repository, installed skills, content and assets. Record reusable real evidence before deleting/rewriting anything. Build fresh UI; do not inherit the old layout.
2. Verify the live reference sites' present direction; collect only design principles, not code/assets. References: https://mobbin.com and https://cofounder.co.
3. Define tokens, typography, content config and component architecture. Create the static page with accurate copy and real screenshot placeholders (only in development).
4. Finish the complete responsive static layout. Validate spacing, text hierarchy, shadows, and screenshots before motion.
5. Use Hairline for one purposeful hero figure. Follow the installed skill's concept/build/check workflow; integrate its output into the page as a responsive component.
6. Use StageShow for one justified, accurate project demo only if real product assets/behaviors can be verified. Follow the skill's closest example + film/inspect process.
7. Add low-level hover/tap/reveal motion, responsive behavior, accessibility and reduced motion.
8. Verify CTAs/links, run lint/typecheck/build and visual QA at required viewports. Report unverified project descriptions, missing assets, unknown email/contact destinations instead of inventing them.
9. Ship an optimized Vercel-compatible result; list exactly which values I must configure and what you tested.
11. Explicit non-goals
No fake case studies. No fake conversion claims. No testimonial carousel. No pricing table until actual services and packages are defined. No giant interactive terminal. No endless GitHub graph scroll. No decorative abstract AI blobs. No glassmorphism. No generic purple SaaS gradients. No magnetic buttons. No globally custom cursor. No more than one auto-playing StageShow demo. No multiple independent page animations competing for attention.
12. References and skills
- Visual: https://mobbin.com — editorial structure, content hierarchy, interface imagery.
- Visual: https://cofounder.co — considered surface layering, tactile card presence, restrained UI details (not the site's art direction or identity).
- StageShow: https://github.com/benjitaylor/skills/tree/main/stageshow — choreographed interface demos. Install: npx skills add benjitaylor/skills --skill stageshow.
- Hairline: https://github.com/lucasmarkes/hairline — pointer-responsive, isometric line illustration. Install: npx skills add lucasmarkes/hairline --skill hairline-create.
Unresolved but nonblocking values: verified contact email/booking link, chosen strongest featured project, genuine screenshots, exact contribution lines, final logo/wordmark, and confirmed experience entries. The implementation must surface these in a config file, not silently guess them.
