import Head from 'next/head'
import Layout from '~/components/Layout'
import ProjectTable from '~/components/Project/Table'

const ActivePage = () => {
	return (
		<>
			<Head>
				<title>Active Projects | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full">
					<div className="flex flex-col items-center">
						<h1 className="mb-2 text-2xl font-bold">Active Projects Summary</h1>
						<p>Active Projects</p>
						<ProjectTable projects={[]} />
					</div>
				</div>
			</Layout>
		</>
	)
}

export default ActivePage
