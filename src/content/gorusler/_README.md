# Katılımcı Görüşleri (Testimonials)

This folder holds **real, consented** participant testimonials. It is intentionally
empty — the homepage shows a factual trust block until real entries are added.

**Do NOT invent testimonials.** Add one file per real quote, e.g. `ayse-t.md`:

```md
---
author: "Ayşe T."
role: "Anda Kal Canda Kal mezunu"
order: 1
---

Buraya katılımcının gerçek, izinli yorumu gelir.
```

The `_README.md` filename starts with `_`, so Astro ignores it (glob pattern `[^_]*`).
As soon as one real `.md` file exists here, the homepage testimonials section switches
on automatically.
