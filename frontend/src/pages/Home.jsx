import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    // 1. State for Data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Hooks
    const { searchQuery } = useSearch();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth(); // Use the context instead of localStorage

    // 2. Fetch from Java Backend
    useEffect(() => {
        fetch("http://localhost:8080/api/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to connect to Backend");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load menu. Is Backend running?");
                setLoading(false);
            });
    }, []);

    // --- NEW LOGIC: SECURITY CHECK ---
    const handleAddToCart = (product) => {

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        // If logged in, proceed normally
        addToCart(product);
    };
    // ---------------------------------

    // 3. Loading & Error States
    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading fresh cakes... 🧁</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    // 4. Filter Products
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // 5. The UI
    return (
        <div className="container-custom py-10 flex gap-8">
            {/* Sidebar */}
            <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Main Content Area */}
            <div className="flex-1">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-serif font-bold mb-3 text-text-main">Our Fresh Menu</h2>
                    <p className="text-gray-500">Baked with love, served with code.</p>
                </div>

                {/* Product Grid - Responsive: 1 col mobile, 3 cols desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((cake) => (

                        /* Card Container */
                        <div key={cake.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">

                            {/* Image Area - Clickable to go to Details */}
                            <div
                                onClick={() => navigate(`/product/${cake.id}`)}
                                className="h-64 overflow-hidden relative group cursor-pointer"
                            >
                                <img
                                    src={cake.imageUrl}
                                    alt={cake.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Category Badge */}
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-700">
                                    {cake.category}
                                </span>
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex-grow">
                                    <h3
                                        onClick={() => navigate(`/product/${cake.id}`)}
                                        className="text-xl font-bold mb-2 text-gray-800 cursor-pointer hover:text-accent-1 transition-colors"
                                    >
                                        {cake.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{cake.description}</p>
                                    <p className="text-xs text-gray-400 italic mt-2">Contains: {cake.ingredients}</p>
                                </div>

                                {/* Footer Area: Price & Button */}
                                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                                    <span className="text-2xl font-bold text-text-main">
                                        RM{cake.price.toFixed(2)}
                                    </span>

                                    {/* Logic: Check Stock */}
                                    {cake.stock > 0 ? (
                                        <button
                                            onClick={() => handleAddToCart(cake)}
                                            className="btn btn-primary shadow-md"
                                        >
                                            Add to Cart
                                        </button>
                                    ) : (
                                        <button disabled className="px-5 py-2.5 rounded font-bold bg-gray-300 text-gray-500 cursor-not-allowed">
                                            Sold Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    {/* Simple toast message */}
                    <div className="bg-white p-6 rounded-lg w-80 text-center">
                        <h3 className="text-xl font-bold mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Please login to add items to cart.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="btn bg-gray-300 text-text-main font-bold font-sans px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn bg-accent-1 text-text-main font-bold font-sans px-4 py-2 rounded"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;