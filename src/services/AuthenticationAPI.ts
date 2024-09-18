// Need to use the React-specific entry point to import createApi
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginRequest, IRefreshTokenRequest, IRefreshTokenResponse, IRegisterNewUserRequest, IUser, IUserInformation } from '../features/authentication/authenticationSlice'


// Helper function to refresh token
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
        const response = await fetch('http://localhost:1337/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })

        console.log('Refresh token response:', response)

        if (response.ok) {
            const data = await response.json()
            console.log('Refresh token data:', data)
            localStorage.setItem('accessToken', data.accessToken)
            return data.accessToken
        }
    }
    return null
}

// Custom baseQuery with token refresh logic
export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let accessToken = localStorage.getItem('accessToken')

    console.log('AuthenticationAPI Access Token:', accessToken); // Log token for debugging

    const result = await fetchBaseQuery({
        baseUrl: 'http://localhost:1337/api',
        prepareHeaders: (headers) => {
            if (accessToken) {
                headers.set('Authorization', `Bearer ${accessToken}`)
            }
            return headers
        },
    })(args, api, extraOptions)

    if (result?.error?.status === 401) {
        // return result;

        const newAccessToken = await refreshAccessToken()
        if (newAccessToken) {
            accessToken = newAccessToken
            localStorage.setItem('accessToken', newAccessToken)

            return fetchBaseQuery({
                baseUrl: 'http://localhost:1337/api',
                prepareHeaders: (headers) => {
                    headers.set('Authorization', `Bearer ${accessToken}`)
                    return headers
                },
            })(args, api, extraOptions)
        }
    }

    return result
}

// Define a service using a base URL and expected endpoints
export const authenticationAPI = createApi({
    reducerPath: 'authenticationAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth'],
    endpoints: (builder) => {
        return ({
            login: builder.mutation<IUser, ILoginRequest>({
                query: (body) => ({
                    // url: '/custom-login',
                    url: '/login',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['Auth'],
            }),
            register: builder.mutation<IUser, IRegisterNewUserRequest>({
                query: (body) => ({
                    url: '/register',
                    method: 'POST',
                    body,
                }),
            }),
            refresh: builder.mutation<IRefreshTokenResponse, IRefreshTokenRequest>({
                query: (body) => ({
                    url: '/refresh',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['Auth'],
            }),
            getOwnDetails: builder.query<IUserInformation, null>({
                query: () => ({
                    url: '/users/getowndetails',
                }),
                providesTags: ['Auth']
            }),
        })
    }
}
)


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useRegisterMutation, useRefreshMutation, useGetOwnDetailsQuery } = authenticationAPI

