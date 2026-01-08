import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';
import { FaCalendarAlt, FaUser, FaBox, FaMoneyBillWave, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const AdminOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showConfirm, showToast } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null); // Track which order is updating

    useEffect(() => {
        // Security Check
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        fetch("http://localhost:8080/api/orders?all=true")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch orders");
                return res.json();
            })
            .then(data => {
                const orderList = Array.isArray(data) ? data : [];
                setOrders(orderList);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user, navigate]);

    const handleStatusChange = async (orderId, newStatus) => {
        const confirmed = await showConfirm(`Update order #${orderId} to ${newStatus}?`, "Update Order Status");
        if (!confirmed) return;

        setUpdating(orderId);
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state
                setOrders(prev => prev.map(o =>
                    o.orderId === orderId ? { ...o, status: newStatus } : o
                ));
                showToast(`Order #${orderId} updated to ${newStatus}`, "success");
            } else {
                showToast("Failed to update status", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error updating status", "error");
        } finally {
            setUpdating(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'PREPARING': 'bg-blue-100 text-blue-800',
            'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800',
            'COMPLETED': 'bg-green-100 text-green-800',
            'CANCELLED': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-500">Loading Orders...</div>;

    return (
        <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8 gap-4 animate-slideUp">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="hover:opacity-80 transition-all duration-300 group"
                    >
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:-translate-x-2"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-header-bg">Customer Orders</h1>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-slideUp stagger-1">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600">Order #</th>
                                    <th className="p-4 font-bold text-gray-600">Customer</th>
                                    <th className="p-4 font-bold text-gray-600">Date</th>
                                    <th className="p-4 font-bold text-gray-600">Items</th>
                                    <th className="p-4 font-bold text-gray-600">Total</th>
                                    <th className="p-4 font-bold text-gray-600">Status</th>
                                    <th className="p-4 font-bold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.orderId}
                                        className="hover:bg-accent-1/5 transition-all duration-300 animate-slideUp"
                                        style={{ animationDelay: `${index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                                    >
                                        <td className="p-4 font-mono text-gray-500">#{order.orderId}</td>
                                        <td className="p-4 flex items-center gap-2">
                                            <FaUser className="text-gray-300" />
                                            <span className="font-bold text-gray-700">{order.username || `User ${order.userId}`}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm flex items-center gap-2 text-gray-600">
                                                        <span className="font-bold text-gray-400">{item.quantity}x</span>
                                                        <span>{item.productName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-header-bg transition-all duration-300 hover:scale-105 hover:text-accent-1">
                                            RM{order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4">
                                            {updating === order.orderId ? (
                                                <FaSpinner className="animate-spin text-accent-1" />
                                            ) : (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                    className="bg-white border border-gray-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-accent-1 focus:border-transparent outline-none cursor-pointer"
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PREPARING">PREPARING</option>
                                                    <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {orders.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No orders found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
