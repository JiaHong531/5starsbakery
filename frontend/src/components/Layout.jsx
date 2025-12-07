import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-8 bg-bg-primary">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
