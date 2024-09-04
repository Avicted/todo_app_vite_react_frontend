import { configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import todoSlice from './features/todo/todoSlice'
import { todoAPI } from './services/TodoAPI'
import { setupListeners } from '@reduxjs/toolkit/query'
import { Toast } from './Toast'


/**
 * Log a warning and error message when an RTK Query action is rejected.
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!')
      console.error(action.error)
      console.error('action', action)
      console.error('action.error', action.error)
      console.error('action.error.message', action.error.message)

      /* {Toast({ title: 'Async error!', message: 'data' in action.error ? (action.error.data as { message: string }).message : action.error.message, show: true })} */

      /*toast.warn({
        title: 'Async error!',
        message:
          'data' in action.error
            ? (action.error.data as { message: string }).message
            : action.error.message,
      })*/
    }

    return next(action)
  }

export const store = configureStore({
  reducer: {
    todoAPI: todoAPI.reducer,
    todos: todoSlice,
    // posts: postsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
    .concat(todoAPI.middleware)
    .concat(rtkQueryErrorLogger),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

