import { Dialog, Transition } from '@headlessui/react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Fragment } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useProjectsStore } from '~/utils/store/projects'

const ProjectModal = NiceModal.create(
	({ projectId }: { projectId: string }) => {
		const modal = useModal()
		const router = useRouter()
		const { data: sessionData } = useSession()
		const projects = useProjectsStore((state) => state.projects)
		const project = projects.find((proj) => proj.id === projectId)
		const onClick = async () => {
			void router.push(`/projects/${projectId}`)
			await modal.hide()
		}

		if (!project) return <></>

		return (
			<>
				<Transition appear show={modal.visible} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-10"
						onClose={() => modal.hide()}
					>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-black bg-opacity-50" />
						</Transition.Child>

						<div className="fixed inset-0 overflow-y-auto">
							<div className="flex min-h-full items-center justify-center p-4 text-center">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95"
								>
									<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black px-10 py-5 text-left align-middle text-white shadow-xl transition-all">
										<Dialog.Title
											as="div"
											className="text-lg leading-6 text-white"
										>
											<span className="font-bold">{project.name}</span>
											<div className="mb-2 flex justify-between font-light">
												<p>for {project.client}</p>
												<p>Head: {project.head}</p>
											</div>
										</Dialog.Title>
										<div>
											<ul>
												<li className="flex justify-between">
													<p>Status:</p>
													<p className="font-bold">
														{project.approved ? 'Active' : 'Pipeline'}
													</p>
												</li>
												{project.shootType && (
													<li className="flex justify-between">
														<p>Type:</p>
														<p className="font-bold">{project.shootType}</p>
													</li>
												)}
												{project.shootBase && (
													<li className="flex justify-between">
														<p>Base:</p>
														<p className="font-bold">{project.shootBase}</p>
													</li>
												)}
												<li className="flex justify-between">
													<p>First Draft:</p>
													<p className="text-right font-bold">
														{project.dueDate?.toLocaleDateString('en-GB', {
															day: 'numeric',
															month: 'long',
															year: 'numeric',
														})}
													</p>
												</li>
												{project.shootStart && (
													<li className="flex justify-between">
														<p>Shoot Start:</p>
														<p className="font-bold">
															{project.shootStart?.toLocaleDateString('en-GB', {
																day: 'numeric',
																month: 'long',
																year: 'numeric',
															})}
														</p>
													</li>
												)}
												{project.shootEnd && (
													<li className="flex justify-between">
														<p>Shoot End:</p>
														<p className="font-bold">
															{project.shootEnd?.toLocaleDateString('en-GB', {
																day: 'numeric',
																month: 'long',
																year: 'numeric',
															})}
														</p>
													</li>
												)}
											</ul>
										</div>
										<div className="mt-2 flex justify-center gap-2">
											{sessionData?.user.admin ||
											project.userId === sessionData?.user.id ? (
												<button
													className="border-stone-600py-1 rounded-md border px-1 transition-colors  hover:bg-neutral-800"
													onClick={onClick}
												>
													Details
												</button>
											) : null}
											<button
												className="border-stone-600py-1 rounded-md border px-1 transition-colors  hover:bg-neutral-800"
												onClick={() => modal.hide()}
											>
												Close
											</button>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</>
		)
	}
)

export default ProjectModal
