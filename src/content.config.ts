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
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, programlar };
