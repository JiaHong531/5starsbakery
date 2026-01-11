import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-36 right-10 z-[999]">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
                    w-16 h-16 flex items-center justify-center rounded-full bg-accent-1 text-white shadow-lg
                    transition-all duration-300 ease-in-out hover:bg-accent-2 hover:scale-110 focus:outline-none
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                `}
            >
                <FaArrowUp size={24} />
            </button>
        </div>
    );
};

export default ScrollToTop;