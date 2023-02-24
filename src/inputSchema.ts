import { z } from 'zod'

export const projectInputSchema = z.object({
	name: z.string().min(3),
	client: z.string(),
	shootType: z.union([
		z.literal('Studio'),
		z.literal('Narrative'),
		z.literal('Documentary'),
	]),
	shootBase: z.union([
		z.literal('Local'),
		z.literal('National'),
		z.literal('International'),
	]),
	head: z.string(),
	finalisedConcept: z.boolean(),
	concept: z.string().optional(),
	locations: z.string().optional(),
	scriptUrl: z.string().url().optional(),
	budget: z.string(),
	resources: z.array(z.string()),
	dueDate: z.date().optional(),
	approved: z.boolean().optional(),
	projectCode: z.string().optional(),
	notes: z.string(),
})
