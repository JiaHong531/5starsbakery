import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/back.png';

const Checkout = () => {
    const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useNotification();
    const navigate = useNavigate();


    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [pickup, setPickup] = useState({
        date: getTodayDate(),
        time: ''
    });


    const [paymentMethod, setPaymentMethod] = useState('card');

    // Debugging payment method selection
    React.useEffect(() => {
        console.log("💳 Current Payment Method:", paymentMethod);
    }, [paymentMethod]);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [cardErrors, setCardErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);


    const timeSlots = [
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM'
    ];

    const getAvailableTimeSlots = () => {
        const today = getTodayDate();
        if (pickup.date !== today) return timeSlots;

        const currentHour = new Date().getHours();

        return timeSlots.filter(slot => {
            let [hourStr, part] = slot.split(' ');
            let hour = parseInt(hourStr.split(':')[0], 10);

            if (part === 'PM' && hour !== 12) hour += 12;
            if (part === 'AM' && hour === 12) hour = 0;

            return hour > currentHour;
        });
    };


    const getCardType = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        return null;
    };


    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.substring(0, 16);
        const groups = limited.match(/.{1,4}/g);
        return groups ? groups.join(' ') : '';
    };


    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length === 0) return '';

        let month = '';
        let year = '';


        if (cleaned.length >= 1) {
            const firstDigit = parseInt(cleaned[0], 10);


            if (firstDigit >= 2 && firstDigit <= 9) {
                month = '0' + cleaned[0];
                year = cleaned.substring(1, 3);
            }

            else if (cleaned.length >= 2) {
                const twoDigits = cleaned.substring(0, 2);
                const monthNum = parseInt(twoDigits, 10);


                if (monthNum >= 1 && monthNum <= 12) {
                    month = twoDigits;
                } else if (monthNum > 12) {

                    month = '0' + cleaned[0];
                    year = cleaned.substring(1, 3);
                } else {
                    month = twoDigits;
                }

                if (!year) {
                    year = cleaned.substring(2, 4);
                }
            } else {

                month = cleaned[0];
            }
        }


        if (year) {
            return month + '/' + year;
        } else if (month.length === 2) {
            return month + '/';
        }
        return month;
    };


    const isValidCardNumber = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.length !== 16) return false;

        let sum = 0;
        let isEven = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i], 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    };


    const isValidExpiry = (expiry) => {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

        const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
        if (month < 1 || month > 12) return false;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPickup(prev => {
            const newState = { ...prev, [name]: value };

            // If date changed, re-validate the current time
            if (name === 'date') {
                const today = getTodayDate();
                // If the new date is today, check if the previously selected time is still valid
                if (value === today) {
                    const availableSlotsForToday = getAvailableTimeSlots(); // This will use the *new* date (value) implicitly
                    // Check if the previously selected time is still in the available slots
                    if (prev.time && !availableSlotsForToday.includes(prev.time)) {
                        newState.time = ''; // Clear time if it's no longer valid for today
                    }
                } else {
                    // If date changed to a future date, all times are valid, no need to clear unless it was cleared for today
                    // But we don't need to explicitly set it if it was already valid.
                }
            }
            return newState;
        });
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardDetails({ ...cardDetails, [name]: formattedValue });


        if (cardErrors[name]) {
            setCardErrors({ ...cardErrors, [name]: '' });
        }
    };

    /**
     * Validates credit card inputs using Luhn algorithm (checksum) and expiry checks.
     */
    const validateCardDetails = () => {
        const errors = {};

        if (!cardDetails.cardNumber) {
            errors.cardNumber = 'Card number is required';
        } else if (!isValidCardNumber(cardDetails.cardNumber)) {
            errors.cardNumber = 'Invalid card number';
        }

        if (!cardDetails.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        } else if (!isValidExpiry(cardDetails.expiryDate)) {
            errors.expiryDate = 'Invalid or expired date';
        }

        if (!cardDetails.cvv) {
            errors.cvv = 'CVV is required';
        } else if (cardDetails.cvv.length !== 3) {
            errors.cvv = 'CVV must be 3 digits';
        }

        if (!cardDetails.cardholderName) {
            errors.cardholderName = 'Cardholder name is required';
        } else if (cardDetails.cardholderName.length < 3) {
            errors.cardholderName = 'Name must be at least 3 characters';
        }

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Handles order submission.
     * 1. Validates cart, user, pickup info.
     * 2. If Card payment, validates card details and simulates processing.
     * 3. Sends POST request to backend API.
     */
    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            showToast("Your cart is empty!", "error");
            return;
        }

        if (!user) {
            showToast("You must be logged in to place an order.", "error");
            navigate('/login');
            return;
        }

        if (!pickup.date || !pickup.time) {
            showToast("Please select pickup date and time.", "error");
            return;
        }


        if (paymentMethod === 'card') {
            if (!validateCardDetails()) {
                showToast("Please fill in all card details correctly.", "error");
                return;
            }
        }


        if (paymentMethod === 'card') {
            setIsProcessing(true);
            await new Promise(resolve => setTimeout(resolve, 2500));
            setIsProcessing(false);
        }

        const orderData = {
            userId: user.user_id || user.id || user.userId,
            totalAmount: getCartTotal(),
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            pickupDate: pickup.date,
            pickupTime: pickup.time,
            paymentMethod: paymentMethod
        };

        try {
            const response = await fetch('https://bakery-backend-kt9m.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const paymentMsg = paymentMethod === 'cash'
                    ? "Order Placed! Pay RM" + getCartTotal().toFixed(2) + " when you collect."
                    : "Payment Successful! Order Placed!";
                showToast(paymentMsg, "success");
                if (clearCart) clearCart();
                navigate('/');
            } else {
                const err = await response.json();
                showToast(`Failed to place order: ${err.message || 'Unknown error'}`, "error");
            }
        } catch (error) {
            console.error("Order error:", error);
            showToast("Server error processing order.", "error");
        }
    };

    const cardType = getCardType(cardDetails.cardNumber);

    return (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    { }
                    <div className="bg-white p-8 rounded-lg shadow-md animate-slideInLeft">
                        <h2 className="text-3xl font-serif font-bold text-header-bg mb-6 animate-slideUp">Checkout</h2>
                        <form onSubmit={handlePlaceOrder}>

                            { }
                            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200 animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                                <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                    <span className="text-xl">📍</span> Pickup Location
                                </h3>
                                <p className="text-amber-700 font-medium">5 Stars Bakery</p>
                                <p className="text-amber-600 text-sm">123 Bakery Street, Pulau Pinang</p>
                                <p className="text-amber-600 text-sm mt-1">📞 +60 12-345 6789</p>
                                <p className="text-amber-500 text-xs mt-2 italic">Operating Hours: 10:00 AM - 7:00 PM (Daily)</p>
                            </div>

                            { }
                            <div className="mb-4 animate-slideUp stagger-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                                <label className="block text-gray-700 font-bold mb-2">📅 Pickup Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={pickup.date}
                                    onChange={handleChange}
                                    min={getTodayDate()}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 hover:border-accent-1 cursor-pointer"
                                    required
                                />
                                <p className="text-gray-500 text-xs mt-1">* Pickup available from today onwards</p>
                            </div>

                            { }
                            <div className="mb-6 animate-slideUp stagger-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                                <label className="block text-gray-700 font-bold mb-2">🕐 Pickup Time</label>
                                <select
                                    name="time"
                                    value={pickup.time}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 hover:border-accent-1 cursor-pointer bg-white"
                                    required
                                >
                                    <option value="">Select Pickup Time</option>
                                    {getAvailableTimeSlots().length > 0 ? (
                                        getAvailableTimeSlots().map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))
                                    ) : (
                                        <option disabled>No available slots for today</option>
                                    )}
                                </select>
                            </div>

                            { }
                            <div className="mb-6 animate-slideUp stagger-4" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                                <label className="block text-gray-700 font-bold mb-3">💳 Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    { }
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${paymentMethod === 'cash'
                                            ? 'border-accent-1 bg-gradient-to-br from-accent-1/10 to-accent-2/10 shadow-md'
                                            : 'border-gray-200 hover:border-accent-1/50 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-3xl">💵</span>
                                        <span className="font-bold text-header-bg">Cash</span>
                                        <span className="text-xs text-gray-500">Pay at pickup</span>
                                    </button>

                                    { }
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${paymentMethod === 'card'
                                            ? 'border-accent-1 bg-gradient-to-br from-accent-1/10 to-accent-2/10 shadow-md'
                                            : 'border-gray-200 hover:border-accent-1/50 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-3xl">💳</span>
                                        <span className="font-bold text-header-bg">Credit Card</span>
                                        <span className="text-xs text-gray-500">Pay now</span>
                                    </button>
                                </div>
                            </div>

                            { }
                            {paymentMethod === 'cash' && (
                                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 animate-fadeIn">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <h4 className="font-bold text-green-800">Pay Cash at Pickup</h4>
                                            <p className="text-sm text-green-600 mt-1">
                                                Simply pay <span className="font-bold">RM{getCartTotal().toFixed(2)}</span> in cash when you collect your order.
                                            </p>
                                            <p className="text-xs text-green-500 mt-2 italic">
                                                Please bring exact change if possible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card Payment Details */}
                            {paymentMethod === 'card' && (
                                <div className="mb-6 p-5 bg-gradient-to-br from-accent-1/5 to-accent-2/5 rounded-lg border border-accent-1/30 animate-fadeIn">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-header-bg flex items-center gap-2">
                                            <span>💳</span> Card Details
                                        </h4>
                                        {/* Card Type Indicators */}
                                        <div className="flex gap-2">
                                            <div className={`px-2 py-1 rounded text-xs font-bold transition-all ${cardType === 'visa' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                VISA
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-bold transition-all ${cardType === 'mastercard' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                MC
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mb-4">
                                        This is a demo. No real payment will be processed.
                                    </p>

                                    { }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={cardDetails.cardNumber}
                                            onChange={handleCardChange}
                                            placeholder="1234 5678 9012 3456"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 font-mono text-lg ${cardErrors.cardNumber ? 'border-red-400' : 'border-gray-300'
                                                }`}
                                        />
                                        {cardErrors.cardNumber && (
                                            <p className="text-red-500 text-xs mt-1">{cardErrors.cardNumber}</p>
                                        )}
                                    </div>

                                    { }
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={cardDetails.expiryDate}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 font-mono ${cardErrors.expiryDate ? 'border-red-400' : 'border-gray-300'
                                                    }`}
                                            />
                                            {cardErrors.expiryDate && (
                                                <p className="text-red-500 text-xs mt-1">{cardErrors.expiryDate}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={cardDetails.cvv}
                                                onChange={handleCardChange}
                                                placeholder="•••"
                                                maxLength={3}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 font-mono ${cardErrors.cvv ? 'border-red-400' : 'border-gray-300'
                                                    }`}
                                            />
                                            {cardErrors.cvv && (
                                                <p className="text-red-500 text-xs mt-1">{cardErrors.cvv}</p>
                                            )}
                                        </div>
                                    </div>

                                    { }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            name="cardholderName"
                                            value={cardDetails.cardholderName}
                                            onChange={handleCardChange}
                                            placeholder="Name on card"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-1 outline-none transition-all duration-300 uppercase ${cardErrors.cardholderName ? 'border-red-400' : 'border-gray-300'
                                                }`}
                                        />
                                        {cardErrors.cardholderName && (
                                            <p className="text-red-500 text-xs mt-1">{cardErrors.cardholderName}</p>
                                        )}
                                    </div>

                                    { }
                                    <div className="p-3 bg-white rounded-lg border border-accent-2/50 flex justify-between items-center">
                                        <span className="text-gray-600">Amount to Pay:</span>
                                        <span className="text-xl font-bold text-header-bg">RM{getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            { }
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`btn w-full py-3 font-bold rounded-lg transition-all duration-300 text-lg shadow-md ${isProcessing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-accent-1 text-text-light hover:bg-accent-2 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] animate-glow'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing Payment...
                                    </span>
                                ) : paymentMethod === 'cash' ? (
                                    `Place Order (Pay RM${getCartTotal().toFixed(2)} at Pickup)`
                                ) : (
                                    `Pay RM${getCartTotal().toFixed(2)} Now`
                                )}
                            </button>
                        </form>
                    </div>

                    { }
                    <div className="bg-white p-8 rounded-lg shadow-md h-fit animate-slideInRight">
                        <h2 className="text-3xl font-serif font-bold text-header-bg mb-6 animate-slideUp">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {cartItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-b pb-4 animate-slideUp hover:bg-gray-50 transition-colors duration-300 p-2 rounded-lg"
                                    style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden img-zoom">
                                            <img
                                                src={item.imageUrl || 'https://placehold.co/100?text=Cake'}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-300"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main hover:text-accent-1 transition-colors">{item.name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-accent-1 transition-all duration-300 hover:scale-110">RM{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 animate-fadeIn stagger-3">
                            <div className="flex justify-between text-text-main">
                                <span>Subtotal</span>
                                <span>RM{getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Pickup Method</span>
                                <span className="text-amber-600 font-medium">🏪 Self-Collect</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Payment</span>
                                <span className={`font-medium ${paymentMethod === 'cash' ? 'text-green-600' : 'text-blue-600'}`}>
                                    {paymentMethod === 'cash' ? '💵 Cash' : '💳 Credit Card'}
                                </span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-header-bg mt-4 pt-4 border-t transition-all duration-300 hover:scale-[1.02]">
                                <span>Total</span>
                                <span>RM{getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
