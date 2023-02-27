import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'

type RouterOutput = inferRouterOutputs<AppRouter>

const ProjectTable = ({
	projects,
}: {
	projects: RouterOutput['project']['getAll']
}) => {
	return <></>
}

export default ProjectTable
