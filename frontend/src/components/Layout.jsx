import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import ConfirmModal from './ConfirmModal';
import ToastContainer from './ToastContainer';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
    const location = useLocation();

    const authPaths = ['/login', '/register', '/admin-login'];
    const showSidebar = !authPaths.includes(location.pathname);
    return (
        <div className="flex flex-col min-h-screen">
            <CartSidebar />
            <Header />
            <main className="flex-grow">
                {/* <Outlet /> is where Home, Login, etc. will appear */}
                <Outlet />
            </main>
            <ScrollToTop />
            <Footer />
            {/* Global notification components */}
            <ConfirmModal />
            <ToastContainer />
        </div>
    );
};

export default Layout;