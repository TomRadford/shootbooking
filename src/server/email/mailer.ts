import { render } from '@react-email/render'
import sendgrid from '@sendgrid/mail'
import { env } from '~/env.mjs'
import ProjectApprovedMail from './templates/ProjectApproved'
import RequestApprovalMail from './templates/RequestApproval'

sendgrid.setApiKey(env.SENDGRID_API_KEY)

export const sendRequestApproval = async ({
	username,
	projectName,
	id,
	to,
}: {
	username: string
	projectName: string
	id: string
	to: string | string[]
}) => {
	const emailHtml = render(RequestApprovalMail({ username, projectName, id }))
	await sendgrid.send({
		from: { email: 'mail@em4224.rooftop-host.eu', name: 'Shoot Booking' },
		to,
		subject: `Approval request for ${projectName}`,
		html: emailHtml,
	})
}

export const sendProjectApproved = async ({
	username,
	projectName,
	id,
	to,
}: {
	username: string
	projectName: string
	id: string
	to: string | string[]
}) => {
	const emailHtml = render(ProjectApprovedMail({ username, projectName, id }))
	await sendgrid.send({
		from: { email: 'mail@em4224.rooftop-host.eu', name: 'Shoot Booking' },
		to,
		subject: `${projectName} has been approved!`,
		html: emailHtml,
	})
}
