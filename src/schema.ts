import { z } from 'zod'

export const projectSchema = z.object({
	name: z.string(),
	shootType: z.union([
		z.literal('Studio'),
		z.literal('Narrative'),
		z.literal('Documentary'),
	]),
	head: z.string(),
	concept: z.string(),
	locations: z.string().optional(),
	scriptUrl: z.string().url().optional(),
	budget: z.number().max(20),
	resources: z.array(z.string()),
	dueDate: z.date(),
	approved: z.boolean().optional(),
	projectCode: z.string(),
})
