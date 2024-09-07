// Need to use the React-specific entry point to import createApi
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginRequest } from '../features/authentication/authenticationSlice'

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
        localStorage.setItem('accessToken', data.accessToken)
        return data.accessToken
      }
    }
    return null
}

// Custom baseQuery with token refresh logic
export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let accessToken = localStorage.getItem('accessToken')
  
    // Add the authorization header
    const result = await fetchBaseQuery({
      baseUrl: 'http://localhost:1337/api',
      prepareHeaders: (headers) => {
        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
      },
    })(args, api, extraOptions)
  
    // If we get a 401, try to refresh the token
    if (result?.error?.status === 401) {
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        // Retry the original query with new access token
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
const authenticationAPI = createApi({
    reducerPath: 'authenticationAPI',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
      login: builder.mutation<{ accessToken: string, refreshToken: string }, ILoginRequest>({
        query: (body) => ({
          url: '/login',
          method: 'POST',
          body,
        }),
      }),
      register: builder.mutation<{ accessToken: string, refreshToken: string }, { email: string, password: string }>({
        query: (body) => ({
          url: '/register',
          method: 'POST',
          body,
        }),
      }),
    }),
  })
  

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useRegisterMutation } = authenticationAPI

    