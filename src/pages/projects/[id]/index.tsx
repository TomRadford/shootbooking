import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import { api } from '~/utils/api'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Link from 'next/link'
import { NeutralCard } from '~/components/common/Cards'
import { budgetOptions } from '~/utils/common'
import { toast } from 'react-toastify'
import { andFormatter } from '~/utils/formatter'
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

	const handleApproval = () => {
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

		if (missingValues.length > 0) {
			toast(
				<>
					Please fill in the following values before requesting approval:
					<br />
					<strong>{andFormatter.format(missingValues)}</strong>
				</>,
				{ autoClose: false }
			)
			if (projectData?.id) {
				void router.push(`/projects/${projectData?.id}/edit`)
			}
		}

		// for (const property in projectData) {
		// 	if (typeof)
		// 	if (projectData[property].length === 0) {
		// 		missingValues.push(property)
		// 	}
		// }
	}

	return (
		<>
			<Head>
				<title>
					{projectData?.name} | {projectData?.client} | Shoot Booking
				</title>
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
										<button
											onClick={handleApproval}
											className="mx-auto w-max rounded-md bg-slate-800 px-2 py-1 transition-colors hover:bg-green-800"
										>
											Submit for approval
										</button>
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
