import { type EndpointHandler } from 'next-auth/providers'
import { useCallback, useState } from 'react'
import { useDropzone, type FileWithPath } from 'react-dropzone'
import {
	type DANGEROUS__uploadFiles,
	classNames,
	generateClientDropzoneAccept,
	generateMimeTypes,
} from 'uploadthing/client'
import { type FileRouter } from 'uploadthing/next-legacy'
import { type ExpandedRouteConfig } from 'uploadthing/server'
import { useUploadThing } from '~/utils/hooks/uploadthing'

const generatePermittedFileTypes = (config?: ExpandedRouteConfig) => {
	const fileTypes = config ? Object.keys(config) : []

	const maxFileCount = config
		? Object.values(config).map((v) => v.maxFileCount)
		: []

	return { fileTypes, multiple: maxFileCount.some((v) => v && v > 1) }
}

const capitalizeStart = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

const INTERNAL_doFormatting = (config?: ExpandedRouteConfig): string => {
	if (!config) return ''

	const allowedTypes = Object.keys(config) as (keyof ExpandedRouteConfig)[]

	const formattedTypes = allowedTypes.map((f) => (f === 'blob' ? 'file' : f))

	// Format multi-type uploader label as "Supports videos, images and files";
	if (formattedTypes.length > 1) {
		const lastType = formattedTypes.pop()
		return `${formattedTypes.join('s, ')} and ${lastType}s`
	}

	// Single type uploader label
	const key = allowedTypes[0]
	const formattedKey = formattedTypes[0]

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { maxFileSize, maxFileCount } = config[key]!

	if (maxFileCount && maxFileCount > 1) {
		return `${formattedKey}s up to ${maxFileSize}, max ${maxFileCount}`
	} else {
		return `${formattedKey} (${maxFileSize})`
	}
}

const allowedContentTextLabelGenerator = (
	config?: ExpandedRouteConfig
): string => {
	return capitalizeStart(INTERNAL_doFormatting(config))
}

const Spinner = () => {
	return (
		<svg
			className="ut-h-5 ut-w-5 ut-text-white animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 576 512"
		>
			<path
				fill="currentColor"
				d="M256 32C256 14.33 270.3 0 288 0C429.4 0 544 114.6 544 256C544 302.6 531.5 346.4 509.7 384C500.9 399.3 481.3 404.6 465.1 395.7C450.7 386.9 445.5 367.3 454.3 351.1C470.6 323.8 480 291 480 255.1C480 149.1 394 63.1 288 63.1C270.3 63.1 256 49.67 256 31.1V32z"
			/>
		</svg>
	)
}

type EndpointHelper<TRouter extends void | FileRouter> = void extends TRouter
	? 'YOU FORGOT TO PASS THE GENERIC'
	: keyof TRouter

export const CustomUploadDropzone = <
	TRouter extends void | FileRouter = void
>(props: {
	endpoint: EndpointHelper<TRouter>
	onClientUploadComplete?: (
		res?: Awaited<ReturnType<typeof DANGEROUS__uploadFiles>>
	) => void
	onUploadError?: (error: Error) => void
}) => {
	const [files, setFiles] = useState<File[]>([])
	const { startUpload, isUploading, permittedFileInfo } =
		useUploadThing<string>({
			endpoint: props.endpoint as string,
			onClientUploadComplete: (e) => {
				setFiles([])
				if (props.onClientUploadComplete) {
					return props.onClientUploadComplete(e)
				}
			},
			onUploadError: props.onUploadError,
		})
	const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
		setFiles(acceptedFiles)
	}, [])

	const { fileTypes } = generatePermittedFileTypes(permittedFileInfo?.config)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
	})

	return (
		<div
			className={classNames(
				'flex h-36 w-36 justify-center rounded-md bg-zinc-800 p-4 shadow-slate-400',
				isDragActive ? ' shadow-lg' : ''
			)}
		>
			<div
				className={'flex flex-col justify-center text-center'}
				{...getRootProps()}
			>
				{/* <svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					className={classNames(
						'ut-mx-auto ut-h-12 ut-w-12 ut-text-gray-400 transition-all duration-300',
						isDragActive ? ' stroke-gray-300' : ''
					)}
				>
					<path
						fill="currentColor"
						fillRule="evenodd"
						d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
						clipRule="evenodd"
					></path>
				</svg> */}
				{isUploading ? (
					<div className="h-10 w-10">
						<Spinner />
					</div>
				) : (
					<div className="">
						<label
							htmlFor="file-upload"
							className="focus-within:ut-ring-2 focus-within:ut-ring-blue-600 focus-within:ut-ring-offset-2 hover:ut-text-blue-500"
						>
							{`Drop new files here`}
							<input className="ut-sr-only" {...getInputProps()} />
						</label>
					</div>
				)}
				<div className="ut-h-[1.25rem]">
					<p className="ut-text-xs ut-leading-5 ut-text-gray-600">
						{/* {allowedContentTextLabelGenerator(permittedFileInfo?.config)} */}
					</p>
				</div>
				{files.length > 0 && !isUploading && (
					<div>
						<button
							className="mt-1 w-max rounded-md border bg-slate-800 px-2 font-bold transition-colors hover:bg-slate-700"
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								if (!files) return

								void startUpload(files)
							}}
						>
							<span className="">
								Upload {files.length} file{files.length === 1 ? '' : 's'}
							</span>
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
