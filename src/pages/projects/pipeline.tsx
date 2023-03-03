import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useState } from 'react'
import { CircleLoader } from '~/components/common/LoadingSpinners'
import Layout from '~/components/Layout'
import ProjectTable from '~/components/Project/Table'
import { api } from '~/utils/api'

const PipelinePage = () => {
	const [filterByUser, setFilterByUser] = useState(false)
	const { data: allPipelineProjects, isLoading } = api.project.getAll.useQuery({
		approved: false,
	})
	const { data: sessionData } = useSession()

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
						{!sessionData?.user.admin && (
							<div className="mx-auto text-center">
								<p className="font-thin">
									Note that you can only edit your own projects
								</p>
								<div className="mt-4 flex items-center justify-center gap-1">
									<input
										type="checkbox"
										id="filter"
										checked={filterByUser}
										onChange={() => setFilterByUser(!filterByUser)}
									/>
									<label htmlFor="filter">Only show my projects</label>
								</div>
							</div>
						)}
						<div className="mt-10">
							{isLoading ? (
								<CircleLoader size="100" />
							) : allPipelineProjects ? (
								<ProjectTable
									projects={
										filterByUser
											? allPipelineProjects.filter(
													(project) => project.userId === sessionData?.user.id
											  )
											: allPipelineProjects
									}
								/>
							) : (
								<p>Unable to fetch pipeline projects</p>
							)}
						</div>
					</div>
				</div>
			</Layout>
		</>
	)
}

export default PipelinePage
