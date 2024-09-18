import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './AuthenticationAPI'
import { IUserInformation } from '../features/authentication/authenticationSlice'

// Define a service using a base URL and expected endpoints
export const usersAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUserById: builder.query<IUserInformation, { id: string }>({
            query: ({ id }) => ({
                url: `/users/${id}`,
                invalidatesTags: ['Todo', 'User'],
            })
        }),
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserByIdQuery } = usersAPI