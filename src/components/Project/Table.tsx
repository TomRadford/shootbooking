import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'

type RouterOutput = inferRouterOutputs<AppRouter>

type ProjectsType =
	| RouterOutput['project']['getAllPipeline']
	| RouterOutput['project']['getAllActive']

const columnHelper = createColumnHelper<ProjectsType>()

const defaultColumns = [
	columnHelper.accessor('name', { cell: (info) => info.getValue() }),
	columnHelper.accessor('client', { cell: (info) => info.getValue() }),
]

const ProjectTable = ({ projects }: { projects: ProjectsType }) => {
	const table = useReactTable({
		data: projects,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
	})
	return (
		<>
			{' '}
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
				<tfoot>
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.footer,
												header.getContext()
										  )}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</>
	)
}

export default ProjectTable