# Etkinlikler (Upcoming Workshops / Announcements)

This folder holds **upcoming workshop & seminar announcements**. It is intentionally
empty — the /etkinlikler page and homepage strip show an honest "no scheduled dates yet"
state until real cohorts are added. **Do NOT invent dates.**

Add one file per cohort, e.g. `2026-anda-kal-eylul.md`:

```md
---
title: "Anda Kal Canda Kal — Giriş (Eylül Dönemi)"
programSlug: "anda-kal-canda-kal"
startDate: 2026-09-15
endDate: 2026-10-20
format: "Online Grup"
enrollmentUrl: "https://..."   # optional; omit to route people to /iletisim
enrollmentOpen: true
description: "12 saatlik giriş programının yeni dönemi."
---
```

The `_README.md` filename starts with `_`, so Astro ignores it (glob pattern `[^_]*`).
Past events (startDate in the past) are filtered out automatically.
