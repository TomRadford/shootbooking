import Kalend, { CalendarView, type OnEventClickData } from 'kalend'
import 'kalend/dist/styles/index.css' // import styles
import { api } from '~/utils/api'
import NiceModal from '@ebay/nice-modal-react'
import ProjectModal from '../common/ProjectModal'
import { useProjectsStore } from '~/utils/store/projects'
import { useEffect } from 'react'

// data fetching done in ProjectsCalendar to be able allow for lazy loading
export const ProjectsCalendar = () => {
	const {
		data: projectsData,
		isLoading,
		isFetching,
		isError,
		error,
	} = api.project.getAll.useQuery({})
	const setProjectsStore = useProjectsStore((state) => state.setProjects)

	useEffect(() => {
		if (!isLoading && !isFetching) {
			if (projectsData) {
				setProjectsStore(projectsData)
			}
		}
		return () => setProjectsStore([])
	}, [projectsData, isLoading, isFetching, setProjectsStore])

	const onEventClick = async (eventData: OnEventClickData) => {
		const idToFind = (eventData.id as string)
			.replace('-startEnd', '')
			.replace('-due', '')

		await NiceModal.show(ProjectModal, { projectId: idToFind })
	}

	if (isError) {
		return (
			<>
				<h1 className="mb-2 text-2xl font-bold">Error loading calendar</h1>
				<p>{error.message}</p>
			</>
		)
	}

	const calEvents = projectsData
		? [
				...projectsData
					.filter((project) => project.shootStart && project.shootEnd)
					.map((project) => {
						let endDate: Date | undefined
						if (project.shootEnd) {
							endDate = new Date(project.shootEnd?.getTime() + 3600)
						}

						return {
							id: `${project.id}-startEnd`,
							startAt: (project.shootStart as Date).toISOString(),
							endAt: endDate?.toISOString(),
							summary: `${project.approved ? 'Active' : 'Pipeline'} Shoot: ${
								project.name
							} | ${project.client}`,
							color: project.approved ? '#5fda6e' : '#d59d5a',
						}
					}),
				...projectsData
					.filter((project) => project.dueDate)
					.map((project) => ({
						id: `${project.id}-due`,
						startAt: (project.dueDate as Date).toISOString(),
						endAt: (project.dueDate as Date).toISOString(),
						summary: `Deadline: ${project.name} | ${project.client}`,
						color: '#ae1414',
					})),
		  ]
		: []

	// Note: Kalend requires empty array to then be populated for month for to show up if month default.
	// More than likely a pre-release bug that we're getting around by keeping in dom on first render with display:none
	//ToDo: relook when Kalend is more mature or use a more complex library
	return (
		<div>
			<div className="relative h-[50rem] w-full overflow-hidden">
				<div
					className={`absolute top-0 z-30 h-full w-full animate-pulse  bg-zinc-800 ${
						!isLoading && !isFetching ? 'hidden' : ''
					}`}
				></div>
				<div
					className={`h-full w-full transition-opacity duration-300 ${
						isLoading || isFetching ? `opacity-0` : ''
					}`}
				>
					<Kalend
						events={calEvents}
						onEventClick={onEventClick}
						language={'en'}
						initialDate={new Date().toISOString()}
						initialView={CalendarView.MONTH}
						disabledViews={[
							CalendarView.DAY,
							CalendarView.AGENDA,
							CalendarView.THREE_DAYS,
							CalendarView.WEEK,
						]}
						weekDayStart={'Monday'}
						isDark={true}
						disabledDragging={true}
					/>
				</div>
			</div>
		</div>
	)
}
