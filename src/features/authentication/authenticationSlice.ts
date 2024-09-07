import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'


export interface IRegisterRequest {   
    email: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

interface IUser {   
    id: string,
    email: string;
    accessToken: string;
    refreshToken: string;
} 

interface IAuthState {
    isAuthenticated: boolean;
    user: IUser | null;
}

const initialState: IAuthState = {
    isAuthenticated: false,
    user: null,
}   

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IUser>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
})

export const { login, logout } = authenticationSlice.actions

export const IsAuthenticated = (state: RootState) => state.authentication.isAuthenticated

export default authenticationSlice.reducer