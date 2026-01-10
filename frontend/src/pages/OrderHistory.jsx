import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import backIcon from '../assets/back.png';
import { FaBoxOpen, FaCalendarAlt, FaMoneyBillWave, FaChevronDown, FaChevronUp, FaClock, FaStar, FaReceipt, FaTimes, FaCheck, FaCreditCard, FaWallet } from 'react-icons/fa';

/**
 * Status Progress Bar Component
 * Visualizes the order status steps.
 */
const StatusProgressBar = ({ status }) => {
    const statusSteps = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'];
    const getStatusIndex = (s) => (s === 'CANCELLED' ? -1 : statusSteps.indexOf(s));

    const getStatusLabel = (s) => {
        const labels = {
            'PENDING': 'Order Placed',
            'PREPARING': 'Preparing',
            'READY_FOR_PICKUP': 'Ready',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled'
        };
        return labels[s] || s;
    };

    const currentIndex = getStatusIndex(status);

    if (status === 'CANCELLED') {
        return (
            <div className="flex items-center justify-center py-3 bg-red-50 rounded-lg">
                <FaTimes className="text-red-500 mr-2" />
                <span className="text-red-600 font-bold">Order Cancelled</span>
            </div>
        );
    }

    return (
        <div className="py-4">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-gradient-to-r from-accent-1 to-accent-2 transition-all duration-500"
                        style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                </div>

                {statusSteps.map((step, index) => (
                    <div key={step} className="flex flex-col items-center z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentIndex
                            ? 'bg-accent-1 text-white shadow-md'
                            : 'bg-gray-200 text-gray-400'
                            }`}>
                            {index < currentIndex ? (
                                <FaCheck size={12} />
                            ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                            )}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${index <= currentIndex ? 'text-header-bg' : 'text-gray-400'
                            }`}>
                            {getStatusLabel(step)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OrderHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast, showConfirm } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState({});

    // Modals
    const [showReceiptModal, setShowReceiptModal] = useState(null); // Stores the full order object
    const [showReviewModal, setShowReviewModal] = useState(null);   // Stores the full order object for review

    // Reviews
    const [reviewData, setReviewData] = useState({}); // { itemId: { rating, comment } }
    const [reviews, setReviews] = useState({}); // Local storage for completed reviews { [orderId]: { ... } }

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const userId = user.id || user.user_id || user.userId;

        fetch(`https://bakery-backend-kt9m.onrender.com/api/orders?userId=${userId}`)
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

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const getStatusLabel = (status) => {
        const labels = {
            'PENDING': 'Order Placed',
            'PREPARING': 'Preparing',
            'READY_FOR_PICKUP': 'Ready',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled'
        };
        return labels[status] || status;
    };

    const handleCancelOrder = async (orderId) => {
        const confirmed = await showConfirm("Are you sure you want to cancel this order?", "Cancel Order");
        if (!confirmed) return;

        try {
            const response = await fetch(`https://bakery-backend-kt9m.onrender.com/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' })
            });

            if (response.ok) {
                setOrders(prev => prev.map(order =>
                    order.orderId === orderId ? { ...order, status: 'CANCELLED' } : order
                ));
                showToast("Order cancelled successfully", "success");
            } else {
                showToast("Failed to cancel order", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error cancelling order", "error");
        }
    };

    const handleSubmitReview = () => {
        if (showReviewModal) {
            // Save reviews for the specific order.
            // Currently saving to local state as a "Reviewed" flag + data
            setReviews(prev => ({
                ...prev,
                [showReviewModal.orderId]: {
                    items: reviewData,
                    rating: 5 // Default for the badge, or could calculate average
                }
            }));
            showToast("Thank you for your reviews! ⭐", "success");
            setShowReviewModal(null);
            setReviewData({});
        }
    };

    const printReceipt = () => {
        window.print();
    };

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
            </div>
        );
    }

    return (
        <>
            <div className="container-custom py-10 min-h-screen animate-fadeIn">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-8 gap-4 -ml-9 animate-slideUp">
                        <button
                            onClick={() => navigate(-1)}
                            className="hover:opacity-80 transition-all duration-300 group"
                        >
                            <img
                                src={backIcon}
                                alt="Back"
                                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:-translate-x-2"
                                style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                            />
                        </button>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-header-bg">Order History</h2>
                            <p className="text-text-secondary text-sm mt-1">Track your past indulgences.</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center animate-scaleIn">
                            <FaBoxOpen className="mx-auto text-gray-300 mb-4 animate-bounce-soft" size={64} />
                            <h3 className="text-xl font-bold text-gray-700 mb-2 animate-slideUp">No orders yet</h3>
                            <p className="text-gray-500 mb-6 animate-slideUp stagger-1">Looks like you haven't tasted our delicious cakes yet!</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-accent-1 text-white px-6 py-2 rounded-full hover:bg-accent-2 transition-all duration-300 font-bold hover:scale-105 hover:shadow-lg active:scale-95"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, index) => (
                                <div
                                    key={order.orderId}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 animate-slideUp"
                                    style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                                >
                                    {/* Order Header - Clickable */}
                                    <div
                                        className="bg-gray-50 px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleExpand(order.orderId)}
                                    >
                                        <div className="flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex gap-6 text-sm text-gray-600">
                                                <div>
                                                    <span className="block text-xs uppercase font-bold text-gray-400">Order #</span>
                                                    <span className="font-mono font-bold text-header-bg">{order.orderId}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs uppercase font-bold text-gray-400">Order Placed</span>
                                                    <span className="font-medium flex items-center gap-1">
                                                        <FaCalendarAlt size={12} />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-xs uppercase font-bold text-gray-400">Total</span>
                                                    <span className="font-bold flex items-center gap-1 text-accent-1">
                                                        <FaMoneyBillWave size={12} />
                                                        RM{order.totalAmount?.toFixed(2) || '0.00'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        order.status === 'READY_FOR_PICKUP' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                                {expandedOrders[order.orderId] ? <FaChevronUp /> : <FaChevronDown />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Content */}
                                    <div className={`transition-all duration-300 overflow-hidden ${expandedOrders[order.orderId] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        {/* Status Progress Bar */}
                                        <div className="px-6 pt-4">
                                            <StatusProgressBar status={order.status} />
                                        </div>

                                        {/* Pickup Info */}
                                        <div className="px-6 py-4 bg-amber-50 border-y border-amber-100 mx-6 my-4 rounded-lg">
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-amber-600" />
                                                    <div>
                                                        <span className="block text-xs text-amber-700 font-bold">Pickup Date</span>
                                                        <span className="font-medium text-amber-800">
                                                            {order.pickupDate || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-amber-600" />
                                                    <div>
                                                        <span className="block text-xs text-amber-700 font-bold">Pickup Time</span>
                                                        <span className="font-medium text-amber-800">
                                                            {order.pickupTime || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {order.paymentMethod === 'card' ? (
                                                        <FaCreditCard className="text-amber-600" />
                                                    ) : (
                                                        <FaWallet className="text-amber-600" />
                                                    )}
                                                    <div>
                                                        <span className="block text-xs text-amber-700 font-bold">Payment</span>
                                                        <span className="font-medium text-amber-800">
                                                            {order.paymentMethod === 'card' ? 'Credit Card' : 'Cash'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="px-6 pb-4">
                                            <h4 className="font-bold text-gray-700 mb-3">Order Items</h4>
                                            <div className="space-y-3">
                                                {order.items && order.items.map((item) => (
                                                    <div
                                                        key={item.itemId}
                                                        className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                                        onClick={() => navigate(`/product/${item.productId}`)}
                                                    >
                                                        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                                            <img
                                                                src={item.imageUrl || 'https://placehold.co/100x100?text=Cake'}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-header-bg hover:text-accent-1 transition-colors">
                                                                {item.productName || `Product #${item.productId}`}
                                                            </h5>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-accent-1">RM{item.price?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
                                            {/* Receipt Button - Always shown */}
                                            <button
                                                onClick={() => setShowReceiptModal(order)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium text-sm"
                                            >
                                                <FaReceipt size={14} />
                                                View Receipt
                                            </button>

                                            {/* Cancel Button - Only for PENDING */}
                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.orderId)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium text-sm"
                                                >
                                                    <FaTimes size={14} />
                                                    Cancel Order
                                                </button>
                                            )}

                                            {/* Review Button - Only for COMPLETED */}
                                            {order.status === 'COMPLETED' && !reviews[order.orderId] && (
                                                <button
                                                    onClick={() => setShowReviewModal(order)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-accent-1 text-white rounded-lg hover:bg-accent-2 transition-all duration-300 font-medium text-sm"
                                                >
                                                    <FaStar size={14} />
                                                    Leave Review
                                                </button>
                                            )}

                                            {/* Show if already reviewed */}
                                            {reviews[order.orderId] && (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                                                    <FaCheck size={14} />
                                                    Reviewed ({reviews[order.orderId].rating}★)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceiptModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn receipt-modal-backdrop">
                    <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn receipt-modal">
                        {/* Receipt Header */}
                        <div className="bg-header-bg text-white p-6 text-center receipt-header">
                            <h3 className="text-2xl font-serif font-bold">5 Stars Bakery</h3>
                            <p className="text-sm opacity-80 mt-1">123 Bakery Street, Pulau Pinang</p>
                            <p className="text-sm opacity-80">📞 +60 12-345 6789</p>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-6" id="receipt-content">
                            <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Order #</span>
                                    <span className="font-bold">{showReceiptModal.orderId}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-500">Date</span>
                                    <span>{new Date(showReceiptModal.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-bold text-accent-1">{getStatusLabel(showReceiptModal.status)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2 mb-4">
                                {showReceiptModal.items?.map(item => (
                                    <div key={item.itemId} className="flex justify-between text-sm">
                                        <span>{item.productName} x{item.quantity}</span>
                                        <span>RM{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-300 pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-accent-1">RM{showReceiptModal.totalAmount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>Payment Method</span>
                                    <span>{showReceiptModal.paymentMethod === 'card' ? 'Credit Card' : 'Cash'}</span>
                                </div>
                            </div>

                            {/* Pickup Info */}
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm">
                                <p className="font-bold text-amber-800">📅 Pickup: {showReceiptModal.pickupDate} at {showReceiptModal.pickupTime}</p>
                            </div>

                            {/* Refund Info for Cancelled Orders */}
                            {showReceiptModal.status === 'CANCELLED' && (
                                <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm border border-red-200">
                                    <p className="font-bold text-red-700 mb-1">❌ Order Cancelled</p>
                                    {showReceiptModal.paymentMethod === 'card' ? (
                                        <div className="text-red-600">
                                            <p className="flex justify-between">
                                                <span>Refund Method:</span>
                                                <span className="font-bold">Auto Bank Refund</span>
                                            </p>
                                            <p className="text-xs mt-1 text-red-500 italic">
                                                Refund will be processed within 5-7 business days
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-red-600">
                                            <span>Refund: </span>
                                            <span className="font-bold">No Refund Needed</span>
                                            <span className="text-xs block mt-1 text-red-500 italic">
                                                (Cash payment was not collected)
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}

                            <p className="text-center text-gray-400 text-xs mt-6">Thank you for your order! 🎂</p>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-4 bg-gray-50 border-t flex gap-3 no-print">
                            <button
                                onClick={() => setShowReceiptModal(null)}
                                className="flex-1 py-2 bg-header-bg text-text-light rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button
                                onClick={printReceipt}
                                className="flex-1 py-2 bg-accent-1 text-text-light rounded-lg hover:bg-accent-2 transition-colors font-medium"
                            >
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scaleIn">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-header-bg mb-2">Rate your Items</h3>
                            <p className="text-sm text-gray-500 mb-6">Tell us what you thought of your treats!</p>

                            <div className="space-y-6">
                                {showReviewModal.items?.map((item) => (
                                    <div key={item.itemId} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.imageUrl || 'https://placehold.co/100x100?text=Cake'}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-header-bg">{item.productName}</h4>
                                                <p className="text-xs text-gray-500">RM{item.price?.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Star Rating for Item */}
                                        <div className="mb-3">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setReviewData(prev => ({
                                                            ...prev,
                                                            [item.itemId]: { ...prev[item.itemId], rating: star }
                                                        }))}
                                                        className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <FaStar
                                                            className={star <= (reviewData[item.itemId]?.rating || 0)
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                            }
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comment for Item */}
                                        <textarea
                                            value={reviewData[item.itemId]?.comment || ''}
                                            onChange={(e) => setReviewData(prev => ({
                                                ...prev,
                                                [item.itemId]: { ...prev[item.itemId], comment: e.target.value }
                                            }))}
                                            placeholder="How was it?"
                                            className="w-full p-2 text-sm border rounded-lg focus:ring-1 focus:ring-accent-1 outline-none resize-none h-20 bg-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-4 bg-gray-50 border-t flex gap-3 sticky bottom-0 z-10">
                            <button
                                onClick={() => {
                                    setShowReviewModal(null);
                                    setReviewData({});
                                }}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="flex-1 py-2 bg-accent-1 text-white rounded-lg hover:bg-accent-2 transition-colors font-medium shadow-md"
                            >
                                Submit Reviews
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderHistory;