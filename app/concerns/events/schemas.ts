import z from 'zod';

export const submissionSchema = z.object({
  name: z.string(),
  twitch: z.string().min(3),
  order: z.number().int().min(1),
});

export const slugSchema = z.string()
  .min(3)
  .regex(/^[a-zA-Z0-9-]+$/, 'slug must contain only alphanumeric characters and hyphens');

export const eventSchema = z.object({
  name: z.string().min(3),
  slug: slugSchema,
  submissions: z.array(submissionSchema).min(1),
});
