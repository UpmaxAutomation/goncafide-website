# Gonca Fide — Website Improvement Plan

> Source of truth for the next build cycle. Derived from Gonca's own notes
> (`GoncaFide_SiteHaritası.docx`, `Kim_SiteHaritası.docx`, 2026‑06‑21) cross‑checked
> against the live codebase. **Status: awaiting review — no code changed yet.**

---

## 0. Snapshot

- **Who:** Gonca Fide — CNVC‑certified Nonviolent Communication (Şiddetsiz İletişim / NVC)
  trainer, Ankara. ODTÜ Sociology; ex international‑development / nature‑conservation /
  energy social‑impact; BBOM Ankara co‑founder (General Coordinator + Board Chair);
  NVC Türkiye Derneği member since 2019; CNVC Certified Trainer since Aug 2022;
  1000+ hrs trained, 900+ hrs taught.
- **Slogan:** **"birbirine bağlar"** ("connects one another").
- **Stack:** Astro 6 (static) · Tailwind v4 (CSS‑first `@theme` in `src/styles/global.css`) ·
  content collections (`programlar/*.md`, `blog/*.md`) · sitemap + robots + llms.txt ·
  Cormorant Garamond + Plus Jakarta Sans (self‑hosted, Turkish latin‑ext fixed).
- **Repo:** github.com/UpmaxAutomation/goncafide-website · **Host:** Vercel (`goncafide`) ·
  **Domain:** www.goncafide.com.

### Decisions locked (2026‑06‑21)
- **Palette → green + orange on white** (honor Gonca's notes; reverses the earlier plum/burgundy change).
- **Process → this plan reviewed/approved before implementation.**

---

## 1. Inputs still needed from Gonca (blockers flagged ⛔)

| # | Item | Why | Blocks |
|---|------|-----|--------|
| 1 | **Real testimonials** (name + what they took + quote, with consent) | Current ones are invented — must remove/replace | ⛔ Testimonials section |
| 2 | **Logo file** (SVG/PNG, transparent) | She has one made; site uses a plain wordmark now | Header/footer/OG |
| 3 | **Instagram + Facebook URLs** (confirm `@goncolog` is hers) | Verify + add FB | Footer/contact/schema |
| 4 | **WhatsApp OK?** for +90 533 716 79 40 | Highest‑converting TR channel | Contact CTAs |
| 5 | **A landscape photo** for the social‑share (OG) card | `/og-default.jpg` is missing → broken previews | OG image |
| 6 | **Upcoming workshop dates + enrollment links** | Workshop business needs "next cohort" | Events section |
| 7 | **Podcast / YouTube channel URLs** | She lists both | Media hub |
| 8 | **Corporate‑training** one‑pager (what/format/who) | Highest‑ticket line, no page today | Corporate page |
| 9 | **Pricing approach** (show prices? "contact for"?) | Affects program/service pages | Programs/Services |
| 10 | **Form destination** — confirm leads should flow to **GHL** (their CRM) | Pick the pipeline | ⛔ Form fix |

> Work that doesn't depend on a blocker proceeds in parallel; blocked items ship as soon as the input lands.

---

## 2. Brand foundation (Phase 0)

### 2.1 Palette swap → green + orange on white
The existing tokens are *named* `--color-sage-*` (green) and `--color-terra-*` (terracotta/orange)
but currently hold **purple/burgundy** values. Swapping the values back to green/orange **restores the
original semantic names** — minimal churn, every existing `var(--color-sage-…)` / `var(--color-terra-…)`
usage keeps working.

**Proposed scale (to be AA‑contrast‑verified at build — ≥4.5:1 for button text):**

```
/* Canvas stays near‑white (already correct) */
--color-canvas:  #FAFAF7;   --color-surface: #F2F6F0;   --color-cream: #EFF4ED;

/* Green — primary brand (calm, "giraffe"‑friendly, not neon) */
--color-sage-50:  #F3F7F2;  --color-sage-100: #E1ECDE;  --color-sage-200: #C2D8BC;
--color-sage-300: #9BBF92;  --color-sage-400: #6FA063;  --color-sage-500: #4E8244;
--color-sage-600: #3C6735;  --color-sage-700: #2C4C28;  --color-sage-800: #1E3320;  /* dark sections/footer */
--color-sage-900: #122017;

/* Orange — accent / CTA (warm, friendly) */
--color-terra-400: #E8924A;  /* icons, badges, decorative */
--color-terra-500: #D9772A;  /* accent */
--color-terra-600: #BD5F18;  /* CTA button base — white text AA */
--color-terra-700: #9A4A12;  /* CTA hover */
--color-border-focus: rgba(78,130,68,0.6);  /* green focus ring */
```
- CTA buttons: base `terra-600`, hover `terra-700` (verify white‑text ≥4.5:1; darken if needed).
- Focus rings, links, eyebrows, timeline, prose accents → green family.
- Decorative gradients (hero/about portrait halo) → `sage-50/100`.
- Audit every literal Tailwind color (e.g. `bg-orange-50`, `text-...`) in `hizmetler.astro` etc. and route through tokens.

### 2.2 Logo + slogan
- Replace wordmark in `Navbar.astro` + `Footer.astro` with her **logo**, with **"birbirine bağlar"** as the tagline beneath it (and once in the hero eyebrow/sub‑headline and footer brand block).
- Add slogan to `Person`/`WebSite` JSON‑LD `slogan`/`description`.

**Acceptance:** no purple/burgundy left anywhere; green+orange render on white; slogan visible in header area, hero, footer; contrast AA verified; build green.

---

## 3. Phase 1 — Critical fixes (money‑losing bugs)

### 3.1 Make the contact + newsletter forms actually work ⛔(input #10)
- **Problem:** `ContactForm.astro` and the `Footer.astro` newsletter use `data-netlify="true"`, but the
  host is **Vercel** — Netlify Forms never run, so **every submission is lost**.
- **Fix (recommended):** add a Vercel serverless function `api/contact.js` (same proven pattern used on
  Pannello) that validates + forwards the lead to **GHL** (their CRM) and optionally emails
  `info@goncafide.com`; on success redirect to `/tesekkurler`. Honeypot + basic rate‑limit retained.
  Newsletter → same handler (tag "newsletter") or GHL list.
- **Alternative if GHL not wanted:** Formspree/Web3Forms endpoint (no backend).
- Remove all `data-netlify`/`netlify-honeypot`/`form-name` artifacts.

**Acceptance:** real submission lands in GHL (or chosen sink) + redirect works; tested live on the deploy, not just locally.

### 3.2 Remove fabricated testimonials (input #1)
- `TestimonialsSection.astro` invents "Zeynep K. / Mert D. / Ayşe T." → **delete or replace with real, consented quotes.**
- Until real ones exist: replace the section with a non‑fabricated trust block (credentials, CNVC badge, "1000+/900+ hrs", Derneği membership) so the homepage doesn't look empty.

### 3.3 Fix the broken social‑share image (input #5)
- `seoDefaults.ts` → `/og-default.jpg` which **doesn't exist** in `public/`. Add a real 1200×630 OG image
  (her photo + name + slogan + green/orange brand). Verify Twitter/WhatsApp/LinkedIn preview renders.

### 3.4 Add the missing contact channels (inputs #3, #4)
- Add **phone + click‑to‑call + WhatsApp** (`https://wa.me/905337167940`) to `iletisim.astro`, footer, and a sticky mobile CTA.
- Add **Facebook** link; confirm/repair Instagram handle. Update `sameAs` in JSON‑LD.
- Contact sidebar "Konum: Türkiye (Online)" → keep online‑first; add "Ankara" (address optional per her note).

### 3.5 Enrich the About page (`hakkimda.astro`)
- Weave in her real narrative: the **Anatolian‑villages origin story**, **BBOM leadership**, **NVC Türkiye Derneği (2019)**, the **gender/age/religion/race/nationality** mission line, and the **slogan**.
- Keep the credentials timeline; correct "NVC topluluğunun içindeyim" → explicit Derneği membership.

**Phase 1 acceptance:** forms capture leads (verified live) · zero fabricated content · OG preview works · phone/WhatsApp/FB present · About reflects her real bio · dual‑review + build green.

---

## 4. Phase 2 — Structure & UX (match her sitemap)

### 4.1 Unify offerings under "Sunduklarım"
- `Hizmetler` and `Programlar` are **redundant** (same offerings, different slugs; service cards link nowhere).
  Consolidate into one **"Sunduklarım"** information architecture; make every card actionable
  (→ program detail, or → `/iletisim?program=…` pre‑filled). Update nav + footer + internal links + redirects for any removed URL.

### 4.2 Group programs by level
- `programlar/index.astro` → group **Başlangıç / Orta / İleri** (the `level` field already exists). Add a one‑line "where do I start?" guide.

### 4.3 Add the offerings she's missing
- **Tematik Seminerler** (single‑session): Kıyas (Haset/Kıskançlık), Şaka Gibi, Nazar Etme, Küsmek, Duy Beni — as content‑collection entries (new `tip: seminar` or a `seminerler` collection).
- **Anda Kal Canda Kal** sub‑structure: Giriş (12h) · Beceriler (36h) · **Alıştırma Akşamları** (practice evenings — currently absent).
- **Empatik Koçluk / Mentörlük** retained (already present).

### 4.4 FAQ (SSS) page (input #9 helps)
- New `sss.astro` answering real questions (what is NVC, who is it for, online vs in‑person, levels, pricing, how to enroll) with **`FAQPage` JSON‑LD** (AEO win). Link from nav + relevant pages.

### 4.5 Events / announcements ("Atölye ve Seminer duyuruları") (input #6)
- A "Yaklaşan Atölyeler" area (homepage strip + dedicated page) listing next cohorts with dates + enrollment CTA. Content‑collection driven so Gonca can update easily. Add `Event` JSON‑LD.

### 4.6 Corporate / organizational trainings (input #8)
- New page for **"Kurumlara Özel Eğitimler"** (her highest‑ticket line) — outcomes, formats, sample agenda, inquiry CTA.

**Phase 2 acceptance:** one coherent offerings IA · level grouping · FAQ + events + corporate pages live · all internal links/redirects clean · schema valid · build green.

---

## 5. Phase 3 — Content & growth (as she scales)

- **Podcast hub** ("Gonca Fide'yle Şiddetsiz İletişim") + **YouTube** embed/section (input #7); `PodcastSeries`/`VideoObject` schema.
- **Community / Forum** ("Acemi Zürafa Topluluğu", "Anlaşmazlık Dönüştürme Topluluğu") — link out or embed depending on platform.
- **Abonelik (membership)** — landing + signup once the offer exists.
- **Blog** — keep building; ensure `Article` schema + reading time (already wired); internal‑link to programs.

---

## 6. SEO / AEO polish (cross‑cutting)
- Real OG image (Phase 1) · `FAQPage` + `Event` schema (Phase 2) · keep the strong `@graph` Person/WebSite/Service.
- Add `WhatsApp`/`telephone` to `Person`/`ContactPoint`.
- Single‑language site → `inLanguage: tr` is correct; no hreflang needed.
- Verify sitemap priorities still match the new IA after the Hizmetler/Programlar merge.

---

## 7. Guardrails (per operator rules)
- **Turkish only** — the entire site stays in Turkish (`inLanguage: tr`). No language switcher, no English UI/content. All new pages (FAQ, events, corporate, seminars) are authored in Turkish. (English in this plan is for the operator's reference only.)
- **No fabrication** — every testimonial/stat/badge must come from Gonca or the live site. No invented numbers, logos, or "as seen in".
- **No cheap CRO** — no exit‑popups, fake countdowns, or fake social‑proof toasts. Premium, calm, trust‑led (fits NVC).
- **Verify before "done"** — build green + live form test + dual review (Kimi/Codex) on multi‑file changes + visual smoke.
- **Faithful to her aesthetic** — white, simple, green+orange, in the spirit of connecting2life.net / denizspatar.com.

---

## 8. Sequencing summary
1. **Phase 0** brand foundation (palette + logo + slogan) — *can start immediately, no blockers.*
2. **Phase 1** critical fixes — form (⛔#10), testimonials (⛔#1), OG (#5), contact (#3/#4), About.
3. **Phase 2** structure — unify offerings, level grouping, FAQ, events, corporate.
4. **Phase 3** growth — podcast/YouTube/community/membership.

> Open the gate: confirm form destination (GHL?) and hand over the input‑checklist items in §1,
> and Phase 0 + the unblocked parts of Phase 1 can ship in the first pass.
