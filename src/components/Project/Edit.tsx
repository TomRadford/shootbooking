import { api } from '~/utils/api'
import {
	type FieldErrors,
	useForm,
	type UseFormRegister,
	Controller,
	type UseFormSetValue,
	type Control,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { projectInputSchema } from '~/inputSchema'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { CircleLoader } from '../common/LoadingSpinners'
import { budgetOptions } from '~/utils/common'
import { type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '~/server/api/root'

type RouterOutput = inferRouterOutputs<AppRouter>

type Project = RouterOutput['project']['getAll'][0]

type ProjectInput = z.infer<typeof projectInputSchema>

type inputType = {
	errors: FieldErrors<ProjectInput>
	register: UseFormRegister<ProjectInput>
	setValue?: UseFormSetValue<ProjectInput>
	label: string
	value: keyof ProjectInput
	type: 'text' | 'number' | 'textarea'
	required?: boolean
}

// const InputBox = (
// 	props: Omit<inputType, 'type'> & {
// 		type: 'radio' | 'multiSelect' | 'text' | 'number' | 'date'
// 		id?: string
// 	}
// ) => (
// 	<div>
// 		<label>
// 			{props.label}
// 			{props.required && <span className="text-red-500">*</span>}{' '}
// 		</label>
// 		<input
// 			id={props.id ? props.id : undefined}
// 			type={props.type}
// 			{...props.register(props.value)}
// 		/>
// 	</div>
// )

const Input = (
	props:
		| inputType
		| (Omit<inputType, 'type'> & {
				type: 'radio' | 'checkbox' | 'yesNo'
				options?: string[]
		  })
		| (Omit<inputType, 'type'> & {
				type: 'date'
				control: Control<ProjectInput>
		  })
) => {
	if (props.type === 'yesNo') {
		return (
			<fieldset>
				<legend>
					{props.label}
					{props.required && <span className="text-red-500">*</span>}{' '}
					<span className="text-sm text-orange-500">
						{props.errors[props.value]?.message}
					</span>
				</legend>

				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						{...props.register(props.value)}
						name={props.value}
					/>
				</div>
			</fieldset>
		)
	}
	if (props.type === 'date') {
		return (
			<div className="flex flex-col">
				<label>
					{props.label}
					{props.required && <span className="text-red-500">*</span>}{' '}
					<span className="text-sm text-orange-500">
						{props.errors[props.value]?.message}
					</span>
				</label>
				<Controller
					control={props.control}
					name={props.value}
					render={({ field }) => (
						<DatePicker
							className="w-full"
							selected={field.value as Date}
							onChange={field.onChange}
							dateFormat="dd MMMM YYY"
						/>
					)}
				/>
			</div>
		)
	}

	if (props.type === 'checkbox' || props.type === 'radio') {
		return (
			<fieldset>
				<legend>
					{props.label}
					{props.required && <span className="text-red-500">*</span>}{' '}
					<span className="text-sm text-orange-500">
						{props.errors[props.value]?.message}
					</span>
				</legend>
				{props.options?.map((option, i) => (
					<div key={i} className="flex items-center gap-2">
						<input
							type={props.type}
							{...props.register(props.value)}
							value={props.value === 'budget' ? i : option}
							id={option}
							name={props.value}
						/>
						<label htmlFor={option}>{option}</label>
					</div>
				))}
			</fieldset>
		)
	}

	return (
		<div className="flex flex-col">
			<label>
				{props.label}
				{props.required && <span className="text-red-500">*</span>}{' '}
				<span className="text-sm text-orange-500">
					{props.errors[props.value]?.message}
				</span>
			</label>
			{props.type === 'textarea' ? (
				<textarea rows={4} {...props.register(props.value)} />
			) : (
				// fallthrough to this catchall for text/date
				<input type={props.type} {...props.register(props.value)} />
			)}
		</div>
	)
}

const EditProject = ({ project }: { project?: Project }) => {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors },
		setValue,
	} = useForm<ProjectInput>({
		resolver: zodResolver(projectInputSchema),
		defaultValues: project
			? (project as unknown as ProjectInput)
			: { resources: [], scriptUrl: [], approved: false },
	})
	const utils = api.useContext()
	const postProject = api.project.postProject.useMutation({
		onSuccess: (data) => {
			utils.project.getProject.setData({ id: data.id }, () => data)
			void router.push(`/projects/${data.id}`)
		},
	})
	const updateProject = api.project.updateProject.useMutation({
		onSuccess: (data) => {
			utils.project.getProject.setData({ id: data.id }, () => data)
			void router.push(`/projects/${data.id}`)
		},
	})

	const onSubmit = (data: ProjectInput) => {
		if (project) {
			updateProject.mutate({ ...data, id: project.id })
		} else {
			postProject.mutate(data)
		}
	}
	console.log(errors)
	console.log(watch())

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-9/12 flex-col gap-3 rounded-xl border-2 border-zinc-700 p-3"
		>
			<Input
				errors={errors}
				register={register}
				label="Project Name"
				value="name"
				type="text"
				required={true}
			/>
			<Input
				errors={errors}
				register={register}
				label="Client Name"
				value="client"
				type="text"
				required={true}
			/>
			<Input
				errors={errors}
				register={register}
				label="Job number"
				value="jobNumber"
				type="text"
			/>
			<Input
				errors={errors}
				register={register}
				label="Shoot type"
				value="shootType"
				type="radio"
				options={['Studio', 'Narrative', 'Documentary']}
				required={true}
			/>
			<Input
				errors={errors}
				register={register}
				label="Project Head"
				value="head"
				type="text"
				required={false}
			/>
			<Input
				errors={errors}
				register={register}
				label="Does this shoot have a finalised concept?"
				value="finalisedConcept"
				type="yesNo"
			/>
			{watch().finalisedConcept && (
				<Input
					errors={errors}
					register={register}
					label="Shoot concept"
					value="concept"
					type="textarea"
					required={false}
				/>
			)}
			<Input
				errors={errors}
				register={register}
				label="Does this shoot have a finalised script?"
				value="finalisedScript"
				type="yesNo"
			/>
			{/* {watch().finalisedScript && <p>Script upload goes here</p>} */}
			<Input
				errors={errors}
				register={register}
				label="Estimated budget for the shoot"
				value="budget"
				type="radio"
				setValue={setValue}
				options={budgetOptions}
				required={true}
			/>

			<Input
				errors={errors}
				register={register}
				label="Any foreseen resources?"
				value="resources"
				type="checkbox"
				options={[
					'Actors',
					'Extras',
					'Dialogue',
					'Voice Over',
					'Visual Effects',
					'Practical Effects',
					'Fixer',
					'Translator',
					'Driver',
				]}
			/>
			<Input
				errors={errors}
				register={register}
				label="Where would the shoot be based?"
				value="shootBase"
				type="radio"
				required
				options={['Local', 'National', 'International']}
			/>

			<Input
				errors={errors}
				register={register}
				label="Locations"
				value="locations"
				type="textarea"
			/>

			<Input
				errors={errors}
				register={register}
				type="date"
				label="Due date/Deadline"
				value="dueDate"
				control={control}
			/>

			<Input
				errors={errors}
				register={register}
				type="date"
				label="Shoot start date"
				value="shootStart"
				control={control}
			/>

			<Input
				errors={errors}
				register={register}
				type="date"
				label="Shoot end date"
				value="shootEnd"
				control={control}
			/>

			<Input
				errors={errors}
				register={register}
				label="Additional Notes"
				value="notes"
				type="textarea"
			/>
			{!(postProject.isLoading || updateProject.isLoading) ? (
				<button type="submit" className="font-bold">
					{project ? `Edit` : `Create`} Project
				</button>
			) : (
				<div className="mx-auto">
					<CircleLoader size="50" />
				</div>
			)}
			{postProject.error?.message}
			{updateProject.error?.message}
		</form>
	)
}
export default EditProject
