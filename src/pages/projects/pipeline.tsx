import Head from 'next/head'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Layout from '~/components/Layout'
import ProjectTable from '~/components/Project/Table'
import { api } from '~/utils/api'

const PipelinePage = () => {
	const { data: allPipelineProjects, isLoading } =
		api.project.getAllPipeline.useQuery()
	console.log(allPipelineProjects)
	return (
		<>
			<Head>
				<title>Projects in Pipeline | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full">
					<div className="flex flex-col items-center">
						<h1 className="mb-2 text-2xl font-bold">
							Project Pipeline Summary
						</h1>
						<p>All upcomming live action shoots that are yet to be finalised</p>
						{isLoading ? (
							<CircleLoader size="100" />
						) : allPipelineProjects ? (
							<ProjectTable projects={allPipelineProjects} />
						) : (
							<p>Unable to fetch pipeline projects</p>
						)}
					</div>
				</div>
			</Layout>
		</>
	)
}

export default PipelinePage
