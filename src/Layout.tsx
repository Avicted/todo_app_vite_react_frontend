import React from 'react';
import NavBar from './NavBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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