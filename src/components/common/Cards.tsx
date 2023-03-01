export const NeutralCard = ({
	children,
	className = '',
}: {
	children: React.ReactNode
	className?: string
}) => (
	<div
		className={` rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-800 py-2 px-4 ${className}`}
	>
		{children}
	</div>
)
