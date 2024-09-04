import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { removeTodo, getTodos, ITodoItem, setTodos } from './todoSlice';
import { useGetTodosQuery, useRemoveTodoMutation } from '../../services/TodoAPI';
import { CreateTodoItemModal } from '../components/CreateTodoItemModal';
import { UpdateTodoItemModal } from '../components/UpdateTodoItemModal';

export default function Todos() {
    const todos = useAppSelector((state) => getTodos(state));
    const dispatch = useAppDispatch();

    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showUpdateModal, setShowUpdateModal] = React.useState(false);
    const [itemToUpdate, setItemToUpdate] = React.useState<ITodoItem | null>(null);

    const { data: apiTodos = [], error, isLoading } = useGetTodosQuery();

    const [removeTodoMutation] = useRemoveTodoMutation();

    // Update the Redux store when the API data changes
    useEffect(() => {
        if (apiTodos.length > 0) {
            dispatch(setTodos(apiTodos));
        }
    }, [apiTodos, dispatch]);

    const handleRemoveTodo = async (id: number) => {
        try {
            await removeTodoMutation(id).unwrap();
            dispatch(removeTodo(id));
        } catch (err) {
            console.error('Failed to remove the todo:', err);
        }
    }

    const handleShowUpdateModal = (itemToUpdate: ITodoItem) => {
        setShowUpdateModal(true);
        setItemToUpdate(itemToUpdate);
    }


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
                <h1 className="text-3xl font-semibold text-gray-600">Todo Items</h1>
                <button
                    type="button"
                    className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New Item
                </button>
            </div>

            <ul role="list" className="divide-y divide-gray-100 bg-white">
                {todos.map((item: ITodoItem) => (
                    <li key={item.id} className="relative py-5 hover:bg-gray-100">
                        <div className="px-2 sm:px-3 lg:px-4">
                            <div className="mx-auto flex max-w-6xl justify-between gap-x-6">
                                <div className="flex min-w-0 gap-x-4"></div>
                                <div className="min-w-0 flex-auto">
                                    <p className="flex text-lg font-semibold leading-6 text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="mt-1 flex text-md leading-5 text-gray-500">
                                        {item.status}
                                    </p>
                                    <p className="mt-1 flex text-md leading-5 text-gray-500 truncate">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex flex-row items-start px-4 space-x-2">
                                    <button
                                        type="button"
                                        className="self-start rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                                        onClick={() => handleShowUpdateModal(item)}
                                    >
                                        Update
                                    </button>

                                    <button
                                        type="button"
                                        className="self-start rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                                        onClick={() => handleRemoveTodo(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
