import { TRPCError } from '@trpc/server'
import { projectSchema } from '~/schema'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const projectRouter = createTRPCRouter({
	postMessage: publicProcedure
		.input(projectSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.project.create({
					data: {
						...input,
					},
				})
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'An error occured',
					cause: e,
				})
			}
		}),
})
