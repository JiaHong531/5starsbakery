import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-header-bg text-text-light py-8 mt-auto">
            <div className="container-custom flex flex-wrap justify-between items-start gap-8">
                <div className="flex flex-col gap-2.5">
                    <Link to="/about" className="hover:text-accent-1 transition-colors">About Us</Link>
                    <Link to="/privacy" className="hover:text-accent-1 transition-colors">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-accent-1 transition-colors">Terms & Conditions</Link>
                </div>
                <div className="flex flex-col items-start">
                    <h3 className="mb-2.5 text-lg font-semibold">Contact Us</h3>
                    <div className="flex flex-col gap-2.5">
                        <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaWhatsapp size={24} />
                            <span>+60 12-345 6789</span>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaFacebook size={24} />
                            <span>Facebook</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaInstagram size={24} />
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 text-sm opacity-80">
                &copy; {new Date().getFullYear()} 5 Stars Bakery. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
