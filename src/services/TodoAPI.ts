// Need to use the React-specific entry point to import createApi
import { createApi } from '@reduxjs/toolkit/query/react'
import type { ITodoItem } from '../features/todo/todoSlice'
import { baseQueryWithReauth } from './AuthenticationAPI'

export interface TodoResponse {
    todoItems: ITodoItem[];
}

// Define a service using a base URL and expected endpoints
export const todoAPI = createApi({
    reducerPath: 'todoAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        getTodos: builder.query<TodoResponse, string>({
            query: () => 'todos',
            providesTags: ['Todo']
        }),

        addTodo: builder.mutation<ITodoItem, Partial<ITodoItem>>({
            query: (body) => ({
                url: '/todos',
                method: 'POST',
                body,
            }),
        }),
        updateTodo: builder.mutation<ITodoItem, { id: number, data: Partial<ITodoItem> }>({
            query: ({ id, data }) => ({
                url: `/todos/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        removeTodo: builder.mutation<void, number>({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useRemoveTodoMutation } = todoAPI
