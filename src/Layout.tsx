import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from './App';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /*useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken) {
            try {
                const user = decodeToken(accessToken);
                if (user) {
                    dispatch({ type: 'authentication/login', payload: user });
                } else {
                    // Token decoding failed; handle it appropriately
                    // localStorage.removeItem('accessToken');
                    // localStorage.removeItem('refreshToken');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                // localStorage.removeItem('accessToken');
                // localStorage.removeItem('refreshToken');
                navigate('/');
            }
        } else {
            // No access token; handle it appropriately
            navigate('/');
        }
    }, [dispatch]);*/

    return (
        <div id="app">
            <NavBar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;