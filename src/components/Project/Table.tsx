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

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

const columnHelper = createColumnHelper<Project>()

const pipelineProjectColumns = [
	columnHelper.accessor('name', {
		cell: (info) => info.getValue(),
		header: 'Project Name',
	}),
	columnHelper.accessor('client', {
		cell: (info) => info.getValue(),
		header: 'Client',
	}),
	columnHelper.accessor('head', {
		cell: (info) => info.getValue(),
		header: 'Project Head',
	}),
	columnHelper.accessor('shootType', {
		cell: (info) => info.getValue(),
		header: 'Type',
	}),
	columnHelper.accessor('shootBase', {
		cell: (info) => info.getValue(),
		header: 'Base',
	}),
	columnHelper.accessor('locations', {
		cell: (info) => info.getValue(),
		header: 'Locations',
	}),
	columnHelper.accessor('resources', {
		cell: (info) => andFormatter.format(info.getValue()),
		header: 'Resources',
		maxSize: 10,
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

	const utils = api.useContext()

	const addProjectToCache = (id: string) => {
		const projectToAdd = projects.find((project) => project.id === id)
		utils.project.getProject.setData({ id }, () => projectToAdd)
	}

	return (
		<div className=" mx-auto w-96 overflow-x-auto shadow-md sm:rounded-lg md:w-full">
			<table className="w-full text-left text-sm text-gray-400">
				<thead className=" bg-gradient-to-t from-neutral-800 to-neutral-900 text-xs uppercase text-gray-400">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} scope="col" className="px-6 py-3">
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
								addProjectToCache(row.original.id)
								void router.push(`/projects/${row.original.id}`)
							}}
							key={row.id}
							className="cursor-pointer border-b border-neutral-700  bg-neutral-900 hover:bg-neutral-800"
						>
							{row.getVisibleCells().map((cell) => {
								if (cell.column.id === 'name') {
									return (
										<td key={cell.id} className="px-6 py-4 font-bold">
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
									<td key={cell.id} className="px-6 py-4">
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
