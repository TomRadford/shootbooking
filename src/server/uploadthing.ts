import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { createUploadthing, type FileRouter } from 'uploadthing/server'
import { authOptions } from './auth'
import { getToken } from 'next-auth/jwt'

const f = createUploadthing()

const maxFileSize = '128MB'

export const fileRouter = {
	scriptUploader: f({
		blob: {
			maxFileSize,
		},
	})
		.middleware(async (req) => {
			const session = await getToken({ req, secret: process.env.NEXTAUTH_URL })
			console.log(session)
			// console.log(session)
			//auth stuff goes here
			return {}
		})
		.onUploadComplete(({ metadata, file }) => {
			// console.log(metadata)
			console.log(`upload complete for ${file.name} at ${file.url}`)
		}),
} satisfies FileRouter
