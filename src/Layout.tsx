import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { useGetOwnDetailsQuery, useRefreshMutation } from './services/AuthenticationAPI';
import { useAuth } from './hooks';
import { IRefreshTokenRequest, IUserInformation, setUserInformation } from './features/authentication/authenticationSlice';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const dispatch = useDispatch();

    // Fetch user details
    const { data: userData, isLoading, isError } = useGetOwnDetailsQuery(null, {
        skip: !localStorage.getItem('accessToken'), // Only fetch if accessToken exists
    });

    // Refresh token mutation
    const [refreshTokenRequest, { data: _refreshResponse }] = useRefreshMutation();

    // @Todo(Victor): Infinite loop, or at least it has some issues
    useEffect(() => {
        console.log('Layout useEffect:', auth.user, userData);

        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (userData) {
            dispatch(setUserInformation(userData as IUserInformation));
        }

        if (!auth.user && accessToken && refreshToken) {
            // If the user is not authenticated, try to fetch user details
            if (!isLoading && userData) {
                dispatch(setUserInformation(userData as IUserInformation));
            }

            // If accessToken is missing or expired, refresh the token
            if (!accessToken || isError) {
                console.log('Access token missing or invalid, refreshing token...');
                const refreshRequest: IRefreshTokenRequest = { refreshToken: refreshToken };
                refreshTokenRequest(refreshRequest)
                    .then(response => {
                        // Handle the response, e.g., update the access token in local storage
                        localStorage.setItem('refreshToken', response.data?.refreshToken as string);
                        console.log('Refresh token response:', response.data);
                    })
                    .catch(error => {
                        console.error('Error refreshing token:', error);
                    });
            }
        } else if (auth.user) {
            console.log('User is authenticated:', auth.user);
            // dispatch(setUserInformation(auth.user));
        }
    }, [userData, dispatch, refreshTokenRequest]);


    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
};

export default Layout;
