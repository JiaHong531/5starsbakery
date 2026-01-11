import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const location = useLocation();
    const footerPaths = ['/about', '/privacy-policy', '/terms'];
    const isFooterPage = footerPaths.includes(location.pathname);

    return (
        <footer className="bg-header-bg text-text-light py-8 mt-auto relative z-50">
            <div className="max-w-[1200px] mx-auto px-5 flex flex-wrap justify-between items-start gap-8">
                {}
                <div className="flex flex-col gap-2.5 animate-slideUp">
                    <h3 className="mb-2.5 text-lg font-semibold font-serif text-2xl">About Us</h3>
                    <Link to="/about" replace={isFooterPage} className="hover:text-accent-1 transition-all duration-300 font-sans text-base link-underline hover:translate-x-1">About 5 Stars Bakery</Link>
                    <Link to="/privacy-policy" replace={isFooterPage} className="hover:text-accent-1 transition-all duration-300 font-sans text-base link-underline hover:translate-x-1">Privacy Policy</Link>
                    <Link to="/terms" replace={isFooterPage} className="hover:text-accent-1 transition-all duration-300 font-sans text-base link-underline hover:translate-x-1">Terms & Conditions</Link>
                </div>

                {}
                <div className="flex flex-col gap-2.5 animate-slideUp stagger-2">
                    <h3 className="mb-2.5 text-lg font-semibold font-serif text-2xl">Contact Us</h3>
                    <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1">
                        <FaWhatsapp size={24} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="font-sans text-base">+60 12-345 6789</span>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1">
                        <FaFacebook size={24} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="font-sans text-base">Facebook</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-all duration-300 flex items-center gap-2 group hover:translate-x-1">
                        <FaInstagram size={24} className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="font-sans text-base">Instagram</span>
                    </a>
                </div>
            </div>

            {}
            <div className="text-center mt-8 text-sm opacity-80 font-sans text-base animate-fadeIn stagger-3">
                &copy; {new Date().getFullYear()} 5 Stars Bakery. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
