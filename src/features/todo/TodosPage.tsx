import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { removeTodo, getTodos, ITodoItem, setTodos, TodoItemStatus } from './todoSlice';
import { useGetTodosQuery, useRemoveTodoMutation } from '../../services/TodoAPI';
import { CreateTodoItemModal } from './components/CreateTodoItemModal';
import { UpdateTodoItemModal } from './components/UpdateTodoItemModal';
import { Toast } from '../../Toast';
import { ViewTodoItemModal } from './components/ViewTodoItemModal';

export const getTodoItemStatusBadge = (status: TodoItemStatus) => {
    switch (status) {
        case TodoItemStatus.Completed:
            return (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-green-500">
                        <circle r={3} cx={3} cy={3} />
                    </svg>
                    Completed
                </span>)
        case TodoItemStatus.InProgress:
            return (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-yellow-500">
                        <circle r={3} cx={3} cy={3} />
                    </svg>
                    In progress
                </span>
            )
        case TodoItemStatus.NotStarted:
            return (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-red-500">
                        <circle r={3} cx={3} cy={3} />
                    </svg>
                    Not started
                </span>
            )
        default:
            return 'bg-gray-500';
    }
}

export default function Todos() {
    const todos = useAppSelector((state) => getTodos(state));
    const dispatch = useAppDispatch();

    const [showItemModal, setShowItemModal] = React.useState(false);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);

    const [itemToUpdate, setItemToUpdate] = React.useState<ITodoItem | null>(null);
    const [selectedTodoItem, setSelectedTodoItem] = React.useState<ITodoItem | null>(null);

    const { data: apiTodos = [], error, isLoading } = useGetTodosQuery();

    const [removeTodoMutation] = useRemoveTodoMutation();

    // Update the Redux store when the API data changes
    useEffect(() => {
        console.log('useEffect(): API Todos:', apiTodos);

        if (apiTodos.length > 0) {
            dispatch(setTodos(apiTodos));

            // Update the currently selected todo item if it exists in the API data
            if (selectedTodoItem) {
                const updatedItem = apiTodos.find((item) => item.id === selectedTodoItem.id);
                if (updatedItem) {
                    setSelectedTodoItem(updatedItem);
                }
            }
        }
    }, [apiTodos, dispatch]);

    const handleRemoveTodo = async (e: React.MouseEvent, id: number) => {
        // @Note(Victor): Prevent the ViewTodoItemModal from opening
        e.stopPropagation();

        try {
            await removeTodoMutation(id).unwrap();
            dispatch(removeTodo(id));
        } catch (err) {
            console.error('Failed to remove the todo:', err);
        }
    }

    const handleShowUpdateModal = (e: React.MouseEvent, itemToUpdate: ITodoItem) => {
        // @Note(Victor): Prevent the ViewTodoItemModal from opening
        e.stopPropagation();
        setShowUpdateModal(true);
        setItemToUpdate(itemToUpdate);
    }

    const handleShowViewTodoItemModal = (e: React.MouseEvent, item: ITodoItem) => {
        setSelectedTodoItem(item);
        setShowItemModal(true);
    };


    if (error) {
        return <div>Oh no, there was an error</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!apiTodos) {
        return null;
    }

    return (
        <>
            {/* <Toast title={''} message={undefined} show={false} /> */}

            {showItemModal && selectedTodoItem &&
                <ViewTodoItemModal
                    showViewModal={showItemModal}
                    setShowViewModal={setShowItemModal}
                    todoItem={selectedTodoItem}
                />}

            {showCreateModal &&
                <CreateTodoItemModal
                    showCreateModal={showCreateModal}
                    setShowCreateModal={setShowCreateModal}
                />}

            {showUpdateModal && itemToUpdate &&
                <UpdateTodoItemModal
                    showUpdateModal={showUpdateModal}
                    setShowUpdateModal={setShowUpdateModal}
                    todoItem={itemToUpdate}
                />}

            <div className="flex justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-white">Todo Items</h1>
                <button
                    type="button"
                    className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New Item
                </button>
            </div>

            <ul role="list" className="divide-y divide-gray-100 bg-white shadow-xl rounded-lg border border-slate-200">
                {todos.map((item: ITodoItem) => (
                    <li key={item.id}
                        className="relative py-5 hover:bg-gray-100 cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                            handleShowViewTodoItemModal(e, item)
                        }}>
                        <div className="px-2 sm:px-3 lg:px-4">
                            <div className="mx-auto flex max-w-6xl justify-between gap-x-6">
                                <div className="flex min-w-0 gap-x-4"></div>
                                <div className="min-w-0 flex-auto">
                                    <span className="flex justify-content">
                                        <p className="mr-4 flex text-md leading-5 text-gray-500">
                                            {getTodoItemStatusBadge(item.status)}
                                        </p>
                                        <p className="flex text-lg font-semibold leading-6 text-gray-900 truncate ...">
                                            {item.name}
                                        </p>
                                    </span>
                                    <p className="mt-1 flex text-md leading-5 text-gray-500 truncate ...">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex flex-row items-start px-4 space-x-2">
                                    <button
                                        type="button"
                                        className="self-start rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                        onClick={(e: React.MouseEvent) => handleShowUpdateModal(e, item)}
                                    >
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="self-start rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                                        onClick={(e: React.MouseEvent) => handleRemoveTodo(e, item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul >
        </>
    );
}
