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
import { useEffect } from 'react'
import { useRouter } from 'next/router'
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
					name="dueDate"
					render={({ field }) => (
						<DatePicker
							className="w-full"
							selected={field.value}
							onChange={field.onChange}
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

const EditProject = ({ project }: { project?: ProjectInput }) => {
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
		defaultValues: { resources: [] },
	})
	const postMessage = api.project.postMessage.useMutation({
		onSuccess: (data) => {
			reset()
			console.log(data)
			void router.push(`/projects/${data.id}`)
		},
	})
	const onSubmit = (data: ProjectInput) => {
		postMessage.mutate(data)

		// console.log(data)
		// reset()
	}
	console.log(errors)
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
				label="Estimated budget for the shoot"
				value="budget"
				type="radio"
				setValue={setValue}
				options={[
					'R < 50 000 . 00',
					'R 50 - 60 000 . 00',
					'R 60 - 70 000 . 00',
					'R 70 - 80 000 . 00',
					'R 80 - 90 000 . 00',
					'R 90 - 100 000 . 00',
					'R 100 - 110 000 . 00',
					'R 110 - 120 000 . 00',
					'R 120 - 130 000 . 00',
					'R 130 - 140 000 . 00',
					'R 140 - 150 000 . 00',
					'R 150 - 160 000 . 00',
					'R 160 - 170 000 . 00',
					'R 170 - 180 000 . 00',
					'R 180 - 190 000 . 00',
					'R 190 - 200 000 . 00',
					'R > 200 000 . 00',
				]}
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

			{/* ToDo: custom date picker */}

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
				label="Additional Notes"
				value="notes"
				type="textarea"
			/>

			<button type="submit" className="font-bold">
				{project ? `Edit` : `Create`} Project
			</button>
			{postMessage.isLoading && 'loading'}
			{postMessage.error?.message}
		</form>
	)
}
export default EditProject
