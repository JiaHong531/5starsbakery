import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { FaTrash } from 'react-icons/fa';
import backIcon from '../assets/back.png';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showConfirm, showToast } = useNotification();


    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = () => {
        fetch("https://bakery-backend-kt9m.onrender.com/api/categories")
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch categories");
                return response.json();
            })
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load categories.");
                setLoading(false);
            });
    };


    const handleDelete = async (category) => {
        const id = category.category_id || category.categoryId;
        const name = category.displayName || category.display_name || category.name;

        const confirmed = await showConfirm(
            `Are you sure you want to delete the category "${name}"?\n\nThis will also delete the icon file from the server.`,
            "Delete Category"
        );

        if (confirmed) {
            try {
                const response = await fetch(`https://bakery-backend-kt9m.onrender.com/api/categories/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showToast("Category deleted successfully!", "success");

                    setCategories(prev => prev.filter(c => (c.category_id || c.categoryId) !== id));







                } else if (response.status === 409) {
                    const errData = await response.json();
                    showToast(errData.message || "Cannot delete category: It contains products.", "error");
                } else {
                    showToast("Failed to delete category.", "error");
                }
            } catch (err) {
                console.error(err);
                showToast("Network error while deleting.", "error");
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading categories... 📂</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    return (
        <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                { }
                <div className="flex items-center mb-8 gap-4 animate-slideUp">
                    { }
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="hover:opacity-80 transition-all duration-300 group"
                    >
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-10 h-10 object-contain transition-transform duration-300 group-hover:-translate-x-2"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>

                    <div>
                        <h2 className="text-4xl font-serif font-bold text-header-bg">Manage Categories</h2>
                        <p className="text-gray-500 mt-1">View and delete categories.</p>
                    </div>
                </div>

                { }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={category.category_id || category.categoryId || index}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slideUp"
                            style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                            { }
                            <div className="w-20 h-20 mb-4 bg-accent-1/10 rounded-full flex items-center justify-center relative group">
                                <div className="w-10 h-10 bg-accent-1 transition-transform duration-300 group-hover:scale-110"
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
                            </div>

                            <h3 className="font-bold text-xl text-header-bg mb-1">{category.displayName || category.display_name}</h3>
                            <p className="text-xs text-gray-400 font-mono mb-4">{category.name}</p>

                            <button
                                onClick={() => handleDelete(category)}
                                className="mt-auto px-4 py-2 bg-accent-1 text-text-light rounded-full font-bold text-sm hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2 group"
                            >
                                <FaTrash size={14} className="group-hover:rotate-12 transition-transform" />
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <p>No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCategories;
