import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, getCartTotal, getCartCount, clearCart } = useCart(); // Assuming clearCart exists or will be added
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shipping, setShipping] = useState({
        address: '',
        city: '',
        zip: '',
        state: ''
    });

    const handleChange = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!user) {
            alert("You must be logged in to place an order.");
            navigate('/login');
            return;
        }

        const orderData = {
            userId: user.user_id || user.id || user.userId, // Try all common variants
            totalAmount: getCartTotal(),
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`
        };

        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                if (clearCart) clearCart(); // Reset cart using context if available
                navigate('/'); // Or navigate to Order History
            } else {
                const err = await response.json();
                alert(`Failed to place order: ${err.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Server error processing order.");
        }
    };

    return (
        <div className="min-h-screen bg-bg-light p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Shipping Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-serif font-bold text-header-bg mb-6">Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={shipping.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none"
                                required
                                placeholder="123 Bakery Lane"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shipping.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={shipping.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Zip Code</label>
                            <input
                                type="text"
                                name="zip"
                                value={shipping.zip}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none"
                                required
                            />
                        </div>

                        {/* Payment Mock */}
                        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                            <h3 className="font-bold text-gray-600 mb-2">Payment Information</h3>
                            <p className="text-sm text-gray-500 italic">This is a demo. No real payment will be processed.</p>
                            <div className="mt-2 text-gray-400">
                                💳 Card ending in **** 4242
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn w-full py-3 bg-accent-1 text-text-main font-bold rounded-lg   transition-colors text-lg shadow-md"
                        >
                            Place Order (RM{getCartTotal().toFixed(2)})
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-8 rounded-lg shadow-md h-fit">
                    <h2 className="text-3xl font-serif font-bold text-header-bg mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                        <img
                                            src={item.imageUrl || 'https://placehold.co/100?text=Cake'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-accent-1">RM{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-text-main">
                            <span>Subtotal</span>
                            <span>RM{getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-header-bg mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>RM{getCartTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
