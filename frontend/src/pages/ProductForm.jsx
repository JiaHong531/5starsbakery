import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';

const ProductForm = () => {
    const { id } = useParams();
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
        category: '',
        imageUrl: ''
    });


    const [categories, setCategories] = useState([]);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [imageFile, setImageFile] = useState(null);


    useEffect(() => {

        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {

                const catResponse = await fetch('https://bakery-backend-kt9m.onrender.com/api/categories');
                const catData = await catResponse.json();
                setCategories(catData);


                if (!isEditMode && catData.length > 0) {
                    setFormData(prev => ({ ...prev, category: catData[0].name }));
                }


                if (isEditMode) {
                    const prodResponse = await fetch(`https://bakery-backend-kt9m.onrender.com/api/products/${id}`);
                    const prodData = await prodResponse.json();

                    setFormData({
                        name: prodData.name,
                        description: prodData.description,
                        ingredients: prodData.ingredients,
                        price: prodData.price,
                        stock: prodData.stock,
                        category: prodData.category,
                        imageUrl: prodData.imageUrl
                    });
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
                showToast("Failed to load data.", "error");
                if (isEditMode) navigate('/admin/dashboard');
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [id, isEditMode, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'category') {
            if (value === 'NEW') {
                setIsNewCategory(true);
                setFormData(prev => ({ ...prev, category: 'NEW' }));
            } else {
                setIsNewCategory(false);
                setFormData(prev => ({ ...prev, category: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleIconChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewCategoryIcon(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalCategory = formData.category;


            if (isNewCategory) {
                if (!newCategoryName || !newCategoryIcon) {
                    showToast("Please provide category name and icon.", "error");
                    setLoading(false);
                    return;
                }

                const catData = new FormData();
                catData.append('name', newCategoryName);
                catData.append('displayName', newCategoryName);
                catData.append('icon', newCategoryIcon);

                const catResponse = await fetch('https://bakery-backend-kt9m.onrender.com/api/categories/upload', {
                    method: 'POST',
                    body: catData
                });

                if (!catResponse.ok) throw new Error("Failed to create category");

                const catResult = await catResponse.json();
                finalCategory = catResult.category.name;
            }

            let response;


            if (isEditMode) {

                const productData = {
                    name: formData.name,
                    description: formData.description,
                    ingredients: formData.ingredients,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    category: finalCategory,
                    imageUrl: formData.imageUrl
                };

                response = await fetch(`https://bakery-backend-kt9m.onrender.com/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            } else {

                const data = new FormData();
                if (imageFile) {
                    data.append('image', imageFile);
                }


                data.append('name', formData.name);
                data.append('description', formData.description);
                data.append('ingredients', formData.ingredients);
                data.append('price', formData.price);
                data.append('stock', formData.stock);
                data.append('category', finalCategory);
                data.append('imageUrl', formData.imageUrl);

                response = await fetch('https://bakery-backend-kt9m.onrender.com/api/products/upload', {
                    method: 'POST',
                    body: data,
                });
            }

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
                { }
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

                        { }
                        <div className="animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                            <label className="block text-gray-700 font-bold mb-2">Product Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 transition-all duration-300 hover:border-accent-1"
                            />
                        </div>

                        { }
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                name="description" required rows="3"
                                value={formData.description} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                            />
                        </div>

                        { }
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Ingredients</label>
                            <textarea
                                name="ingredients" required rows="2"
                                value={formData.ingredients} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            { }
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Price (RM)</label>
                                <input
                                    type="number" step="0.01" name="price" required
                                    value={formData.price} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                                />
                            </div>

                            { }
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
                                <input
                                    type="number" name="stock" required
                                    value={formData.stock} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1"
                                />
                            </div>
                        </div>

                        { }
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 bg-white mb-4"
                            >
                                {categories.map(cat => (
                                    <option key={cat.category_id || cat.name} value={cat.name}>{cat.display_name || cat.name}</option>
                                ))}
                                <option value="NEW">➕ Add New Category</option>
                            </select>

                            { }
                            {isNewCategory && (
                                <div className="space-y-4 animate-slideUp">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">New Category Name</label>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="e.g., Donuts"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 transition-all duration-300 hover:border-accent-1"
                                            required={isNewCategory}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Category Icon</label>
                                        <div className="flex items-center gap-4 p-2 border rounded-lg bg-white">
                                            <label
                                                htmlFor="cat-icon-upload"
                                                className="btn btn-primary text-text-light py-3 px-6 rounded-lg font-bold hover:bg-accent-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                            >
                                                Choose Image
                                            </label>
                                            <input
                                                id="cat-icon-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleIconChange}
                                                className="hidden"
                                                required={isNewCategory}
                                            />
                                            <span className="text-gray-600 text-sm italic overflow-hidden text-ellipsis whitespace-nowrap">
                                                {newCategoryIcon ? newCategoryIcon.name : "No file chosen"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Upload a small icon (PNG/JPG)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        { }
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Select Product Image</label>
                            <div className="flex items-center gap-4 p-2 border rounded-lg bg-white">
                                <label
                                    htmlFor="file-upload"
                                    className="btn btn-primary text-text-light py-3 px-6 rounded-lg font-bold hover:bg-accent-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                >
                                    Choose Image
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <span className="text-gray-600 text-sm italic overflow-hidden text-ellipsis whitespace-nowrap">
                                    {imageFile ? imageFile.name : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        { }
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
