import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export enum TodoItemStatus {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
}

export interface ITodoItem {
    id: number;
    title: string;
    description?: string;
    status: TodoItemStatus;
}

export interface ICreateTodoItem {
    title: string;
    description?: string;
    status: TodoItemStatus;
}

export interface IUpdateTodoItem extends ICreateTodoItem { }


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
    initialState, // `createSlice` will infer the state type from the `initialState` argument
    reducers: {
        setTodos: (state, action: PayloadAction<ITodoItem[]>) => {
            state.items = action.payload
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        addTodo: (state, action: PayloadAction<ITodoItem>) => {
            state.items.push(action.payload)
        },
        updateTodo: (state, action: PayloadAction<ITodoItem>) => {
            const { id, title: name, description, status } = action.payload
            const existingTodo = state.items.find((todo) => todo.id === id)
            if (existingTodo) {
                existingTodo.title = name
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

// Redux Toolkit Sagas for Todo Items

