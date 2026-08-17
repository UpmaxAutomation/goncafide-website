# Etkinlikler (Upcoming Workshops / Announcements)

This folder holds **upcoming workshop & seminar announcements**. Add one file per
cohort. **Do NOT invent dates** — if the first meeting has not been announced,
use the season form below instead of guessing.

The `_README.md` filename starts with `_`, so Astro ignores it (glob pattern `[^_]*`).

## Form 1 — a cohort with announced dates

Past events drop off the page automatically once `startDate` passes.

```md
---
title: "Anda Kal Canda Kal — Giriş (Eylül Dönemi)"
programSlug: "anda-kal-canda-kal"
startDate: 2026-09-15
endDate: 2026-10-20        # optional
format: "Online Grup"
enrollmentUrl: "https://..."   # optional; omit to route people to /iletisim
enrollmentOpen: true
description: "12 saatlik giriş programının yeni dönemi."
coverImage:                # optional poster
  src: "/images/etkinlikler/dosya-adi.jpg"
  alt: "Afişteki bilgiyi özetleyen açıklama"
---
```

## Form 2 — open enrollment, no announced start date

Leave `startDate` off and set `dateLabel`. These entries have no date to expire
on, so they stay listed until you delete the file. They are also left out of the
page's structured data, because schema.org/Event requires a real start date.

```md
---
title: "Anahtar Ayrımlar — ... (8. Yıl)"
dateLabel: "2026–2027 Sezonu"
format: "Online Grup"
enrollmentUrl: "https://..."
description: "Grup gün ve saatlerini buraya yaz."
---
```

Every entry needs **either** `startDate` **or** `dateLabel` — the build fails with
an explanatory message if both are missing.

## Notes

- Dated entries are listed first (soonest first), then the undated season entries.
- Dates are date-only values read in UTC, so they render identically no matter
  what timezone the build machine is in. Don't add times to `startDate`.
- Posters: save to `public/images/etkinlikler/`, around 700px wide, JPEG.
  The card shows a small thumbnail that opens the full image in a new tab.
- The markdown body is **not rendered** on the page right now; only the
  frontmatter fields show. Keep the essentials in `description`.
