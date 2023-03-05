import * as React from 'react'
import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Heading } from '@react-email/heading'
import { Container } from '@react-email/container'
import { Button } from '@react-email/button'
import { Tailwind } from '@react-email/tailwind'
import { env } from '../../../env.mjs'

export const RequestApprovalMail = ({
	username = 'User',
	projectName = 'Shoot name',
	id = '1234',
}: {
	username: string
	projectName: string
	id: string
}) => {
	return (
		<Tailwind
			config={{
				theme: {
					extend: {
						fontFamily: {
							sans: ['Arial'],
						},
					},
				},
			}}
		>
			<Container className="mt-10 flex flex-row justify-center rounded-xl bg-slate-900 p-5 text-center font-sans text-white">
				<Heading as="h1" className=" ">
					Approval Requested
				</Heading>
				<Text>
					{username} has requested approval for <strong>{projectName}</strong>
				</Text>
				<Button
					className="mx-auto flex w-32 justify-center rounded-lg bg-slate-800 py-1 px-2 text-center font-bold text-white"
					href={`${env.BASE_URL}/projects/${id}`}
				>
					Review project
				</Button>
				<Text className=" text-xs font-light">
					Alternativley copy this URL into your browser: <br />{' '}
					{`${env.BASE_URL}/projects/${id}`}
				</Text>
			</Container>

			<Text className="text-center font-sans text-xs text-white">
				Sent automatically using the Shoot Booking system at{' '}
				{new Date().toLocaleDateString('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})}
			</Text>
		</Tailwind>
	)
}

export default RequestApprovalMail
