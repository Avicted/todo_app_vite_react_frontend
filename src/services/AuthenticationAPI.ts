// Need to use the React-specific entry point to import createApi
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginRequest, IRegisterNewUserRequest, IUser } from '../features/authentication/authenticationSlice'


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
      if (response.ok) {
        const data = await response.json()
        // localStorage.setItem('accessToken', data.accessToken)
        return data.accessToken
      }
    }
    return null
}

// Custom baseQuery with token refresh logic
export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let accessToken = localStorage.getItem('accessToken')
  
    console.log('Access Token:', accessToken); // Log token for debugging
  
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
    endpoints: (builder) => {
        return ({
            login: builder.mutation<IUser, ILoginRequest>({
                query: (body) => ({
                    url: '/custom-login',
                    method: 'POST',
                    body,
                }),
            }),
            register: builder.mutation<IUser, IRegisterNewUserRequest>({
                query: (body) => ({
                    url: '/register',
                    method: 'POST',
                    body,
                }),
            }),
            getOwnDetails: builder.mutation<void, void>({
                query: () => ({
                    url: '/users/getowndetails',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                })
            }),
        })
    }}
)
  

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useRegisterMutation, useGetOwnDetailsMutation } = authenticationAPI

    