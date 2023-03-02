import { TRPCError } from '@trpc/server'
import { projectInputSchema } from '~/inputSchema'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { type Project } from '@prisma/client'
import { sendRequestApproval } from '~/server/email/mailer'
export const projectRouter = createTRPCRouter({
	postProject: protectedProcedure
		.input(projectInputSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.create({
					data: {
						...input,
						userId: ctx.session?.user.id,
					},
					include: {
						User: true,
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
	postApprovalRequest: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const project = await ctx.prisma.project.findUnique({
					where: {
						id: input.id,
					},
				})
				if (!project) {
					throw new TRPCError({
						code: 'NOT_FOUND',
					})
				}
				const admins = await ctx.prisma.user.findMany({
					where: {
						admin: true,
					},
				})
				const emails = admins.map((admin) => admin.email || '')
				await sendRequestApproval({
					username: ctx.session.user.name || 'unknown',
					projectName: project.name,
					id: project.id,
					to: emails,
				})
			} catch (e: unknown) {
				const err = e as TRPCError
				throw new TRPCError({
					code: err.code,
				})
			}
		}),
	updateProject: protectedProcedure
		.input(
			projectInputSchema.extend({
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				// ToDo: if approved === true then send user email confirming
				return await ctx.prisma.project.update({
					where: {
						id: input.id,
					},
					data: {
						...input,
					},
					include: {
						User: true,
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
	getAll: protectedProcedure
		.input(
			z.object({
				approved: z.boolean(),
				complete: z.boolean().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.findMany({
					// ToDo: hide protected fields from all users
					where: {
						approved: input.approved,
						complete: input.complete ?? false,
					},
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						User: true,
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
	getProject: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const project = await ctx.prisma.project.findUnique({
					where: { id: input.id },
					include: { User: true },
				})

				if (ctx.session.user.admin && project) {
					return project
				} else {
					if (!project) {
						throw new TRPCError({
							code: 'NOT_FOUND',
						})
					}
					if (project['userId'] === ctx.session.user.id) {
						return project
					} else {
						throw new TRPCError({
							code: 'UNAUTHORIZED',
						})
					}
				}
			} catch (e: unknown) {
				const err = e as TRPCError
				throw new TRPCError({
					code: err.code,
				})
			}
		}),
})
