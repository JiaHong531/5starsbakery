import React from 'react';

const Hero = () => {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center bg-header-bg overflow-hidden">

            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2880&auto=format&fit=crop')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-bg-primary mb-6 drop-shadow-lg italic">
                    Baking with Passion
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 font-sans font-light tracking-wide">
                    Experience the finest handcrafted pastries, delivered fresh to your heart.
                </p>

                <button
                    onClick={scrollToMenu}
                    className="px-8 py-3 bg-accent-1 text-text-light font-bold rounded-full text-lg hover:bg-accent-2 hover:scale-105 transition-all shadow-lg"
                >
                    Order Now
                </button>
            </div>
        </div>
    );
};

export default Hero;