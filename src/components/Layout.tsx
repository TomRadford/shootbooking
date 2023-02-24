import Link from 'next/link'

const Layout = ({ children }: { children: React.ReactNode }) => (
	<div className="mx-4">
		<nav className="mb-10 w-full">
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
					<h1 className="font-bold">Shoot Booking</h1>
				</Link>
				<div className="flex gap-2 font-bold">
					<Link href="/project/add">Add</Link>
					<Link href="/project/add">View</Link>
				</div>
			</div>
		</nav>
		<main className="w-full">
			<div className="mx-auto max-w-xl">{children}</div>
		</main>
	</div>
)

export default Layout