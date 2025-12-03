import React from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-header-bg text-text-light py-8 mt-auto">
            <div className="container-custom flex flex-wrap justify-between items-start gap-8">
                <div className="flex flex-col gap-2.5">
                    <h3 className="mb-2.5 text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>About Us</h3>
                    <Link to="/about" className="hover:text-accent-1 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>About 5StarsBakery</Link>
                    <Link to="/privacy" className="hover:text-accent-1 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-accent-1 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Terms & Conditions</Link>
                </div>
                <div className="flex flex-col items-start">
                    <h3 className="mb-2.5 text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>Contact Us</h3>
                    <div className="flex flex-col gap-2.5">
                        <a href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaWhatsapp size={24} />
                            <span style={{ alignItems: 'left', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>+60 12-345 6789</span>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaFacebook size={24} />
                            <span style={{ alignItems: 'left', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Facebook</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-1 transition-colors flex items-center gap-2">
                            <FaInstagram size={24} />
                            <span style={{ alignItems: 'left', fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 text-sm opacity-80" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>
                &copy; {new Date().getFullYear()} 5 Stars Bakery. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
