import { z } from 'zod'

export const projectInputSchema = z.object({
	name: z.string().min(3),
	client: z.string().min(2),
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
	concept: z.string().optional().nullable(),
	locations: z.string().optional().nullable(),
	finalisedScript: z.boolean(),
	scriptUrl: z.string().url().array().default([]),
	budget: z.string({
		invalid_type_error: 'Please select a budget, you can change this later',
	}),
	resources: z.array(z.string()),
	shootStart: z.date().optional().nullable(),
	shootEnd: z.date().optional().nullable(),
	dueDate: z.date().optional().nullable(),
	approved: z.boolean(),
	complete: z.boolean().default(false),
	jobNumber: z.string().optional().nullable(),
	notes: z.string(),
})
// Make some fields required when approved
// .superRefine((val, ctx) => {
// 	if (val.approved) {
// 		if (!val.shootStart) {
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.invalid_date,
// 				path: ['shootStart'],
// 			})
// 		}
// 		if (!val.shootEnd) {
// 			ctx.addIssue({
// 				code: z.ZodIssueCode.invalid_date,
// 				path: ['shootEnd'],
// 			})
// 		}
// 	}
// })
// .refine((data) => data.approved === true && !data.shootStart, {
// 	message: 'Shoot start date missing',
// 	path: ['shootStart'],
// })
