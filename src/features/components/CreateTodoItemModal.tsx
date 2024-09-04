import React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { addTodo, ICreateTodoItem, TodoItemStatus } from "../todo/todoSlice"
import { useAppDispatch } from "../../hooks";
import { useAddTodoMutation } from "../../services/TodoAPI";


interface CreateTodoItemModalProps {
    showCreateModal: boolean,
    setShowCreateModal: (show: boolean) => void,
}

export const CreateTodoItemModal = (props: CreateTodoItemModalProps) => {
    const { showCreateModal, setShowCreateModal, } = props
    const dispatch = useAppDispatch();

    const [newTodoName, setNewTodoName] = React.useState('');
    const [newTodoDescription, setNewTodoDescription] = React.useState('');
    const [newTodoStatus, setNewTodoStatus] = React.useState(TodoItemStatus.NotStarted);

    const [addTodoMutation] = useAddTodoMutation();

    const handleCreateTodo = async () => {
        console.log('Creating todo:', newTodoName, newTodoDescription, newTodoStatus);

        const newTodo: ICreateTodoItem = {
            name: newTodoName,
            description: newTodoDescription,
            status: newTodoStatus,
        };

        try {
            const createdTodo = await addTodoMutation(newTodo).unwrap();
            dispatch(addTodo(createdTodo));
            setShowCreateModal(false);
            setNewTodoName('');
            setNewTodoDescription('');
            setNewTodoStatus(TodoItemStatus.NotStarted);
        } catch (err) {
            console.error('Failed to create the todo:', err);
        }
    };

    return (
        <>
            {showCreateModal && (
                <Dialog open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
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
                                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Create New Todo Item
                                            </DialogTitle>
                                            <form className="mt-2">
                                                <div className="mb-4">
                                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={newTodoName}
                                                        onChange={(e) => setNewTodoName(e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        rows={4}
                                                        value={newTodoDescription}
                                                        onChange={(e) => setNewTodoDescription(e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                                                        Status
                                                    </label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        value={newTodoStatus}
                                                        onChange={(e) => setNewTodoStatus(Number(e.target.value))}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        <option value={TodoItemStatus.NotStarted}>Not Started</option>
                                                        <option value={TodoItemStatus.InProgress}>In Progress</option>
                                                        <option value={TodoItemStatus.Completed}>Completed</option>
                                                    </select>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        onClick={handleCreateTodo}
                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    )
}