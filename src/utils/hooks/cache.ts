import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'
import { api } from '../api'

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

export const useAddProjectToCache = (projects: Project[]) => {
	const utils = api.useContext()
	return (id: string) => {
		const projectToAdd = projects.find((project) => project.id === id)
		utils.project.getProject.setData({ id }, () => projectToAdd)
	}
}
