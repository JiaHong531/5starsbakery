import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSearch, FaShoppingCart } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();
    const { getCartCount, toggleCart } = useCart();
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setShowDropdown(false);
    };

    return (
        <header className="bg-header-bg text-text-light py-4 relative">
            <div className="w-full px-8 flex justify-between items-center">
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-accent-1 transition-colors flex items-center gap-4">
                        <img src={logo} alt="5 Stars Bakery Logo" className="h-24 w-auto object-contain" />
                        <h1 className="font-cursive font-normal">5StarsBakery</h1>
                    </Link>
                </div>

                {/* Search Bar */}
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

                <div className="flex items-center gap-4">
                    {/* Cart Icon */}
                    <div
                        className="relative cursor-pointer p-2.5 rounded-full hover:bg-white/10 transition-colors"
                        onClick={toggleCart}
                    >
                        <FaShoppingCart size={24} className="text-text-light" />
                        <span className="absolute top-1 right-1 bg-accent-2 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                            {getCartCount()}
                        </span>
                    </div>

                    {/* User Profile */}
                    <div className="relative cursor-pointer">
                        <div
                            className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                            onClick={toggleDropdown}
                        >
                            <FaUser size={24} className="text-text-light" />
                        </div>
                        {showDropdown && (
                            <div className="absolute top-full right-0 bg-white text-text-main shadow-lg rounded overflow-hidden z-50 min-w-[150px] mt-2">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
