import { defineCollection, z } from 'astro:content';

const constructionTraining = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      section: z.string(),
      order: z.number(),
    }),
});

const lawsOfDecorativePatterns = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      section: z.string(),
      order: z.number(),
    }),
});

const howToMakeRepeatPatterns = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      section: z.string(),
      order: z.number(),
    }),
});

export const collections = {
  constructionTraining,
  lawsOfDecorativePatterns,
  howToMakeRepeatPatterns,
};
