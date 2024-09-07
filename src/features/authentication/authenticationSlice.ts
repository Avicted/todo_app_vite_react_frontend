import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// An general interface for the API error format
export interface APIError {
    status: number;
    data: {
        type: string;
        title: string;
        status: number;
        errors?: {
            [key: string]: string[]; // Error fields and their messages
        };
    };
}

export interface IRegisterRequest {   
    email: string;
    password: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterNewUserRequest
{
    email: string;
    password: string;
}

export interface IUserInformation {
    id: string;
    email: string;
}

export interface IUser {   
    id: string,
    email: string;

    tokenType: string,
    accessToken: string;
    expiresIn: number,
    refreshToken: string;
}

export interface IAuthState {
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
        register: (_state, _action: PayloadAction<IUser>) => {
           // No need to do anything here
        },
        login: (state, action: PayloadAction<IUser>) => {
            state.isAuthenticated = true;
            state.user = action.payload;

            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        setUserInformation: (state, action: PayloadAction<IUserInformation>) => {
            if (state.user) {
                state.user.id = action.payload.id;
            }
        }
    },
})

export const { register, login, logout, setUserInformation } = authenticationSlice.actions

export const IsAuthenticated = (state: RootState) => state.authentication.isAuthenticated

export default authenticationSlice.reducer