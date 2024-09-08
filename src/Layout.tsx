import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { useGetOwnDetailsQuery, useRefreshMutation } from './services/AuthenticationAPI';
import { useAuth } from './hooks';
import { IRefreshTokenRequest, IUserInformation, setUserInformation } from './features/authentication/authenticationSlice';
import { persistor } from './store'; // Import persistor if needed

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    const dispatch = useDispatch();

    // Fetch user details
    const { data: userData, isLoading, isError } = useGetOwnDetailsQuery(null, {
        skip: !localStorage.getItem('accessToken'), // Only fetch if accessToken exists
    });

    // Refresh token mutation
    const [refreshTokenRequest] = useRefreshMutation();

    useEffect(() => {
        console.log('Layout useEffect:', auth.user, userData);

        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            if (userData) {
                dispatch(setUserInformation(userData as IUserInformation));
            }

            if (!auth.user && accessToken && refreshToken) {
                if (isError) {
                    console.log('Access token is invalid, refreshing token...');
                    const refreshRequest: IRefreshTokenRequest = { refreshToken: refreshToken };
                    refreshTokenRequest(refreshRequest)
                        .unwrap()
                        .then(response => {
                            // Update the refresh token in localStorage
                            localStorage.setItem('refreshToken', response.refreshToken as string);
                            console.log('Refresh token response:', response);
                        })
                        .catch(error => {
                            console.error('Error refreshing token:', error);
                        });
                } else if (userData && !isLoading) {
                    dispatch(setUserInformation(userData as IUserInformation));
                }
            } else if (auth.user) {
                dispatch(setUserInformation(auth.user));
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
    }, [auth.user, userData, isLoading, isError, dispatch, refreshTokenRequest]);

    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
};

export default Layout;
