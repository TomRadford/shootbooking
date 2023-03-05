import { type inferRouterOutputs } from '@trpc/server'
import Kalend, {
	type CalendarEvent,
	CalendarView,
	type OnEventClickData,
} from 'kalend'
import { type AppRouter } from '~/server/api/root'
import 'kalend/dist/styles/index.css' // import styles
import { api } from '~/utils/api'
import { useEffect, useState } from 'react'
import { CALENDAR_EVENT_TYPE } from 'kalend/common/enums'
import useHasMounted from '~/utils/hooks/mounted'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

// data fetching done in ProjectsCalendar to be able allow for lazy loading
export const ProjectsCalendar = () => {
	const {
		data: projectsData,
		isLoading,
		isRefetching,
		isFetching,
		isError,
		error,
	} = api.project.getAll.useQuery({})
	const router = useRouter()
	const { data: sessionData } = useSession()
	const onEventClick = (eventData: OnEventClickData) => {
		console.log(eventData.id)
		if (sessionData?.user.admin) {
			void router.push(`/projects/${eventData.id as string}`)
		}
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
					.map((project) => ({
						id: `${project.id}`,
						startAt: project.shootStart.toISOString(),
						endAt: project.shootEnd.toISOString(),
						summary: `${project.approved ? 'Active' : 'Pipeline'} Shoot: ${
							project.name
						} | ${project.client}`,
						color: project.approved ? '#5fda6e' : '#d59d5a',
					})),
				...projectsData
					.filter((project) => project.dueDate)
					.map((project) => ({
						id: `${project.id}`,
						startAt: project.dueDate.toISOString(),
						endAt: project.dueDate.toISOString(),
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
