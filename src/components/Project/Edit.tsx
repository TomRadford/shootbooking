import { api } from '~/utils/api'
import {
	type FieldErrors,
	useForm,
	type UseFormRegister,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { projectSchema } from '~/schema'

type Project = z.infer<typeof projectSchema>

const Input = ({
	errors,
	register,
	label,
	value,
	type,
}: {
	errors: FieldErrors<Project>
	register: UseFormRegister<Project>
	label: string
	value: keyof Project
	type: 'text' | 'number' | 'multiselect' | 'radio' | 'date'
}) => {
	return (
		<>
			<label>
				{label}
				<span className="text-red-500">*</span> {errors[value]?.message}
			</label>
			<input type={type} {...register(value)} />
		</>
	)
}

const EditProject = ({ project }: { project?: Project }) => {
	const postMessage = api.project.postMessage.useMutation()
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Project>({
		resolver: zodResolver(projectSchema),
	})

	const onSubmit = (data: Project) => {
		// postMessage.mutate(data)
		console.log(data)
	}

	console.log(errors)

	return (
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
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
			/>
			<Input
				errors={errors}
				register={register}
				label="Project Head"
				value="head"
				type="text"
			/>
			<button type="submit" className="font-bold">
				{project ? `Edit` : `Create`} Project
			</button>
		</form>
	)
}
export default EditProject
