import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const notes = defineCollection({
 loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
 schema: z.object({ title: z.string(), description: z.string(), category: z.enum(['Essay','Sample']), topic: z.string(), minutes: z.number().positive(), order: z.number(), featured: z.boolean().default(false), draft: z.boolean().default(false) })
});
export const collections = { notes };
