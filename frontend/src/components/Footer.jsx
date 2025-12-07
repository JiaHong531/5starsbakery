import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-header-bg text-text-light py-8 mt-auto">
            <div className="container-custom flex flex-wrap justify-between items-start gap-8">
                <div className="flex flex-col gap-2.5">
                    <h3 className="mb-2.5 text-lg font-semibold font-serif text-2xl">About Us</h3>
                    <Link to="/about" className="hover:text-accent-1 transition-colors font-sans text-base">About 5 Stars Bakery</Link>
                    <Link to="/privacy-policy" className="hover:text-accent-1 transition-colors font-sans text-base">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-accent-1 transition-colors font-sans text-base">Terms & Conditions</Link>
                </div>
                <div className="flex flex-col gap-2.5">
                    <h3 className="mb-2.5 text-lg font-semibold font-serif text-2xl">Contact Us</h3>
                    <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                        <FaWhatsapp size={24} />
                        <span className="font-sans text-base">+60 12-345 6789</span>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                        <FaFacebook size={24} />
                        <span className="font-sans text-base">Facebook</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                        <FaInstagram size={24} />
                        <span className="font-sans text-base">Instagram</span>
                    </a>
                </div>
            </div>
            <div className="text-center mt-8 text-sm opacity-80 font-sans text-base">
                &copy; {new Date().getFullYear()} 5 Stars Bakery. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
