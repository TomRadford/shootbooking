import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import { toast } from 'react-toastify'
import Layout from '~/components/Layout'

const MePage = () => {
	const { data: sessionData } = useSession()

	return (
		<>
			<Head>
				<title>User Info | Shoot Booking</title>
			</Head>

			<div className="w-full ">
				<div className="flex flex-col items-center justify-center">
					<header className="flex w-full flex-col gap-2 rounded-md bg-gradient-to-b from-black to-neutral-800 px-10 pb-2 md:w-11/12">
						<div className="flex flex-wrap justify-between">
							<p className="text-lg font-bold">{sessionData?.user.name}</p>
							<div className="h-max w-max rounded-xl border border-neutral-700  bg-neutral-900 px-3 text-center">
								{sessionData?.user.admin ? 'Admin' : 'User'}
							</div>
							<button
								onClick={async () => {
									await toast.promise(signOut(), {
										pending: 'Logging out!',
										error: 'Error logging out!',
										success: 'Successfully logged out!',
									})
								}}
								className="rounded-md border border-stone-600 bg-neutral-800 py-1 px-1 transition-colors  hover:bg-neutral-900"
							>
								Sign out
							</button>
						</div>
					</header>
				</div>
			</div>
		</>
	)
}

export default MePage
