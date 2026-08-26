import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://www.goncafide.com',
  output: 'static',
  // Turkish is the default and keeps the bare URLs ("/hakkimda"); English is
  // served under "/en/". See src/i18n/ui.ts for the page-to-page mapping.
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: { tr: 'tr-TR', en: 'en-US' },
      },
      filter: (page) => !page.includes('/tesekkurler') && !page.includes('/en/thank-you'),
      serialize(item) {
        if (item.url === 'https://www.goncafide.com/') return { ...item, priority: 1.0 };
        if (item.url.includes('/programlar')) return { ...item, priority: 0.9 };
        if (item.url.includes('/nvc-nedir')) return { ...item, priority: 0.9 };
        if (item.url.includes('/blog')) return { ...item, priority: 0.7 };
        return { ...item, priority: 0.6 };
      },
    }),
    robotsTxt({
      policy: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: '/tesekkurler' },
      ],
      sitemap: 'https://www.goncafide.com/sitemap-index.xml',
    }),
  ],
});
