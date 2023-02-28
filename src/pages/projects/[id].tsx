import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import EditProject from '~/components/Project/Edit'
import { api } from '~/utils/api'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Link from 'next/link'

const AddPage = () => {
	const router = useRouter()
	const {
		data: projectData,
		isLoading,
		isError,
		error,
	} = api.project.getProject.useQuery({
		id: router.query.id as string,
	})

	return (
		<>
			<Head>
				<title>Project | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full ">
					<div className="flex flex-col items-center ">
						{isLoading ? (
							<CircleLoader />
						) : isError ? (
							<>
								<h1 className="mb-2 text-2xl font-bold">404</h1>
								<p>{error.message}</p>
							</>
						) : (
							projectData && (
								<>
									<div className="flex w-full flex-col gap-2 rounded-md bg-gradient-to-b from-black to-neutral-800 px-10 pb-2 md:w-11/12">
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
											<h1 className=" text-4xl font-bold">
												{projectData.name}
											</h1>
											<h3 className=" ml-2 text-right text-xl">
												for{' '}
												<span className="font-bold"> {projectData.client}</span>
											</h3>
										</div>
									</div>
									<div className="mt-3 flex">
										<div className="rounded-sm bg-gradient-to-b from-black to-neutral-800">
											hii
										</div>
									</div>
								</>
							)
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
