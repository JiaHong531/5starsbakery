import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const OrderHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const userId = user.id || user.user_id || user.userId;

        fetch(`http://localhost:8080/api/orders?userId=${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then(data => {
                // Determine if data is array or wrapped
                const orderList = Array.isArray(data) ? data : [];
                setOrders(orderList);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user, navigate]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
            </div>
        );
    }

    return (
        <div className="container-custom py-10 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-serif font-bold text-header-bg mb-2">Order History</h2>
                <p className="text-gray-500 mb-8">Track your past indulgences.</p>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                        <FaBoxOpen className="mx-auto text-gray-300 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't tasted our delicious cakes yet!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-accent-1 text-white px-6 py-2 rounded-full hover:bg-accent-2 transition-colors font-bold"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-6 text-sm text-gray-600">
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400">Order Placed</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <FaCalendarAlt size={12} />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400">Total</span>
                                            <span className="font-medium flex items-center gap-1 text-header-bg">
                                                <FaMoneyBillWave size={12} />
                                                RM{order.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase font-bold text-gray-400">Order #</span>
                                            <span className="font-mono">{order.orderId}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.itemId} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img
                                                        src={item.imageUrl || 'https://placehold.co/100x100?text=Cake'}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-header-bg">{item.productName || `Product #${item.productId}`}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-accent-1">RM{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
