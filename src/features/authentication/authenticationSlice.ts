import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../../store'

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

export interface IRefreshTokenRequest {
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
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
    expiresIn?: number,
    refreshToken: string;
}

export interface IAuthState {
    user: IUser | null;
    successfullyRegistered: boolean;
}

const initialState: IAuthState = {
    user: null,
    successfullyRegistered: false,
}

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        register: (state, _action: PayloadAction<IUser>) => {
           state.successfullyRegistered = true;
        },
        login: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;

            if (action.payload.accessToken) {
                localStorage.setItem('accessToken', action.payload.accessToken);
            }
            if (action.payload.refreshToken) {
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }

            state.successfullyRegistered = false;
        },
        logout: (state) => {    
            console.log('Logging out user');

             state.user = null; // Clear user info

            // localStorage.removeItem('accessToken');
            // localStorage.removeItem('refreshToken');
       
            // Clear entire localStorage
            localStorage.clear();

            state.successfullyRegistered = false;
        },
        setUserInformation: (state, action: PayloadAction<IUserInformation>) => {
            if (state.user) {
                console.log('Setting user information in the authenticationSlice:', action.payload);
                state.user.id = action.payload.id;
                state.user.email = action.payload.email;
                // state.user.tokenType = action.payload.tokenType;
                // state.user.accessToken = action.payload.accessToken;
                // state.user.expiresIn = action.payload.expiresIn;
                // state.user.refreshToken = action.payload.refreshToken;
            }
        }
    },
})

export const { register, login, logout, setUserInformation } = authenticationSlice.actions

export const IsAuthenticated = (state: RootState) => state.authentication.user !== null
export const SuccessfullyRegistered = (state: RootState) => state.authentication.successfullyRegistered
export const selectCurrentUser = (state: RootState) => state.authentication.user

export default authenticationSlice.reducer