import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';
import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';

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

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    useEffect(() => {
        // Fetch product details
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

        // Fetch reviews for this product
        fetch(`https://bakery-backend-kt9m.onrender.com/api/feedback/${id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || 0);
                setReviewCount(data.reviewCount || 0);
            })
            .catch(err => {
                console.error("Failed to load reviews:", err);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            const confirmLogin = await showConfirm("You need to login to add items to your cart. Go to login page?", "Login Required");
            if (confirmLogin) navigate("/login");
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`${quantity} x ${product.name} added to cart!`, "success");
    };

    // Helper to render star rating
    const renderStars = (rating, size = 16) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                        key={star}
                        size={size}
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
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
                        <h1 className="text-4xl font-serif font-bold text-text-main mb-2 animate-slideUp">{product.name}</h1>

                        {/* Rating Summary */}
                        {reviewCount > 0 && (
                            <div className="flex items-center gap-2 mb-4 animate-slideUp">
                                {renderStars(Math.round(averageRating))}
                                <span className="text-sm text-gray-600">
                                    {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                                </span>
                            </div>
                        )}

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

                {/* Reviews Section */}
                <div className="mt-10 bg-white rounded-xl shadow-lg p-8 animate-slideUp">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-serif font-bold text-header-bg">
                            Customer Reviews
                        </h2>
                        {reviewCount > 0 && (
                            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                                <span className="text-2xl font-bold text-amber-600">{averageRating.toFixed(1)}</span>
                                {renderStars(Math.round(averageRating), 20)}
                                <span className="text-sm text-gray-500">({reviewCount})</span>
                            </div>
                        )}
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <FaStar size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No reviews yet</p>
                            <p className="text-sm">Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <div
                                    key={review.feedbackId || index}
                                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent-1/20 rounded-full flex items-center justify-center">
                                                <FaUser className="text-accent-1" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-main">{review.reviewerName}</p>
                                                <div className="flex items-center gap-2">
                                                    {renderStars(review.rating, 14)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400 gap-1">
                                            <FaCalendarAlt size={10} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm ml-13 pl-13">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

