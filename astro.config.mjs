import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://www.goncafide.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/tesekkurler'),
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
