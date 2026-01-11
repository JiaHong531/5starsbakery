import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    /**
     * Adds an item to the cart, respecting stock limits.
     * If item exists, increments quantity up to stock availability.
     */
    const addToCart = (product) => {
        setIsCartOpen(true);
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                // Check stock limit
                if (existingItem.quantity >= product.stock) {
                    return prevItems;
                }
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    /**
     * Updates item quantity directly.
     * Enforces bounds: 1 <= quantity <= stock.
     */
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId) {
                    // Ensure we don't exceed available stock
                    const limitedQuantity = Math.min(newQuantity, item.stock);
                    return { ...item, quantity: limitedQuantity };
                }
                return item;
            })
        );
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            getCartCount,
            getCartTotal,
            isCartOpen,
            toggleCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
