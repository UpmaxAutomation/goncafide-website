import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Gonca Fide'),
    coverImage: z.object({ src: z.string(), alt: z.string() }).optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const programlar = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/programlar' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    level: z.enum(['Başlangıç', 'Orta', 'Orta-İleri', 'İleri', 'Tüm Seviyeler']),
    format: z.enum(['Online Grup', 'Yüz Yüze', 'Hibrit', 'Bireysel (1:1)']),
    totalHours: z.number().optional(),
    sessionCount: z.number().optional(),
    sessionDuration: z.string().optional(),
    enrollmentOpen: z.boolean().default(true),
    price: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    coverImage: z.object({ src: z.string(), alt: z.string() }).optional(),
    youtubeId: z.string().optional(),
    youtubeStart: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

// Tematik Seminerler — Gonca's single-session thematic workshops
// (Kıyas, Şaka Gibi, Küsmek)
const seminerler = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/seminerler' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    level: z.enum(['Başlangıç', 'Orta', 'Orta-İleri', 'İleri', 'Tüm Seviyeler']).default('Tüm Seviyeler'),
    format: z.enum(['Online Grup', 'Yüz Yüze', 'Hibrit']).default('Online Grup'),
    duration: z.string().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

// Etkinlikler — upcoming workshop/seminar announcements.
// Starts EMPTY by design; Gonca adds a file per cohort. No fabricated dates.
//
// Two shapes are allowed:
//   1. A fixed cohort — set `startDate` (and optionally `endDate`). It drops off
//      the page automatically once the start date passes.
//   2. An open-enrollment season with no announced first meeting — leave
//      `startDate` off and set `dateLabel` (e.g. "2026–2027 Sezonu") instead.
//      These stay listed until removed by hand, since nothing can expire them.
const etkinlikler = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/etkinlikler' }),
  schema: z
    .object({
      title: z.string(),
      programSlug: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      dateLabel: z.string().optional(),
      format: z.enum(['Online Grup', 'Yüz Yüze', 'Hibrit']).default('Online Grup'),
      location: z.string().optional(),
      enrollmentUrl: z.string().optional(),
      enrollmentOpen: z.boolean().default(true),
      description: z.string().optional(),
      coverImage: z.object({ src: z.string(), alt: z.string() }).optional(),
      youtubeId: z.string().optional(),
      youtubeStart: z.number().optional(),
      draft: z.boolean().default(false),
    })
    .refine((d) => d.startDate || d.dateLabel, {
      message:
        'Etkinliğin ya `startDate` alanı ya da `dateLabel` alanı dolu olmalı, yoksa kartta tarih sütunu boş kalır.',
    }),
});

// Katılımcı görüşleri — REAL testimonials only.
// Starts EMPTY by design; section renders only when Gonca supplies consented quotes.
const gorusler = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/gorusler' }),
  schema: z.object({
    author: z.string(),
    role: z.string().optional(),
    program: z.string().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, programlar, seminerler, etkinlikler, gorusler };
