import { create } from 'zustand'
import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

interface ProjectsState {
	projects: Project[]
	setProjects: (projects: Project[]) => void
}

//workaround for calander bug
export const useProjectsStore = create<ProjectsState>((set) => ({
	projects: [],
	setProjects: (newProjects) => set(() => ({ projects: newProjects })),
}))
