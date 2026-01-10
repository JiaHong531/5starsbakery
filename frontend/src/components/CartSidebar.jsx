import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash, FaMinus, FaPlus, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
    const {
        isCartOpen,
        toggleCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal
    } = useCart();

    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
        toggleCart();
    };

    // Calculate total safely
    const calculateTotalSafe = () => {
        try {
            return getCartTotal ? getCartTotal() : 0;
        } catch (e) {
            console.error("Error calculating total", e);
            return 0;
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={toggleCart}
            ></div>

            {/* Sidebar Panel - Using inset-y-0 + h-[100dvh] for max compatibility */}
            <div
                className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 z-[101] h-screen h-[100dvh] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* 1. Header - Animated */}
                <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-gray-100 bg-header-bg text-text-light">
                    <h2 className="text-2xl font-cursive animate-slideInLeft">Your Cart</h2>
                    <div className="flex items-center gap-2 animate-slideInRight">
                        {/* Backup Checkout Button (Visible in Header) */}
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className="btn flex items-center gap-2 px-3 py-1.5 bg-accent-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-text-light text-sm font-bold hover:bg-accent-2 transition-all duration-300 mr-2 hover:scale-105 active:scale-95 group"
                        >
                            Checkout <FaArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <button
                            onClick={toggleCart}
                            className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110"
                            aria-label="Close Cart"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. Scrollable Cart Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted animate-fadeIn">
                            <span className="text-6xl mb-4 animate-bounce-soft">🛒</span>
                            <p className="text-lg animate-slideUp">Your cart is empty</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 text-accent-1 hover:underline underline-offset-4 transition-all duration-300 hover:scale-105 animate-slideUp stagger-1"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slideUp"
                                style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                            >
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden img-zoom">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-300"
                                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-main line-clamp-1 transition-colors duration-300 hover:text-accent-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-all duration-300 p-1 hover:scale-125 hover:rotate-12"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <p className="text-accent-1 font-bold transition-all duration-300 hover:scale-105 origin-left">RM{item.price.toFixed(2)}</p>

                                    {/* Quantity Controls - Enhanced */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-accent-1 hover:text-white text-text-main transition-all duration-300 hover:scale-110 active:scale-95"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="font-medium w-4 text-center transition-all duration-300">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-accent-1 hover:text-white text-text-main transition-all duration-300 hover:scale-110 active:scale-95"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 3. Footer with Total - Enhanced */}
                <div className="flex-shrink-0 p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="text-2xl font-bold text-text-main transition-all duration-300 hover:scale-105 hover:text-accent-1">
                            RM{calculateTotalSafe().toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className="btn w-full py-3.5 bg-accent-1 disabled:bg-gray-300 disabled:cursor-not-allowed text-text-light font-bold font-sans shadow-lg hover:bg-accent-2 transition-all duration-300 active:scale-[0.98] hover:shadow-xl hover:scale-[1.02] animate-glow"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
