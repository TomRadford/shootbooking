import Head from 'next/head'
import Layout from '~/components/Layout'
import EditProject from '~/components/Project/Edit'

const AddPage = () => {
	return (
		<>
			<Head>
				<title>Add Shoot | Shoot Booking</title>
			</Head>
			<Layout>
				<div className="w-full">
					<div className="flex justify-center">
						<EditProject />
					</div>
				</div>
			</Layout>
		</>
	)
}

export default AddPage
