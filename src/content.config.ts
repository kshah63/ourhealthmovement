import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Ancient-wisdom traditions (Ayurveda, TCM, Yoga, ...).
 * Add a new tradition by dropping a markdown file into src/content/wisdom/.
 */
const wisdom = defineCollection({
  loader: glob({ base: './src/content/wisdom', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    tradition: z.string(),
    origin: z.string(),
    era: z.string(),
    summary: z.string(),
    principles: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
    accent: z.enum(['terracotta', 'sage', 'ochre', 'clay']).default('terracotta'),
    order: z.number().default(0),
  }),
});

/**
 * Practical guides: spices, fruit & veg, and low-tox swaps.
 * `category` decides which index the guide is filed under.
 */
const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['spice', 'produce', 'low-tox']),
    summary: z.string(),
    season: z.array(z.enum(['spring', 'summer', 'autumn', 'winter', 'all'])).default(['all']),
    energetics: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(0),
    updated: z.coerce.date().optional(),
  }),
});

/**
 * Podcast episodes. Replace the sample episodes with your real recordings,
 * point `audioUrl` at your host (Transistor, Buzzsprout, Spotify for Podcasters, ...).
 */
const podcast = defineCollection({
  loader: glob({ base: './src/content/podcast', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    episode: z.number(),
    guest: z.string(),
    guestTitle: z.string(),
    topic: z.enum(['Yoga', 'Ayurveda', 'TCM', 'Fascia', 'Nutrition', 'Movement', 'Breath']),
    summary: z.string(),
    duration: z.string(),
    date: z.coerce.date(),
    audioUrl: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { wisdom, guides, podcast };
