import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { CircleLoader } from './common/LoadingSpinners'
import { toast } from 'react-toastify'

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data: sessionData, status } = useSession()

	return (
		<div className="mx-4">
			<nav className="mb-10 mt-4 w-full">
				<div className=" mx-auto flex max-w-4xl items-center justify-between gap-3">
					<Link href="/" className=" flex flex-col items-center justify-center">
						<svg
							fill="white"
							className="h-16 w-32"
							viewBox="0.1 49.5 88.3 27"
							xmlns="http://www.w3.org/2000/svg"
						>
							<polygon points="0.1,76.5 44.2,49.5 88.4,76.5 44.2,63.3" />
						</svg>
						<h5 className="font-bold">Shoot Booking</h5>
					</Link>
					{sessionData && (
						<div className="flex flex-wrap gap-2 font-bold ">
							<Link className="hover:text-gray-300" href="/projects/add">
								Add
							</Link>
							<Link className="hover:text-gray-300" href="/projects/pipeline">
								Pipeline
							</Link>
							<Link className="hover:text-gray-300" href="/projects/active">
								Active
							</Link>
							<Link href="/me">
								<div className="group relative flex w-16 justify-center text-center">
									<Image
										src={sessionData.user.image ?? '/user.jpeg'}
										alt={sessionData.user?.name ?? ''}
										className="rounded-full"
										width={30}
										height={30}
									/>

									<div className="absolute -bottom-4 w-20 text-[0.5rem] opacity-0 transition-opacity group-hover:opacity-100">
										{sessionData.user.name}
									</div>
								</div>
							</Link>
						</div>
					)}
				</div>
			</nav>
			<main className="mb-10 w-full">
				<div className="mx-auto max-w-6xl">
					{status === 'loading' ? (
						<div className="flex justify-center">
							<CircleLoader size="100" />
						</div>
					) : sessionData ? (
						children
					) : (
						<div className="mx-auto text-center">
							<h1 className="text-4xl font-bold">Welcome!</h1>
							<p className="my-3 font-thin">
								This application requires you to sign in with your Microsoft
								account:
							</p>
							<button
								onClick={async () => {
									await toast.promise(signIn('azure-ad'), {
										pending: 'Logging in!',
										error: 'Error logging in!',
										success: 'You should be redirected soon!',
									})
								}}
								className="rounded-md border border-stone-600 bg-neutral-800 py-1 px-1 transition-colors  hover:bg-neutral-900"
							>
								Sign in
							</button>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}

export default Layout
