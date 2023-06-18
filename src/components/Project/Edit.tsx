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
import { toast } from 'react-toastify'
import { Listbox, Transition } from '@headlessui/react'
import { type FileRouter } from 'uploadthing/next-legacy'
import { UploadButton, CustomUploadDropzone } from '../common/Upload'

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
		| (Omit<inputType, 'type'> & {
				type: 'listbox'
				control: Control<ProjectInput>
				options: string[]
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
							className="w-full border-[1px] py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-zinc-300 focus:outline-none"
							selected={field.value as Date}
							onChange={field.onChange}
							dateFormat="dd MMMM YYY"
						/>
					)}
				/>
			</div>
		)
	}

	if (props.type === 'listbox') {
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
					defaultValue={0}
					render={({ field }) => (
						<Listbox
							as="div"
							className="space-y-1"
							value={field.value}
							onChange={field.onChange}
						>
							{({ open }) => (
								<>
									<div className="relative">
										<span className="inline-block w-full rounded-md shadow-sm">
											<Listbox.Button className="focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-zinc-700 bg-black py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-zinc-300 focus:outline-none ">
												<span className="block truncate">
													{field.value === null || field.value === -1
														? 'Select a budget range'
														: typeof field.value === 'number'
														? props.options[field.value]
														: undefined}
												</span>
												<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
													<svg
														className="h-5 w-5 text-gray-400"
														viewBox="0 0 20 20"
														fill="none"
														stroke="currentColor"
													>
														<path
															d="M7 7l3-3 3 3m0 6l-3 3-3-3"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</span>
											</Listbox.Button>
										</span>
										<Transition
											show={open}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
											className="absolute z-10 mt-1 w-full rounded-md bg-zinc-900 shadow-lg"
										>
											<Listbox.Options
												static
												className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
											>
												{props.options.map((option, i) => (
													<Listbox.Option
														key={option}
														value={props.value === 'budget' ? i : option}
													>
														{({ selected, active }) => (
															<div
																className={`${
																	active
																		? 'bg-blue-600 text-white'
																		: 'text-white'
																} relative cursor-default select-none py-2 pl-8 pr-4`}
															>
																<span
																	className={`${
																		selected ? 'font-semibold' : 'font-normal'
																	} block truncate`}
																>
																	{option}
																</span>
																{selected && (
																	<span
																		className={`${
																			active ? 'text-white' : 'text-blue-600'
																		} absolute inset-y-0 left-0 flex items-center pl-1.5`}
																	>
																		<svg
																			className="h-5 w-5"
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 20 20"
																			fill="currentColor"
																		>
																			<path
																				fillRule="evenodd"
																				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																				clipRule="evenodd"
																			/>
																		</svg>
																	</span>
																)}
															</div>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</>
							)}
						</Listbox>
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
				<textarea
					rows={4}
					{...props.register(props.value)}
					className="border-[1px] py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-zinc-300 focus:outline-none"
				/>
			) : props.type === 'number' ? (
				<input
					type={props.type}
					min={0}
					defaultValue={0}
					{...props.register(props.value, { valueAsNumber: true })}
					className="border-[1px] py-2 pl-3 pr-10 text-left outline-0 transition duration-150 ease-in-out focus:border-zinc-300 focus:outline-none"
				/>
			) : (
				// fallthrough to this catchall for text
				<input
					type={props.type}
					{...props.register(props.value)}
					className="border-[1px] py-2 pl-3 pr-10 text-left outline-0 transition duration-150 ease-in-out focus:border-zinc-300 focus:outline-none"
				/>
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
			: {
					resources: [],
					scriptFiles: [],
					approved: false,
					locations: '',
					actorsCount: 0,
					extrasCount: 0,
					locationCount: 0,
			  },
	})
	const utils = api.useContext()
	const postProject = api.project.postProject.useMutation({
		onSuccess: (data) => {
			utils.project.getProject.setData({ id: data.id }, () => data)
			toast(
				<>
					<strong>{data.name}</strong> created!
					<br />
					Click <strong>submit for approval</strong> once you have confirmed all
					the shoot details and want to lock the project in!
					<br />
					<p className="text-sm  font-light">
						Note that once the shoot has been approved you cant edit any
						details!
					</p>
				</>,
				{ autoClose: 10000, type: 'success' }
			)
			void router.push(`/projects/${data.id}`)
		},
	})
	const updateProject = api.project.updateProject.useMutation({
		onSuccess: (data) => {
			toast.dismiss()
			utils.project.getProject.setData({ id: data.id }, () => data)
			void router.push(`/projects/${data.id}`)
		},
	})

	const onSubmit = async (data: ProjectInput) => {
		//here
		if (project) {
			updateProject.mutate({ ...data, id: project.id })
		} else {
			postProject.mutate({ ...data })
		}
	}

	// console.log(errors)
	// console.log(watch())

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-9/12 flex-col gap-3 rounded-xl border-2 border-zinc-700 p-3 "
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
				required={true}
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
			{watch().finalisedScript && (
				<div className="flex">
					{watch().scriptFiles.map((file) => (
						<p key={file.url}>{file.name}</p>
					))}
					<div className="w-44">
						<CustomUploadDropzone<FileRouter>
							endpoint="scriptUploader"
							onClientUploadComplete={(res) => {
								console.log(`file:`)
								console.log(res)
								setValue('scriptFiles', [
									//here
									...watch().scriptFiles,
									res.map((uploadedFile) => {
										return {
											name: uploadedFile.fileUrl.split('_')[1],
											url: uploadedFile.fileUrl,
										}
									}),
								])
							}}
							onUploadError={(error: Error) => {
								toast(`Error uploading file: ${error.message}`, {
									autoClose: 3000,
									type: 'error',
								})
							}}
						/>
					</div>
				</div>
			)}
			<Input
				errors={errors}
				register={register}
				label="Estimated budget for the shoot"
				value="budget"
				type="listbox"
				setValue={setValue}
				options={budgetOptions}
				control={control}
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
			{watch().resources.find((value) => value === 'Actors') && (
				<Input
					errors={errors}
					register={register}
					label="How many actors?"
					value="actorsCount"
					type="number"
					required
				/>
			)}
			{watch().resources.find((value) => value === 'Extras') && (
				<Input
					errors={errors}
					register={register}
					label="How many extras?"
					value="extrasCount"
					type="number"
					required
				/>
			)}
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
			{watch().locations.length > 0 && (
				<Input
					errors={errors}
					register={register}
					label="Estimated number of locations"
					type="number"
					value="locationCount"
				/>
			)}

			<Input
				errors={errors}
				register={register}
				type="date"
				label={
					project?.approved ? 'Shoot start date' : 'Proposed shoot start date'
				}
				value="shootStart"
				control={control}
			/>

			<Input
				errors={errors}
				register={register}
				type="date"
				label={
					project?.approved ? 'Shoot start date' : 'Proposed shoot end date'
				}
				value="shootEnd"
				control={control}
			/>

			<Input
				errors={errors}
				register={register}
				type="date"
				label="Fist draft due date"
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

			{!(postProject.isLoading || updateProject.isLoading) ? (
				<div className="flex justify-center">
					<button
						type="submit"
						className="w-max rounded-md border bg-slate-800 px-2 font-bold transition-colors hover:bg-slate-700"
					>
						{project ? ` Update` : `Create`} Project
					</button>
				</div>
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
