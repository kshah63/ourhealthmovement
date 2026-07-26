// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Update `site` to your live domain once DNS is pointed at Vercel.
// This is used for canonical URLs, the sitemap, and social share tags.
export default defineConfig({
  site: 'https://ourhealthmovement.co.uk',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
