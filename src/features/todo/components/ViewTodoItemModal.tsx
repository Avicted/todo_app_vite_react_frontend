import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { ITodoItem } from "../../todo/todoSlice"
import { getTodoItemStatusBadge } from "../TodosPage"

interface ViewTodoItemModalProps {
    showViewModal: boolean,
    setShowViewModal: (show: boolean) => void,
    todoItem: ITodoItem,
}

export const ViewTodoItemModal = (props: ViewTodoItemModalProps) => {
    const { showViewModal, setShowViewModal, todoItem } = props

    return (
        <>
            {showViewModal && (
                <Dialog
                    open={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    className="relative z-10">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    />

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col grow">
                                            <span className="flex">
                                                <DialogTitle as="h3" className="flex text-base font-semibold leading-6 text-gray-900">
                                                    {todoItem.title}
                                                    <p className="ml-6 flex text-md text-gray-500">
                                                        {getTodoItemStatusBadge(todoItem.status)}
                                                    </p>
                                                </DialogTitle>
                                            </span>
                                            <div className="mt-2">
                                                <p className="text-md text-gray-500">
                                                    {todoItem.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowViewModal(false)
                                            }}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    )
}
