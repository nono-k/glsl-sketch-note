import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const constructionTraining = defineCollection({
  loader: glob({ pattern: 'src/content/constructionTraining/*.mdx' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    section: z.string(),
    order: z.number(),
  }),
});

const lawsOfDecorativePatterns = defineCollection({
  loader: glob({ pattern: 'src/content/lawsOfDecorativePatterns/*.mdx' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    section: z.string(),
    order: z.number(),
  }),
});

const howToMakeRepeatPatterns = defineCollection({
  loader: glob({ pattern: 'src/content/howToMakeRepeatPatterns/*.mdx' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    section: z.string(),
    order: z.number(),
  }),
});

const others = defineCollection({
  loader: glob({ pattern: 'src/content/others/*.mdx' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    section: z.string(),
    order: z.number(),
  }),
});

export const collections = {
  constructionTraining,
  lawsOfDecorativePatterns,
  howToMakeRepeatPatterns,
  others,
};
