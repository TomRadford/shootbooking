import { Dialog, Transition } from '@headlessui/react'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Fragment } from 'react'

const Modal = NiceModal.create(
	({
		title,
		message,
		clickMessage,
		action,
	}: {
		title: string | React.ReactElement
		message: string | React.ReactElement
		clickMessage: string
		action: () => Promise<void>
	}) => {
		const modal = useModal()
		const onClick = async () => {
			void modal.hide()
			await action()
		}
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
											as="h3"
											className="text-lg font-medium leading-6 text-white"
										>
											{title}
										</Dialog.Title>
										<div>{message}</div>
										<div className="mt-2 flex justify-center gap-2">
											<button
												className="border-stone-600py-1 rounded-md border px-1 transition-colors  hover:bg-neutral-800"
												onClick={onClick}
											>
												{clickMessage}
											</button>
											<button
												className="border-stone-600py-1 rounded-md border px-1 transition-colors  hover:bg-neutral-800"
												onClick={() => modal.hide()}
											>
												Cancel
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

export default Modal
