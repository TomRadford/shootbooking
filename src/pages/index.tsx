import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ProjectsCalendar } from '~/components/Project/Calendar'
import useHasMounted from '~/utils/hooks/mounted'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Shoot Booking</title>
				<meta name="description" content="Shoot Booking App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="mt-16 flex flex-col items-center ">
				<h1 className="mb-3 text-4xl font-bold">Shoot Booking</h1>
				<p className=" mb-2 text-center text-lg font-light">
					Welcome to the live action project management system!
				</p>
				<Link
					href="/projects/add"
					className="rounded-md border bg-stone-700 px-2 text-xl transition-colors hover:bg-stone-600"
				>
					Submit a new shoot
				</Link>

				<div className="mt-5 h-full w-full">
					<ProjectsCalendar />
				</div>
			</main>
		</>
	)
}

export default Home
