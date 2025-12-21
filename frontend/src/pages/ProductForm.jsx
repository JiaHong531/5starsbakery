import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backIcon from '../assets/back.png';

const ProductForm = () => {
    const { id } = useParams(); // If ID exists, we are in EDIT mode
    const navigate = useNavigate();
    const { user } = useAuth();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState(() => {
        // Load from storage if available
        const savedData = sessionStorage.getItem(`productForm_${id || 'new'}`);
        return savedData ? JSON.parse(savedData) : {
            name: '',
            description: '',
            ingredients: '',
            price: '',
            stock: '',
            category: 'Cake',
            imageUrl: ''
        };
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    // Categories for Dropdown
    const categories = ["Cake", "Muffin", "Cupcake", "Cookies"];

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
                    alert("Failed to load product for editing.");
                    navigate('/admin/dashboard');
                });
        }
    }, [id, isEditMode, user, navigate]);

    // Save to session storage whenever formData changes
    useEffect(() => {
        sessionStorage.setItem(`productForm_${id || 'new'}`, JSON.stringify(formData));
    }, [formData, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode
            ? `http://localhost:8080/api/products/${id}`
            : `http://localhost:8080/api/products`;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
                sessionStorage.removeItem(`productForm_${id || 'new'}`);
                navigate('/admin/dashboard');
            } else {
                alert("Failed to save product.");
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Loading product data...</div>;

    return (
        <div className="min-h-screen bg-bg-light p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8 gap-4">
                    <button onClick={() => navigate(-1)} className="hover:opacity-80">
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-header-bg">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Product Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
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
                            <label className="block text-gray-700 font-bold mb-2">Image URL</label>
                            <input
                                type="text" name="imageUrl" required
                                value={formData.imageUrl} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                                placeholder="https://..."
                            />
                            {formData.imageUrl && (
                                <div className="mt-4 w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border">
                                    <img src={formData.imageUrl} alt="Preview" className="h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn flex-1 btn-primary text-text-light py-3 rounded-lg font-bold hover:bg-accent-2 transition-colors"
                            >
                                {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Product')}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn flex-1 bg-header-bg text-text-light py-3 rounded-lg font-bold hover:bg-accent-2 transition-colors"
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
