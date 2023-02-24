import Head from 'next/head'
import Layout from '~/components/Layout'
import EditProject from '~/components/Project/Edit'

const AddPage = () => {
	return (
		<>
			<Head>
				<title>Project | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full">
					<div className="flex flex-col items-center">
						<h1 className="mb-2 text-2xl font-bold">Project</h1>
						{/* <EditProject /> */}
					</div>
				</div>
			</Layout>
		</>
	)
}

export default AddPage
