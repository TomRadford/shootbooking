import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import { api } from '~/utils/api'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Link from 'next/link'
import { NeutralCard } from '~/components/common/Cards'
import { budgetOptions } from '~/utils/common'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { type projectInputSchema } from '~/inputSchema'
import { type z } from 'zod'
import NiceModal from '@ebay/nice-modal-react'
import Modal from '~/components/common/Modal'

type ProjectInput = z.infer<typeof projectInputSchema>

const AddPage = () => {
	const router = useRouter()
	const {
		data: projectData,
		isLoading,
		isError,
		error,
	} = api.project.getProject.useQuery(
		{
			id: router.query.id as string,
		},
		{ enabled: typeof router.query.id === 'string' }
	)
	const { data: sessionData } = useSession()
	const utils = api.useContext()
	const updateProject = api.project.updateProject.useMutation({
		onSuccess: (data) => {
			utils.project.getProject.setData({ id: data.id }, () => data)
		},
	})
	const requestApproval = api.project.postApprovalRequest.useMutation()
	const deleteProject = api.project.deleteProject.useMutation()

	const handleApproval = async () => {
		if (projectData && projectData.id) {
			await toast.promise(
				updateProject.mutateAsync({
					...(projectData as ProjectInput),
					id: projectData.id,
					approved: !projectData.approved,
					notifyApproved: !projectData.approved,
				}),
				{
					error: 'Unable to set approval',
					pending: 'Setting approval',
					success: 'Approval status set!',
				}
			)
		}
	}

	const handleDelete = async () => {
		await NiceModal.show(Modal, {
			title: (
				<p>
					Delete <strong>{projectData?.name}</strong>?
				</p>
			),
			message: (
				<p>
					Are you sure you want to delete this project from the system? <br />
					<span className="text-red-500">
						You should only do this if this project was a mistake
					</span>
					, if this project is complete - rather mark it as complete to keep it
					on record.
				</p>
			),
			clickMessage: 'DELETE',
			action: async () => {
				if (projectData) {
					await toast.promise(
						deleteProject.mutateAsync({ id: projectData.id }),
						{
							error: 'Unable to delete this project',
							pending: 'Deleting project',
							success: 'Project has been deleted!',
						}
					)
					void router.push('/projects/pipeline')
				}
			},
		})
	}

	const handleComplete = async () => {
		if (projectData && projectData.id) {
			await toast.promise(
				updateProject.mutateAsync({
					...(projectData as ProjectInput),
					id: projectData.id,
					complete: !projectData.complete,
				}),
				{
					error: 'Unable to set complete status',
					pending: 'Setting complete status',
					success: 'Set complete status!',
				}
			)
		}
	}

	const makeApprovalRequest = async () => {
		if (projectData?.id) {
			void (await toast.promise(
				requestApproval.mutateAsync({ id: projectData?.id }),
				{
					pending: 'Requesting approval',
					error: 'Error requesting approval',
					success:
						'Approval has been requested! Keep an eye on your emails for approval notifcation.',
				}
			))
		}
	}

	const handleApprovalRequest = async () => {
		const missingValues = []
		if (!projectData?.jobNumber) {
			missingValues.push('Job number')
		}
		if (!projectData?.dueDate) {
			missingValues.push('Due date')
		}
		if (!projectData?.shootStart) {
			missingValues.push('Proposed Shoot start date')
		}
		if (!projectData?.shootEnd) {
			missingValues.push('Proposed Shoot end date')
		}
		if (!projectData?.finalisedConcept) {
			missingValues.push('Concept needs to be finalised')
		}
		if (!projectData?.budget) {
			missingValues.push('Budget')
		}
		// Add script urls check if script finalised

		if (missingValues.length > 0) {
			toast(
				<>
					Please fill in the following values for{' '}
					<strong>{projectData?.name}</strong> before requesting approval:
					<br />
					<ul className=" list-inside list-disc">
						{missingValues.map((val) => (
							<li key={val}>{val}</li>
						))}
					</ul>
				</>,
				{ autoClose: false }
			)
			if (projectData?.id) {
				void router.push(`/projects/${projectData?.id}/edit`)
			}
			return
		}
		await NiceModal.show(Modal, {
			title: 'Submit for approval?',
			message: (
				<p>
					Are you sure you want to submit this project for approval? <br />
					You can&#39;t make changes once it&#39;s been approved.
				</p>
			),
			clickMessage: 'Submit',
			action: makeApprovalRequest,
		})
	}

	return (
		<>
			<Head>
				{!projectData ? (
					<title>Loading Project | Shoot Booking</title>
				) : (
					<title>
						{projectData && `${projectData?.name} | ${projectData?.client}`}|
						Shoot Booking
					</title>
				)}
			</Head>
			<Layout>
				<div className="w-full ">
					<div className="flex flex-col items-center ">
						{isLoading ? (
							<CircleLoader />
						) : isError ? (
							<>
								<h1 className="mb-2 text-2xl font-bold">Error</h1>
								<p>{error.message}</p>
							</>
						) : projectData ? (
							<>
								<header className="flex w-full flex-col gap-2 rounded-md bg-gradient-to-b from-black to-neutral-800 px-10 pb-2 md:w-11/12">
									<div className="flex flex-wrap justify-between">
										<div className="flex gap-2">
											{(sessionData?.user.admin || !projectData.approved) && (
												<div className="group relative">
													<Link href={`/projects/${projectData.id}/edit`}>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="h-6 w-6"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															/>
														</svg>
													</Link>
													<div className="absolute -left-5 w-[3rem] rounded-md border border-zinc-700 bg-black px-2 py-1 text-center text-xs opacity-0 group-hover:opacity-100">
														Edit
													</div>
												</div>
											)}
											{sessionData?.user.admin && (
												<>
													<div className="group relative">
														<button onClick={handleApproval}>
															{projectData.approved ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="h-6 w-6"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="h-6 w-6"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
																	/>
																</svg>
															)}
														</button>
														<div className="absolute -left-9 w-24 rounded-md border border-zinc-700 bg-black px-2 py-1 text-center text-xs opacity-0 group-hover:opacity-100">
															Set approval
														</div>
													</div>
													<div className="group relative">
														<button onClick={handleComplete}>
															{!projectData.complete ? (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="h-6 w-6"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
																	/>
																</svg>
															) : (
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	strokeWidth={1.5}
																	stroke="currentColor"
																	className="h-6 w-6"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
																	/>
																</svg>
															)}
														</button>
														<div className="absolute -left-9 w-24 rounded-md border border-zinc-700 bg-black px-2 py-1 text-center text-xs opacity-0 group-hover:opacity-100">
															Set complete
														</div>
													</div>
													<div className="group relative">
														<button onClick={handleDelete}>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																strokeWidth={1.5}
																stroke="currentColor"
																className="h-6 w-6"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
																/>
															</svg>
														</button>
														<div className="absolute -left-9 w-24 rounded-md border border-zinc-700 bg-black px-2 py-1 text-center text-xs opacity-0 group-hover:opacity-100">
															Delete Project
														</div>
													</div>
												</>
											)}
										</div>
										<div className="w-max rounded-xl border border-neutral-700  bg-neutral-900 px-3 text-center">
											{projectData.shootType} shoot
										</div>

										<div className="flex">
											<div
												className={`w-max rounded-xl border border-neutral-700  px-3 text-center ${
													projectData.approved
														? ` bg-green-800`
														: ` bg-slate-900`
												}`}
											>
												{projectData.approved ? 'Approved' : 'Pipeline'}
											</div>
											{projectData.complete && (
												<div className="ml-2 w-max rounded-xl border border-neutral-700  bg-stone-800 px-3  text-center">
													Complete
												</div>
											)}
										</div>
									</div>
									<div className="flex items-end justify-between">
										<h1 className=" text-4xl font-bold">{projectData.name}</h1>
										<h3 className=" ml-2 text-right text-xl">
											for{' '}
											<span className="font-bold"> {projectData.client}</span>
										</h3>
									</div>
									<div className="flex justify-between">
										{projectData.head && (
											<p className="text-sm">
												Headed by{' '}
												<span className="font-bold">{projectData.head}</span>
											</p>
										)}
										{projectData.jobNumber && (
											<div className="h-max w-max rounded-xl border border-neutral-700 bg-slate-900 px-3 text-center text-sm">
												{projectData.jobNumber}
											</div>
										)}
									</div>
									<div className="flex justify-between text-xs text-stone-300">
										<div>
											{projectData.User && (
												<> Submitted by {projectData.User?.name}</>
											)}
										</div>
										<div>
											Updated at{' '}
											{projectData.updatedAt.toLocaleDateString('en-GB', {
												hour: '2-digit',
												minute: '2-digit',
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											})}
										</div>
									</div>
								</header>
								<div className="mt-4 flex  flex-wrap justify-center gap-4 ">
									<div className="flex flex-col gap-4">
										{projectData.userId === sessionData?.user.id &&
										!projectData.approved ? (
											<button
												onClick={handleApprovalRequest}
												className="mx-auto w-max rounded-md bg-slate-800 px-2 py-1 transition-colors hover:bg-green-800"
											>
												Submit for approval
											</button>
										) : null}
										<NeutralCard className="">
											<div className="flex flex-col justify-between">
												<div className="flex justify-between gap-2">
													<h3 className="text-lg font-semibold">Dates</h3>
												</div>
												<ul>
													<li className="flex justify-between">
														<p>Due:</p>
														<p className="text-right font-bold">
															{projectData.dueDate?.toLocaleDateString(
																'en-GB',
																{
																	day: 'numeric',
																	month: 'long',
																	year: 'numeric',
																}
															)}
														</p>
													</li>
													{projectData.shootStart && (
														<li className="flex justify-between">
															<p>Shoot Start:</p>
															<p className="font-bold">
																{projectData.shootStart?.toLocaleDateString(
																	'en-GB',
																	{
																		day: 'numeric',
																		month: 'long',
																		year: 'numeric',
																	}
																)}
															</p>
														</li>
													)}
													{projectData.shootEnd && (
														<li className="flex justify-between">
															<p>Shoot End:</p>
															<p className="font-bold">
																{projectData.shootEnd?.toLocaleDateString(
																	'en-GB',
																	{
																		day: 'numeric',
																		month: 'long',
																		year: 'numeric',
																	}
																)}
															</p>
														</li>
													)}
												</ul>
											</div>
										</NeutralCard>
										<NeutralCard className="">
											<div className="flex flex-col justify-between">
												<div className="flex justify-between gap-2">
													<h3 className="text-lg font-semibold">Budget</h3>
												</div>
												<p className="text-center">
													{projectData.budget
														? budgetOptions[parseInt(projectData.budget)]
														: 'None'}
												</p>
											</div>
										</NeutralCard>
									</div>
									<NeutralCard className="w-72">
										<div className="flex flex-col justify-between">
											<div className="flex justify-between gap-2">
												<h3 className="text-lg font-semibold">Locations</h3>
												<div className="w-max rounded-xl border border-neutral-700  bg-neutral-900 px-3 text-center">
													{projectData.shootBase}
												</div>
											</div>
											<p className="whitespace-pre-wrap">
												{projectData.locations}
											</p>
										</div>
									</NeutralCard>
									<NeutralCard className="">
										<div className="flex flex-col justify-between">
											<div className="flex justify-between gap-2">
												<h3 className="text-lg font-semibold">Resources</h3>
											</div>
											<ul className="list-inside list-disc">
												{projectData.resources.map((resource, i) => (
													<li key={i}>{resource}</li>
												))}
											</ul>
										</div>
									</NeutralCard>
									{projectData.concept && (
										<NeutralCard className="w-72">
											<div className="flex flex-col justify-between">
												<div className="flex justify-between gap-2">
													<h3 className="text-lg font-semibold">Concept</h3>
												</div>
												<p className="whitespace-pre-wrap">
													{projectData.concept}
												</p>
											</div>
										</NeutralCard>
									)}
									<NeutralCard className="w-72 ">
										<div className="flex flex-col justify-between">
											<div className="flex justify-between gap-2">
												<h3 className="text-lg font-semibold">Script</h3>
												<div className="w-max rounded-xl border border-neutral-700  bg-neutral-900 px-3 text-center">
													{projectData.finalisedScript
														? 'Finalised'
														: 'not finalised'}
												</div>
											</div>

											{projectData.scriptUrl.length === 0 ? (
												<p>No script files yet</p>
											) : (
												<ul>
													{projectData.scriptUrl.map((url) => (
														<li key={url}>
															<a href={url}>{url}</a>
														</li>
													))}
												</ul>
											)}
										</div>
									</NeutralCard>
									{projectData.notes && (
										<NeutralCard className="w-72">
											<div className="flex flex-col justify-between">
												<div className="flex justify-between gap-2">
													<h3 className="text-lg font-semibold">Notes</h3>
												</div>
												<p className="whitespace-pre-wrap">
													{projectData.notes}
												</p>
											</div>
										</NeutralCard>
									)}
								</div>
							</>
						) : (
							<>
								<h1 className="mb-2 text-2xl font-bold">404</h1>
								<p>Project not found</p>
							</>
						)}
					</div>
				</div>
			</Layout>
		</>
	)
}
// export const getServerSideProps = async ({
// 	params,
// }: GetServerSidePropsContext) => {
// 	return {
// 		props: {
// 			id: params.id,
// 		},
// 	}
// }

export default AddPage
