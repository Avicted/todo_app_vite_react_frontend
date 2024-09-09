import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { useGetOwnDetailsQuery, useRefreshMutation } from '../services/AuthenticationAPI';
import { useAuth } from '../hooks';
import { IUser, login } from '../features/authentication/authenticationSlice';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const dispatch = useDispatch();

    // Fetch user details
    const { data: userData, isLoading, isError } = useGetOwnDetailsQuery(null, {
        skip: !localStorage.getItem('accessToken'),
    });

    const [refreshTokenRequest] = useRefreshMutation();

    // @Note(Victor): Hook?
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // If auth.user exists, or userData has been fetched, proceed
        if (userData) {
            console.log('Layout Setting user information:', auth.user || userData);
            var test: IUser = {
                id: userData.id,
                email: userData.email,
                accessToken: accessToken as string,
                refreshToken: refreshToken as string,
                tokenType: 'Bearer',
            }
            dispatch(login(test));
        }

        // Handle token refresh if necessary
        if (!auth.user && !isLoading && isError && accessToken && refreshToken) {
            console.log('Access token is invalid, refreshing token...');
            refreshTokenRequest({ refreshToken })
                .unwrap()
                .then(response => {
                    // Update tokens in localStorage
                    localStorage.setItem('refreshToken', response.refreshToken as string);
                    localStorage.setItem('accessToken', response.accessToken as string);
                    console.log('Refresh token response:', response);

                    // Reload the page to trigger data refetch
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error refreshing token:', error);
                });
        }
    }, [userData, isLoading, isError, dispatch, refreshTokenRequest]);

    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
};

export default Layout;
