import Head from 'next/head'
import { useRouter } from 'next/router'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Layout from '~/components/Layout'
import EditProject from '~/components/Project/Edit'
import { api } from '~/utils/api'

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
	return (
		<>
			<Head>
				<title>Edit Shoot | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full">
					<div className="flex flex-col items-center">
						{isLoading ? (
							<CircleLoader />
						) : isError ? (
							<>
								<h1 className="mb-2 text-2xl font-bold">Error</h1>
								<p>{error.message}</p>
							</>
						) : projectData ? (
							<>
								<h1 className="mb-2 text-2xl font-bold">
									Edit {projectData.name}
								</h1>
								<EditProject project={projectData} />
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

export default AddPage
