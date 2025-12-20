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
        <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-4">
                <h3 className="font-bold text-lg mb-4 text-text-main uppercase tracking-wider border-b pb-2">Categories</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => onSelectCategory('All')}
                            className={`w-full flex items-center p-3 rounded-md transition-colors ${selectedCategory === 'All'
                                ? 'bg-accent-1 text-text-light font-bold shadow-md'
                                : 'text-gray-600 hover:bg-accent-1/10 hover:text-accent-1'
                                }`}
                        >
                            <FaList className="mr-3" />
                            <span className="font-medium">All Categories</span>
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category.name}>
                            <button
                                onClick={() => onSelectCategory(category.value)}
                                className={`w-full flex items-center p-3 rounded-md transition-colors ${selectedCategory === category.value
                                    ? 'bg-accent-1 text-text-light font-bold shadow-md'
                                    : 'text-gray-600 hover:bg-accent-1/10 hover:text-accent-1'
                                    }`}
                            >
                                {category.icon}
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
