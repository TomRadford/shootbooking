import { type NextPage } from 'next'
import Head from 'next/head'

import Layout from '~/components/Layout'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Shoot Booking</title>
				<meta name="description" content="Shoot Booking App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="mt-16 flex min-h-screen flex-col items-center">
				<h1 className="text-2xl font-bold">Use links above</h1>
				<p>Welcome :)</p>
			</main>
		</>
	)
}

export default Home
