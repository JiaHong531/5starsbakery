import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaStar, FaTimes, FaFilter } from 'react-icons/fa';
import backIcon from '../assets/back.png';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { showConfirm, showToast } = useNotification();

    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [filterRating, setFilterRating] = useState(0);


    const renderStars = (avgRating) => {
        const stars = [];
        const fullStars = Math.floor(avgRating);
        const hasHalfStar = avgRating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300 text-xl">★</span>);
            }
        }
        return stars;
    };

    /**
     * Fetches product details and ratings in parallel.
     * Use Promise.all to reduce loading time.
     */
    useEffect(() => {
        Promise.all([
            fetch(`https://bakery-backend-kt9m.onrender.com/api/products/${id}`).then(res => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            }),
            fetch(`https://bakery-backend-kt9m.onrender.com/api/feedback/ratings/${id}`).then(res => res.ok ? res.json() : null).catch(() => null)
        ])
            .then(([productData, ratingData]) => {
                setProduct(productData);
                setRating(ratingData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load product details.");
                setLoading(false);
            });
    }, [id]);

    /**
     * Adds the selected quantity of product to cart.
     * Validates user authentication first.
     */
    const handleAddToCart = async () => {
        if (!user) {
            const confirmLogin = await showConfirm("You need to login to add items to your cart. Go to login page?", "Login Required", "Login");
            if (confirmLogin) navigate("/login");
            return;
        }

        // Add item multiple times based on quantity selected
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`${quantity} x ${product.name} added to cart!`, "success");
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading details...</div>;
    if (error || !product) return <div className="text-center py-20 text-red-500 font-bold">{error || "Product not found"}</div>;

    return (
        <>
            <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
                <div className="max-w-6xl mx-auto">
                    { }
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
                        { }
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

                        { }
                        <div className="md:w-1/2 p-10 flex flex-col justify-center">
                            <h1 className="text-4xl font-serif font-bold text-text-main mb-2 animate-slideUp">{product.name}</h1>
                            { }
                            {rating && rating.count > 0 && (
                                <div className="flex items-center gap-2 mb-4 animate-slideUp">
                                    <div className="flex">
                                        {renderStars(rating.avgRating)}
                                    </div>
                                    <span className="text-lg font-bold text-gray-700">
                                        {rating.avgRating.toFixed(1)}
                                    </span>
                                    <button
                                        onClick={() => {
                                            fetch(`https://bakery-backend-kt9m.onrender.com/api/feedback/reviews/${id}`)
                                                .then(res => res.json())
                                                .then(data => setReviews(data))
                                                .catch(() => setReviews([]));
                                            setShowReviewsModal(true);
                                        }}
                                        className="text-gray-400 hover:text-accent-1 text-sm transition-colors"
                                    >
                                        ({rating.count})
                                    </button>
                                </div>
                            )}
                            <p className="text-3xl font-bold text-accent-1 mb-6 animate-slideUp stagger-1 transition-all duration-300 hover:scale-105 origin-left">{`RM${product.price.toFixed(2)}`}</p>

                            <div className="prose prose-stone mb-8 animate-slideUp stagger-2">
                                <h3 className="text-lg font-bold text-text-main mb-2">Description</h3>
                                <p className="text-text-secondary leading-relaxed mb-4">{product.description}</p>

                                <h3 className="text-lg font-bold text-text-main mb-2">Ingredients / Allergens</h3>
                                <p className="text-text-secondary italic">{product.ingredients}</p>
                            </div>

                            { }
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

                                <div className="flex flex-col gap-4 border-t pt-8 mt-6 animate-slideUp stagger-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                className="px-4 py-2 hover:bg-accent-1 hover:text-white font-bold text-gray-600 transition-all duration-300"
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            >-</button>
                                            <span className="px-4 py-2 font-bold text-gray-800 bg-gray-50">{quantity}</span>
                                            <button
                                                className={`px-4 py-2 font-bold transition-all duration-300 ${quantity >= product.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:bg-accent-1 hover:text-white text-gray-600'}`}
                                                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                                disabled={quantity >= product.stock}
                                            >+</button>
                                        </div>
                                        {quantity >= product.stock && (
                                            <span className="text-sm text-orange-500 font-medium">Max stock reached</span>
                                        )}
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

            { }
            {showReviewsModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl animate-scaleIn">
                        { }
                        <div className="bg-header-bg text-white p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Customer Reviews</h3>
                            <button
                                onClick={() => { setShowReviewsModal(false); setFilterRating(0); }}
                                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        { }
                        <div className="p-4 border-b bg-gray-50 flex items-center gap-2 flex-wrap">
                            <FaFilter className="text-gray-500" />
                            <span className="text-sm text-gray-600 mr-2">Filter:</span>
                            {[0, 5, 4, 3, 2, 1].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(star)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filterRating === star
                                        ? 'bg-accent-1 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}
                                >
                                    {star === 0 ? 'All' : `${star}★`}
                                </button>
                            ))}
                        </div>

                        { }
                        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-4">
                            {reviews
                                .filter(r => filterRating === 0 || r.rating === filterRating)
                                .length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No reviews found</p>
                            ) : (
                                reviews
                                    .filter(r => filterRating === 0 || r.rating === filterRating)
                                    .map((review, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-header-bg">{review.username}</span>
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <FaStar
                                                                key={star}
                                                                className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                                                size={14}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                            )}
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetails;
