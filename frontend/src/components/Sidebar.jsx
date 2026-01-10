import React, { useState, useEffect } from 'react';
import { FaList } from 'react-icons/fa';

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to load categories", err));
    }, []);

    return (
        <aside className="w-64 flex-shrink-0 hidden md:block animate-slideInLeft">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-bold text-lg mb-4 text-text-main uppercase tracking-wider border-b pb-2 animate-fadeIn">Categories</h3>
                <ul className="space-y-2">
                    <li className="animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <button
                            onClick={() => onSelectCategory('All')}
                            className={`w-full flex items-center p-3 rounded-md transition-all duration-300 group ${selectedCategory === 'All'
                                ? 'bg-accent-1 text-text-light font-bold shadow-md scale-105'
                                : 'text-gray-600 hover:bg-accent-1/10 hover:text-accent-1 hover:translate-x-1 hover:shadow-sm'
                                }`}
                        >
                            <FaList className={`mr-3 transition-transform duration-300 ${selectedCategory !== 'All' ? 'group-hover:scale-125 group-hover:rotate-12' : ''}`} />
                            <span className="font-medium">All Categories</span>
                        </button>
                    </li>
                    {categories.map((category, index) => (
                        <li key={category.category_id || category.name} className="animate-slideUp" style={{ animationDelay: `${(index + 2) * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                            <button
                                onClick={() => onSelectCategory(category.name)} // Pass name matching product category
                                className={`w-full flex items-center p-3 rounded-md transition-all duration-300 group ${selectedCategory === category.name
                                    ? 'bg-accent-1 text-text-light font-bold shadow-md scale-105'
                                    : 'text-gray-600 hover:bg-accent-1/10 hover:text-accent-1 hover:translate-x-1 hover:shadow-sm'
                                    }`}
                            >
                                <span className={`mr-3 transition-transform duration-300 w-5 h-5 flex items-center justify-center ${selectedCategory !== category.name ? 'group-hover:scale-125 group-hover:rotate-12' : ''}`}>
                                    <div
                                        className="w-full h-full bg-current"
                                        style={{
                                            maskImage: `url(${category.iconUrl || category.icon_url})`,
                                            WebkitMaskImage: `url(${category.iconUrl || category.icon_url})`,
                                            maskSize: 'contain',
                                            WebkitMaskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            WebkitMaskRepeat: 'no-repeat',
                                            maskPosition: 'center',
                                            WebkitMaskPosition: 'center'
                                        }}
                                    />

                                </span>
                                <span className="font-medium">{category.displayName || category.display_name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
