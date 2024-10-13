import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { andFormatter } from '~/utils/formatter'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { api } from '~/utils/api'
import { useAddProjectToCache } from '~/utils/hooks/cache'
import { useSession } from 'next-auth/react'

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

const columnHelper = createColumnHelper<Project>()

const pipelineProjectColumns = [
	columnHelper.accessor('name', {
		cell: (info) => info.getValue(),
		header: 'Project Name',
		size: 20,
	}),
	columnHelper.accessor('client', {
		cell: (info) => info.getValue(),
		header: 'Client',
		size: 20,
	}),
	columnHelper.accessor('head', {
		cell: (info) => info.getValue(),
		header: 'Project Head',
		size: 20,
	}),
	columnHelper.accessor('shootType', {
		cell: (info) => info.getValue(),
		header: 'Type',
		size: 20,
	}),
	columnHelper.accessor('shootBase', {
		cell: (info) => info.getValue(),
		header: 'Base',
		size: 20,
	}),
	columnHelper.accessor('locations', {
		cell: (info) => info.getValue(),
		header: 'Locations',
		enableSorting: false,
		size: 20,
	}),
	columnHelper.accessor('resources', {
		cell: (info) => andFormatter.format(info.getValue()),
		header: 'Resources',
		size: 20,

		enableSorting: false,
	}),
	columnHelper.accessor('dueDate', {
		cell: (info) =>
			info.getValue()?.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: '2-digit',
			}),
		header: 'Due date',
		size: 20,
	}),
	columnHelper.accessor('User.name', {
		cell: (info) => info.getValue(),
		header: 'Created by',
		size: 20,
	}),
	columnHelper.accessor('updatedAt', {
		cell: (info) =>
			info.getValue()?.toLocaleDateString('en-GB', {
				minute: '2-digit',
				hour: '2-digit',
				day: 'numeric',
				month: 'numeric',
				year: '2-digit',
			}),
		header: 'Updated at',
	}),
	// columnHelper.accessor('concept', {
	// 	cell: (info) => info.getValue(),
	// 	header: 'Concept',
	// 	minSize: 100,
	// }),
]

// extend pipelineProjectColumns for activeProjectColumns

const ProjectTable = ({ projects }: { projects: Project[] }) => {
	const table = useReactTable({
		data: projects,
		columns: pipelineProjectColumns,
		columnResizeMode: 'onChange',
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	})
	const router = useRouter()
	const { data: sessionData } = useSession()
	const addProjectToCache = useAddProjectToCache(projects)

	return (
		<div className=" mx-auto w-[20rem] overflow-x-auto shadow-md sm:w-[30rem] sm:rounded-lg md:w-[40rem] lg:w-full">
			<table
				className="w-full text-left text-sm text-gray-400"
				{...{
					style: {
						width: table.getCenterTotalSize(),
					},
				}}
			>
				<thead className=" bg-gradient-to-t from-neutral-800 to-neutral-900 text-xs uppercase text-gray-400">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									scope="col"
									className="px-6 py-3"
									key={header.id}
									{...{
										colSpan: header.colSpan,
										style: {
											width: header.getSize(),
										},
									}}
								>
									<button
										className={
											header.column.getCanSort()
												? 'cursor-pointer'
												: 'cursor-default'
										}
										onClick={header.column.getToggleSortingHandler()}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
										{{ asc: ' ▲', desc: ' ▼' }[
											header.column.getIsSorted() as string
										] ?? null}
									</button>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr
							onClick={() => {
								if (
									sessionData?.user.admin ||
									row.original.userId === sessionData?.user.id
								) {
									addProjectToCache(row.original.id)
									void router.push(`/projects/${row.original.id}`)
								}
							}}
							key={row.id}
							className={`border-b border-neutral-700   ${
								sessionData?.user.admin ||
								row.original.userId === sessionData?.user.id
									? `cursor-pointer bg-neutral-900 hover:bg-neutral-800`
									: `cursor-not-allowed bg-black`
							}`}
						>
							{row.getVisibleCells().map((cell) => {
								if (cell.column.id === 'name') {
									return (
										<td
											key={cell.id}
											className=" px-6 py-4 font-bold"
											{...{
												style: {
													width: cell.column.getSize(),
												},
											}}
										>
											<Link
												onClick={() => addProjectToCache(row.original.id)}
												href={`/projects/${row.original.id}`}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</Link>
										</td>
									)
								}
								return (
									<td
										key={cell.id}
										className="whitespace-pre-line px-6 py-4"
										{...{
											style: {
												width: cell.column.getSize(),
											},
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ProjectTable
