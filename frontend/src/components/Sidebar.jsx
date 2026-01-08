import React from 'react';
import { FaBirthdayCake, FaCookie, FaList } from 'react-icons/fa';
import muffinIcon from '../assets/muffin.png';
import cupcakeIcon from '../assets/cupcake.png';

const categories = [
    { name: 'Cakes', value: 'Cake', icon: <FaBirthdayCake className="mr-3" /> },
    { name: 'Muffins', value: 'Muffin', icon: <img src={muffinIcon} alt="Muffin" className="w-4 h-4 mr-3" /> },
    { name: 'Cupcakes', value: 'Cupcake', icon: <img src={cupcakeIcon} alt="Cupcake" className="w-4 h-4 mr-3" /> },
    { name: 'Cookies', value: 'Cookies', icon: <FaCookie className="mr-3" /> },
];

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
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
                        <li key={category.name} className="animate-slideUp" style={{ animationDelay: `${(index + 2) * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                            <button
                                onClick={() => onSelectCategory(category.value)}
                                className={`w-full flex items-center p-3 rounded-md transition-all duration-300 group ${selectedCategory === category.value
                                    ? 'bg-accent-1 text-text-light font-bold shadow-md scale-105'
                                    : 'text-gray-600 hover:bg-accent-1/10 hover:text-accent-1 hover:translate-x-1 hover:shadow-sm'
                                    }`}
                            >
                                <span className={`mr-3 transition-transform duration-300 ${selectedCategory !== category.value ? 'group-hover:scale-125 group-hover:rotate-12' : ''}`}>
                                    {category.icon}
                                </span>
                                <span className="font-medium">{category.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
