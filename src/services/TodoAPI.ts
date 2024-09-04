// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ITodoItem } from '../features/todo/todoSlice'

// Define a service using a base URL and expected endpoints
export const todoAPI = createApi({
  reducerPath: 'todoAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5247/api/TodoItems/' }),
  endpoints: (builder) => ({
        getTodos: builder.query<ITodoItem[], void>({
            query: () => '',
        }),
        addTodo: builder.mutation<ITodoItem, Partial<ITodoItem>>({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
        updateTodo: builder.mutation<ITodoItem, { id: number, data: Partial<ITodoItem> }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        removeTodo: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
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