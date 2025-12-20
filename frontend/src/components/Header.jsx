import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSearch, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();
    const { getCartCount, toggleCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // --- Logic Definitions ---
    const authPaths = ['/login', '/register', '/admin-login'];
    const isAuthPage = authPaths.includes(location.pathname);

    // 1. Show Cart if: NOT on auth page AND NOT an Admin
    const showCartIcon = !isAuthPage && (!user || user.role !== 'ADMIN');

    // 2. Show Profile if: User is Logged In OR NOT on auth page
    const showProfileIcon = user || !isAuthPage;

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setShowDropdown(false);
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <header className="bg-header-bg text-text-light py-4 relative">
            <div className="w-full px-8 flex justify-between items-center">

                {/* Logo Section */}
                <div className="text-2xl font-bold">
                    <div
                        onClick={() => handleNavigation(user && user.role === 'ADMIN' ? '/admin/dashboard' : '/')}
                        className="hover:text-accent-1 transition-colors flex items-center gap-4 cursor-pointer"
                    >
                        <img src={logo} alt="5 Stars Bakery Logo" className="h-24 w-auto object-contain" />
                        <h1 className="font-cursive font-normal">5StarsBakery</h1>
                    </div>
                </div>

                {/* Search Bar */}
                {location.pathname === '/' ? (
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2.5 px-5 pr-12 rounded-full border-none outline-none text-text-main bg-white/95 focus:bg-white shadow-inner focus:ring-2 focus:ring-accent-1 transition-all"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-accent-1 transition-colors">
                                <FaSearch size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 hidden md:block"></div>
                )}

                {/* Right Icons Section */}
                <div className="flex items-center gap-4">

                    {/* Admin Orders Icon */}
                    {user && user.role === 'ADMIN' && (
                        <div
                            className="relative cursor-pointer p-2.5 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => navigate('/admin/orders')}
                            title="View Customer Orders"
                        >
                            <FaClipboardList size={22} className="text-text-light" />
                        </div>
                    )}

                    {/* Cart Icon - HIDE FOR ADMIN & AUTH PAGES */}
                    {showCartIcon && (
                        <div
                            className="relative cursor-pointer p-2.5 rounded-full hover:bg-white/10 transition-colors"
                            onClick={toggleCart}
                        >
                            <FaShoppingCart size={24} className="text-text-light" />
                            <span className="absolute top-1 right-1 bg-accent-2 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                                {getCartCount()}
                            </span>
                        </div>
                    )}

                    {/* User Profile & Dropdown - HIDDEN on Auth Pages for Guests */}
                    {showProfileIcon && (
                        <div className="relative cursor-pointer">
                            <div
                                className="p-2.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
                                onClick={toggleDropdown}
                            >
                                <FaUser size={24} className="text-text-light" />
                                {/* Show Name if Logged In */}
                                {user && <span className="text-sm font-bold hidden md:block">{user.username}</span>}
                            </div>

                            {showDropdown && (
                                <div className="absolute top-full right-0 bg-white text-text-main shadow-lg rounded overflow-hidden z-50 min-w-[200px] mt-2 border border-gray-100">

                                    {user ? (
                                        // --- LOGGED IN MENU ---
                                        <>
                                            <div
                                                className="px-5 py-3 border-b bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                                onClick={() => handleNavigation('/profile')}
                                            >
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="font-bold text-header-bg truncate">{user.username}</p>
                                            </div>

                                            {user.role === 'CUSTOMER' && (
                                                <>
                                                    <button
                                                        onClick={() => handleNavigation('/my-orders')}
                                                        className="block w-full px-5 py-2.5 text-left hover:bg-gray-100 transition-colors font-serif font-bold text-base"
                                                    >
                                                        My Orders
                                                    </button>
                                                    <div className="border-t my-1"></div>
                                                </>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full px-5 py-2.5 text-left hover:bg-gray-100 transition-colors font-serif font-bold text-base"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        // --- GUEST MENU ---
                                        <>
                                            <button
                                                onClick={() => handleNavigation('/login')}
                                                className="block w-full px-5 py-2.5 text-left hover:bg-gray-100 transition-colors font-serif font-bold text-base"
                                            >
                                                Login
                                            </button>
                                            <button
                                                onClick={() => handleNavigation('/register')}
                                                className="block w-full px-5 py-2.5 text-left hover:bg-gray-100 transition-colors font-serif font-bold text-base"
                                            >
                                                Register
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;