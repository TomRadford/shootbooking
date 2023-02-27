import { TRPCError } from '@trpc/server'
import { projectInputSchema } from '~/inputSchema'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const projectRouter = createTRPCRouter({
	postMessage: publicProcedure
		.input(projectInputSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.create({
					data: {
						...input,
					},
				})
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `An error occured`,
					cause: e,
				})
			}
		}),
	getAllPipeline: publicProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.project.findMany({
				where: {
					approved: false,
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
	getAllActive: publicProcedure.query(async ({ ctx }) => {
		try {
			return await ctx.prisma.project.findMany({
				where: {
					approved: true,
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
