import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch, useAuth } from '../../hooks';
import { removeTodo, getTodos, ITodoItem, setTodos, TodoItemStatus } from './todoSlice';
import { useGetTodosQuery, useRemoveTodoMutation } from '../../services/TodoAPI';
import { CreateTodoItemModal } from './components/CreateTodoItemModal';
import { UpdateTodoItemModal } from './components/UpdateTodoItemModal';
import { ViewTodoItemModal } from './components/ViewTodoItemModal';
import { useNavigate } from 'react-router-dom';

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
    const user = useAppSelector((state) => state.authentication.user);
    const todos = useAppSelector((state) => getTodos(state));
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const navigate = useNavigate();

    const [showItemModal, setShowItemModal] = React.useState(false);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);

    const [itemToUpdate, setItemToUpdate] = React.useState<ITodoItem | null>(null);
    const [selectedTodoItem, setSelectedTodoItem] = React.useState<ITodoItem | null>(null);

    // Conditional query based on user ID
    const { data: apiResponse, error, isLoading } = useGetTodosQuery(user?.id || '');

    const [removeTodoMutation] = useRemoveTodoMutation();

    // Run the effect when the user is not authenticated
    useEffect(() => {
        if (!auth.user) {
            navigate('/');
        }
    }, [auth]);

    // Log errors and loading state
    useEffect(() => {
        if (isLoading) {
            console.log('Loading todos...');
        }

        if (error) {
            console.error('API Error:', error);
        }
    }, [isLoading, error]);

    // Update the Redux store when the API data changes
    useEffect(() => {
        if (apiResponse?.todoItems) {
            console.log('useEffect(): API Todos:', apiResponse.todoItems);

            dispatch(setTodos(apiResponse.todoItems)); // Adjust to handle the correct property

            // Update the currently selected todo item if it exists in the API data
            if (selectedTodoItem) {
                const updatedItem = apiResponse.todoItems.find((item) => item.id === selectedTodoItem.id);
                if (updatedItem) {
                    setSelectedTodoItem(updatedItem);
                }
            }
        }
    }, [apiResponse, dispatch, selectedTodoItem]);

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

    const handleShowViewTodoItemModal = (_e: React.MouseEvent, item: ITodoItem) => {
        setSelectedTodoItem(item);
        setShowItemModal(true);
    };

    if (isLoading) {
        return <div className="text-center text-gray-500 py-8">
            <p>Loading your todo items...</p>
        </div>
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                <div className="mx-auto max-w-4xl">
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
                        <h1 className="text-3xl font-extrabold text-gray-900">Todo Items</h1>
                        <button
                            id="create-todo-item-button"
                            type="button"
                            className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create New Item
                        </button>
                    </div>

                    {/* If the user has no todo items, display a message */}
                    {todos.length === 0 && (<div
                        className="relative block w-full min-h-full rounded-lg border-2 border-dashed border-gray-900 p-12 text-center focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                            className="mx-auto h-12 w-12 text-gray-900"
                        >
                            <path
                                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="mt-2 block text-sm font-semibold text-gray-900">Create new Todo Items</span>
                    </div>)}

                    <ul role="list" className="divide-y divide-gray-100 bg-white shadow-xl rounded-lg">
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
                                                <p className="mr-4 flex text-md leading-5 text-gray-500" style={{ minWidth: '110px' }}>
                                                    {getTodoItemStatusBadge(item.status)}
                                                </p>
                                                <p className="flex text-lg font-semibold leading-6 text-gray-900 truncate ...">
                                                    {item.title}
                                                </p>
                                            </span>
                                            <p className="mt-1 flex text-md leading-5 text-gray-500 truncate ...">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-row items-start px-4 space-x-2">
                                            <button
                                                type="button"
                                                name="update"
                                                className="self-start rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                                                onClick={(e: React.MouseEvent) => handleShowUpdateModal(e, item)}
                                            >
                                                Update
                                            </button>

                                            <button
                                                type="button"
                                                name="remove"
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
                    </ul>
                </div>
            </div>
        </>
    );
}
