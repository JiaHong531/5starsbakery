import React from 'react';
import { FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
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

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            ></div>

            {/* Sidebar Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">

                {/* Header */}
                <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-header-bg text-text-light">
                    <h2 className="text-2xl font-cursive">Your Cart</h2>
                    <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Cart Items Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                                {/* Image Placeholder (Assuming we might not have images for items in context yet if not passed, but Product object usually has them) */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    {/* Use item.image if available, otherwise placeholder logic could go here. 
                                         Using a standard image tag assuming item has image property from product. */}
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-main line-clamp-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <p className="text-accent-1 font-bold">${item.price}</p>

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

                {/* Footer with Total */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-text-muted">Subtotal</span>
                            <span className="text-2xl font-bold text-text-main">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <button className="w-full py-3.5 bg-accent-1 hover:bg-accent-2 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
