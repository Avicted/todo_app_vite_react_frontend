import { configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import todoSlice from './features/todo/todoSlice'
import { todoAPI } from './services/TodoAPI'
import { setupListeners } from '@reduxjs/toolkit/query'
import authenticationSlice from './features/authentication/authenticationSlice'
import { authenticationAPI } from './services/AuthenticationAPI'
import { usersAPI } from './services/UsersAPI'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage


/**
 * Log a warning and error message when an RTK Query action is rejected.
 */
export const rtkQueryErrorLogger: Middleware =
  (_api: MiddlewareAPI) => (next) => (action) => {
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

// Persist config for the authentication slice
const persistConfig = {
  key: 'auth', // key for storing in localStorage
  storage, // localStorage (you can replace this with sessionStorage if needed)
  whitelist: [
    'authentication', // only persist the authentication slice
    'user', // only persist the user slice
  ], // Only persist authentication slice
};

// Wrap the authentication slice with the persisted reducer
const persistedAuthenticationReducer = persistReducer(persistConfig, authenticationSlice);

export const store = configureStore({
  reducer: {
    todoAPI: todoAPI.reducer,
    todos: todoSlice,

    usersAPI: usersAPI.reducer,
    
    authenticationAPI: authenticationAPI.reducer,
    authentication: persistedAuthenticationReducer, // Use persisted reducer
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore these actions
          ignoredPaths: ['authentication', 'user'], // Ignore non-serializable paths if necessary
        },
    })
    .concat(todoAPI.middleware)
    .concat(authenticationAPI.middleware)
    .concat(usersAPI.middleware)
    .concat(rtkQueryErrorLogger),
})

// @Note(Victor): This is a workaround to clear the localStorage when the user logs out
store.subscribe(() => {
    const state = store.getState();
    if (state.authentication.user === null) {
        storage.removeItem('persist:root');
    }
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)


// Set up redux-persist's persistor
export const persistor = persistStore(store);


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

