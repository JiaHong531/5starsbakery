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
                {/* 1. Header */}
                <div className="flex-shrink-0 p-5 flex justify-between items-center border-b border-gray-100 bg-header-bg text-text-light">
                    <h2 className="text-2xl font-cursive">Your Cart</h2>
                    <div className="flex items-center gap-2">
                        {/* Backup Checkout Button (Visible in Header) */}
                        <button
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                            className="btn flex items-center gap-2 px-3 py-1.5 bg-accent-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-text-light text-sm font-bold hover:bg-accent-2 transition-colors mr-2"
                        >
                            Checkout <FaArrowRight size={12} />
                        </button>

                        <button
                            onClick={toggleCart}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="Close Cart"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. Scrollable Cart Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted">
                            <span className="text-6xl mb-4">🛒</span>
                            <p className="text-lg">Your cart is empty</p>
                            <button
                                onClick={toggleCart}
                                className="mt-4 text-accent-1 hover:underline underline-offset-4"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-main line-clamp-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <p className="text-accent-1 font-bold">RM{item.price.toFixed(2)}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-text-main transition-colors"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        <span className="font-medium w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-text-main transition-colors"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 3. Footer with Total */}
                <div className="flex-shrink-0 p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="text-2xl font-bold text-text-main">
                            RM{calculateTotalSafe().toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className="btn w-full py-3.5 bg-accent-1 disabled:bg-gray-300 disabled:cursor-not-allowed text-text-light font-bold font-sans shadow-lg hover:bg-accent-2 transition-colors active:scale-[0.98]"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
