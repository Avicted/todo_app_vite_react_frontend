import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useMemo } from 'react';
import { selectCurrentUser } from './features/authentication/authenticationSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


export const useAuth = () => {
    // Access the current user from the Redux store
    const user = useSelector(selectCurrentUser);

    // Memoize the object containing the user
    return useMemo(() => ({ user }), [user]);
};
