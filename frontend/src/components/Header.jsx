import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
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
                    <Link to="/" className="hover:text-accent-1 transition-colors">
                        <h1 className="font-cursive font-normal">5StarsBakery</h1>
                    </Link>
                </div>
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
        </header>
    );
};

export default Header;
