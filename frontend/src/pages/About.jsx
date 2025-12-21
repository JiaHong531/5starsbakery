import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="container-custom py-16">
            <div className="max-w-4xl mx-auto">
                <div className="relative flex items-center justify-center mb-12">

                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-header-bg text-center">
                        About 5 Stars Bakery
                    </h1>
                </div>
                <div className="space-y-12 text-text-main font-sans text-lg leading-relaxed text-justify">
                    <section className="text-center">
                        <p className="text-xl text-text-secondary mb-6 font-medium italic">
                            "Baking with Passion, Serving with Love."
                        </p>
                        <p className="text-justify">
                            Welcome to 5 Stars Bakery, where every creation is a masterpiece of flavor and texture.
                            Founded on a simple yet powerful belief: that the best moments in life are shared over delicious food.
                            What started as a small kitchen experiment has grown into a beloved destination for pastry lovers and bread enthusiasts alike.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <section>
                            <h2 className="text-3xl font-serif mb-6 text-header-bg">Our Philosophy</h2>
                            <p className="mb-4">
                                At the heart of 5 Stars Bakery lies an unwavering commitment to quality. We believe that exceptional baked goods start with
                                exceptional ingredients. That's why we source only the finest imported flours, premium butter, and the freshest local produce.
                            </p>
                            <p>
                                We blend traditional baking techniques with modern innovation. Our chefs honor the timeless art of baking while constantly
                                exploring new flavors and textures to surprise and delight your palate.
                            </p>
                        </section>

                        <div className="bg-bg-secondary p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-serif mb-4 text-header-bg">Why Choose Us?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center text-text-secondary">
                                    <span className="w-2 h-2 bg-header-bg rounded-full mr-3"></span>
                                    Baked Fresh Daily
                                </li>
                                <li className="flex items-center text-text-secondary">
                                    <span className="w-2 h-2 bg-header-bg rounded-full mr-3"></span>
                                    Premium Natural Ingredients
                                </li>
                                <li className="flex items-center text-text-secondary">
                                    <span className="w-2 h-2 bg-header-bg rounded-full mr-3"></span>
                                    No Artificial Preservatives
                                </li>
                                <li className="flex items-center text-text-secondary">
                                    <span className="w-2 h-2 bg-header-bg rounded-full mr-3"></span>
                                    Muslim Friendly
                                </li>
                            </ul>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-3xl font-serif mb-6 text-header-bg">The Experience</h2>
                        <p className="mb-4">
                            Walking into 5 Stars Bakery is an experience for the senses. The aroma of freshly baked bread, the sight of glistening pastries,
                            and the warmth of our ovens create an atmosphere that feels like home.
                        </p>
                        <p>
                            Whether you're looking for a crusty baguette for your dinner table, a delicate croissant for breakfast, or a custom cake for
                            a special celebration, we pour our heart and soul into everything we bake. We invite you to taste the difference that passion makes.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
