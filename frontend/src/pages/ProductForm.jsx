import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';

const ProductForm = () => {
    const { id } = useParams(); // If ID exists, we are in EDIT mode
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useNotification();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ingredients: '',
        price: '',
        stock: '',
        category: 'Cake', // Default
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    // Categories for Dropdown
    const categories = ["Cake", "Muffin", "Cupcake", "Cookies"];

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        // Redirect if not admin
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        if (isEditMode) {
            // Fetch existing product data
            fetch(`http://localhost:8080/api/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name,
                        description: data.description,
                        ingredients: data.ingredients,
                        price: data.price,
                        stock: data.stock,
                        category: data.category,
                        imageUrl: data.imageUrl
                    });
                    setFetching(false);
                })
                .catch(err => {
                    console.error("Failed to fetch product", err);
                    showToast("Failed to load product for editing.", "error");
                    navigate('/admin/dashboard');
                });
        }
    }, [id, isEditMode, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Prepare Multipart Data
        const data = new FormData();
        if (imageFile) {
            data.append('image', imageFile);
        }

        // Append all text fields from formData
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // 2. Determine URL and Method
        const url = isEditMode
            ? `http://localhost:8080/api/products/${id}`
            : `http://localhost:8080/api/products/upload`; // Point to your new upload servlet

        try {
            const response = await fetch(url, {
                method: 'POST', // Use POST for both; your Servlet handles the logic
                body: data,
            });

            if (response.ok) {
                showToast(`Product ${isEditMode ? 'updated' : 'created'} successfully!`, "success");
                navigate('/admin/dashboard');
            } else {
                showToast("Failed to save product.", "error");
            }
        } catch (error) {
            console.error("Upload error:", error);
            showToast("Error connecting to server.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading product data...</div>;

    return (
        <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
                {/* Header - Animated */}
                <div className="flex items-center mb-8 gap-4 animate-slideUp">
                    <button onClick={() => navigate('/admin/dashboard')} className="hover:opacity-80 transition-all duration-300 group">
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:-translate-x-2"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-header-bg">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8 animate-scaleIn">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name */}
                        <div className="animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                            <label className="block text-gray-700 font-bold mb-2">Product Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 transition-all duration-300 hover:border-accent-1"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                name="description" required rows="3"
                                value={formData.description} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                            />
                        </div>

                        {/* Ingredients */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Ingredients</label>
                            <textarea
                                name="ingredients" required rows="2"
                                value={formData.ingredients} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Price (RM)</label>
                                <input
                                    type="number" step="0.01" name="price" required
                                    value={formData.price} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
                                <input
                                    type="number" name="stock" required
                                    value={formData.stock} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 bg-white"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Select Product Image</label>
                            <div className="flex items-center gap-4 p-2 border rounded-lg bg-white">
                                {/* 1. The fake button (a label) */}
                                <label
                                    htmlFor="file-upload"
                                    className="btn btn-primary text-text-light py-2 px-6 rounded-lg font-bold hover:bg-accent-2 transition-colors shadow-sm cursor-pointer"
                                    style={{ backgroundColor: '#FCA588' }} // Explicit colour matching your image, remove if btn-primary is already this color
                                >
                                    Choose Image
                                </label>

                                {/* 2. The actual, hidden file input */}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" // This class hides the ugly default button
                                />

                                {/* 3. Show the selected file name */}
                                <span className="text-gray-600 text-sm italic overflow-hidden text-ellipsis whitespace-nowrap">
                                    {imageFile ? imageFile.name : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        {/* Buttons - Enhanced */}
                        <div className="flex gap-4 pt-4 border-t animate-slideUp stagger-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn flex-1 btn-primary text-text-light py-3 rounded-lg font-bold hover:bg-accent-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                            >
                                {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Product')}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/dashboard')}
                                className="btn flex-1 bg-header-bg text-text-light py-3 rounded-lg font-bold hover:bg-red-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
