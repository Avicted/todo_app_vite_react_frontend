import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export enum TodoItemStatus {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
}

export interface ITodoItem {
    id: number;
    name: string;
    description?: string;
    status: TodoItemStatus;
}

// Same as `ITodoItem`, but without the `id` field
export interface ICreateTodoItem {
    name: string;
    description?: string;
    status: TodoItemStatus;
}

// Define a type for the slice state
interface TodoState {
    items: ITodoItem[]
}

// Define the initial state using that type
const initialState: TodoState = {
    items: [],
}

export const todoSlice = createSlice({
    name: 'todo',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setTodos: (state, action: PayloadAction<ITodoItem[]>) => {
            state.items = action.payload
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        addTodo: (state, action: PayloadAction<ITodoItem>) => {
            state.items.push(action.payload)
        },
        updateTodo: (state, action: PayloadAction<ITodoItem>) => {
            const { id, name, description, status } = action.payload
            const existingTodo = state.items.find((todo) => todo.id === id)
            if (existingTodo) {
                existingTodo.name = name
                existingTodo.description = description
                existingTodo.status = status
            }
        },
        removeTodo: (state, action: PayloadAction<number>) => {
            const id = action.payload

            // Remove the todo with the given id
            state.items = state.items.filter((todo) => todo.id !== id)
        },
    },
})

export const { setTodos, addTodo, removeTodo, updateTodo } = todoSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getTodos = (state: RootState) => state.todos.items

export default todoSlice.reducer