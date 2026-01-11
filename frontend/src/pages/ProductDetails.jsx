import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { showConfirm, showToast } = useNotification();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`https://bakery-backend-kt9m.onrender.com/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load product details.");
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            const confirmLogin = await showConfirm("You need to login to add items to your cart. Go to login page?", "Login Required");
            if (confirmLogin) navigate("/login");
            return;
        }

        // Add item multiple times based on quantity or pass quantity to addToCart if supported
        // Assuming addToCart takes (product) and adds 1. 
        // We will call it 'quantity' times or update context to support quantity.
        // For now, simpler to specificy: the current addToCart logic in CartContext probably just adds 1.
        // Let's loop for now or just add 1 and let user adjust in cart.
        // Better UX: Just add 1 for now or update CartContext later. 
        // Let's stick to adding 1 'bundle' or simply repeated calls.
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`${quantity} x ${product.name} added to cart!`, "success");
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading details...</div>;
    if (error || !product) return <div className="text-center py-20 text-red-500 font-bold">{error || "Product not found"}</div>;

    return (
        <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                {/* Back Button - Animated */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center mb-8 hover:opacity-80 transition-all duration-300 group animate-slideInLeft"
                >
                    <img
                        src={backIcon}
                        alt="Back"
                        className="w-8 h-8 object-contain mr-2 transition-transform duration-300 group-hover:-translate-x-2"
                        style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                    />
                    <span className="font-serif font-bold text-header-bg text-3xl transition-all duration-300 group-hover:tracking-wide">
                        Back
                    </span>
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-slideUp card-interactive">
                    {/* Image Section - With zoom effect */}
                    <div className="md:w-1/2 relative bg-gray-100 img-zoom overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover min-h-[400px] transition-transform duration-500"
                        />
                        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-sm font-bold px-4 py-1 rounded-full shadow-sm text-gray-700 transition-all duration-300 hover:bg-accent-1 hover:text-white hover:scale-105">
                            {product.category}
                        </span>
                    </div>

                    {/* Details Section - Animated */}
                    <div className="md:w-1/2 p-10 flex flex-col justify-center">
                        <h1 className="text-4xl font-serif font-bold text-text-main mb-4 animate-slideUp">{product.name}</h1>
                        <p className="text-3xl font-bold text-accent-1 mb-6 animate-slideUp stagger-1 transition-all duration-300 hover:scale-105 origin-left">{`RM${product.price.toFixed(2)}`}</p>

                        <div className="prose prose-stone mb-8 animate-slideUp stagger-2">
                            <h3 className="text-lg font-bold text-text-main mb-2">Description</h3>
                            <p className="text-text-secondary leading-relaxed mb-4">{product.description}</p>

                            <h3 className="text-lg font-bold text-text-main mb-2">Ingredients / Allergens</h3>
                            <p className="text-text-secondary italic">{product.ingredients}</p>
                        </div>

                        {/* Admin Controls VS User Cart Controls */}
                        {user && user.role === 'ADMIN' ? (
                            <div className="flex gap-4 border-t pt-8 mt-6 animate-slideUp stagger-3">
                                <button
                                    onClick={() => navigate(`/admin/edit-product/${id}`)}
                                    className="btn flex-1 btn-primary text-text-light py-3 px-6 rounded-lg font-bold hover:bg-accent-2 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 hover:shadow-xl"
                                >
                                    Edit Product
                                </button>
                                <button
                                    onClick={async () => {
                                        const confirmed = await showConfirm("Are you sure you want to delete this product?", "Delete Product");
                                        if (confirmed) {
                                            try {
                                                const response = await fetch(`https://bakery-backend-kt9m.onrender.com/api/products/${id}`, { method: 'DELETE' });
                                                if (response.ok) {
                                                    showToast("Product deleted.", "success");
                                                    navigate('/admin/dashboard');
                                                } else {
                                                    showToast("Failed to delete product.", "error");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                showToast("Error deleting product.", "error");
                                            }
                                        }
                                    }}
                                    className="btn flex-1 bg-header-bg text-text-light py-3 px-6 rounded-lg font-bold hover:bg-red-600 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 hover:shadow-xl"
                                >
                                    Delete Product
                                </button>
                            </div>
                        ) : (
                            /* User Controls: Quantity & Add to Cart */
                            <div className="flex items-center gap-4 border-t pt-8 mt-6 animate-slideUp stagger-3">
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        className="px-4 py-2 hover:bg-accent-1 hover:text-white font-bold text-gray-600 transition-all duration-300"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >-</button>
                                    <span className="px-4 py-2 font-bold text-gray-800 bg-gray-50">{quantity}</span>
                                    <button
                                        className="px-4 py-2 hover:bg-accent-1 hover:text-white font-bold text-gray-600 transition-all duration-300"
                                        onClick={() => setQuantity(q => q + 1)}
                                    >+</button>
                                </div>

                                {product.stock > 0 ? (
                                    <button
                                        onClick={handleAddToCart}
                                        className="btn flex-1 btn-primary text-text-light py-3 px-6 rounded-lg font-bold hover:bg-accent-2 transition-all duration-300 shadow-md hover:scale-105 active:scale-95 hover:shadow-xl"
                                    >
                                        Add to Cart
                                    </button>
                                ) : (
                                    <button disabled className="flex-1 bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-bold cursor-not-allowed opacity-60">
                                        Sold Out
                                    </button>
                                )}
                            </div>
                        )}

                        <p className="text-xs text-gray-400 mt-4 text-center animate-fadeIn stagger-4">
                            {product.stock > 0 ? `${product.stock} items remaining` : "Restocking soon!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
