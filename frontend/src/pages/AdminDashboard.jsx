import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import editIcon from '../assets/edit.png';
import deleteIcon from '../assets/bin.png';
import addIcon from '../assets/add.png';

const AdminDashboard = () => {
    // 1. State for Data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Hooks
    const { searchQuery } = useSearch();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showConfirm, showToast } = useNotification();

    // 6. Floating Button Logic
    const buttonRef = React.useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('footer');
            if (!footer || !buttonRef.current) return;

            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if footer is inside the viewport
            if (footerRect.top < windowHeight) {
                // Determine overlapping height
                const visibleFooterHeight = windowHeight - footerRect.top;
                // Move button up by visible footer height + standard spacing (40px)
                buttonRef.current.style.bottom = `${40 + visibleFooterHeight}px`;
            } else {
                // Reset to default position
                buttonRef.current.style.bottom = '40px';
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

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

    // 3. Loading & Error States
    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading fresh cakes... 🧁</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    // 4. Filter Products
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle Delete
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent card navigation
        const confirmed = await showConfirm("Are you sure you want to delete this product?", "Delete Product");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id));
                    showToast("Product deleted successfully!", "success");
                } else {
                    showToast("Failed to delete product.", "error");
                }
            } catch (err) {
                console.error(err);
                showToast("Error deleting product.", "error");
            }
        }
    };



    return (
        <div className="container-custom py-10 flex gap-8 relative min-h-screen">
            {/* Sidebar */}
            <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Main Content Area */}
            <div className="flex-1 pb-16">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-serif font-bold mb-3 text-text-main">Admin Dashboard</h2>
                    <p className="text-text-secondary mb-6">Manage your bakery inventory.</p>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="btn px-6 py-2 bg-accent-1 text-text-light font-bold rounded-full shadow-lg hover:bg-accent-2 transition-colors"
                    >
                        View Customer Orders
                    </button>
                </div>

                {/* Product Grid - Responsive: 1 col mobile, 3 cols desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((cake) => (

                        /* Card Container - Click to view details */
                        <div
                            key={cake.id}
                            onClick={() => navigate(`/product/${cake.id}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col cursor-pointer relative"
                        >

                            {/* Image Area */}
                            <div className="h-64 overflow-hidden relative group">
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
                            <div className="p-5 flex flex-col flex-grow relative">

                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold mb-2 text-text-main cursor-pointer hover:text-accent-1 transition-colors">{cake.name}</h3>
                                    <p className="text-text-secondary text-sm line-clamp-2">{cake.description}</p>
                                    <p className="text-xs text-text-main/75 italic mt-2">Contains: {cake.ingredients}</p>

                                    {/* Stock below Ingredients */}
                                    <div className="mt-2 text-text-main/50 text-xs">
                                        Stock: {cake.stock}
                                    </div>
                                </div>

                                {/* Footer Area: Price & Action Icons */}
                                <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-100">
                                    <span className="text-2xl font-bold text-text-main">
                                        RM{cake.price.toFixed(2)}
                                    </span>

                                    {/* Action Icons: Edit & Delete (moved to bottom right) */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/edit-product/${cake.id}`);
                                            }}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <img src={editIcon} alt="Edit" className="w-6 h-6" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(cake.id, e)}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <img src={deleteIcon} alt="Delete" className="w-6 h-6" style={{ filter: "brightness(0) saturate(100%) invert(29%) sepia(86%) saturate(2421%) hue-rotate(352deg) brightness(101%) contrast(105%)" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Floating Add Button - Fixed Viewport Position (z-40 to stay under footer z-50) */}
            <div ref={buttonRef} className="fixed right-10 z-40 transition-all duration-75" style={{ bottom: '40px' }}>
                <button
                    onClick={() => navigate('/admin/add-product')}
                    className="hover:scale-110 transition-transform shadow-lg rounded-full"
                >
                    <img src={addIcon} alt="Add Product" className="w-16 h-16" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }} />
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
