import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import EditProject from '~/components/Project/Edit'
import { api } from '~/utils/api'
import { CircleLoader } from '~/components/common/LoadingSpinners'

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
				<div className="w-full">
					<div className="flex flex-col items-center">
						{isLoading ? (
							<CircleLoader />
						) : isError ? (
							<>
								<h1 className="mb-2 text-2xl font-bold">404</h1>
								<p>{error.message}</p>
							</>
						) : (
							<h1 className="mb-2 text-2xl font-bold">{projectData?.name}</h1>
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
