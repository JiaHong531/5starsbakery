import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Context

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // <--- Get login from Context
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://bakery-backend-kt9m.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const user = await response.json();

                // 🛑 SECURITY CHECK: Is this user actually an ADMIN?
                if (user.role === 'ADMIN') {
                    login(user); // <--- Use Context!
                    navigate('/admin/dashboard'); // Go to Admin Panel
                } else {
                    // It is a valid user, but NOT an admin
                    setError('Access Denied. You are not an Administrator.');
                }
            } else {
                setError('Invalid credentials.');
            }
        } catch (err) {
            console.error(err);
            setError('Server connection failed.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px] animate-scaleIn">
                <h2 className="mb-6 text-header-bg text-center text-4xl font-bold font-serif animate-slideUp">Login as Administrator</h2>

                {/* Error Display - Animated */}
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center text-sm animate-wiggle">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <label className="block mb-1.5 font-bold font-sans">Username or Email Address</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 animate-slideUp stagger-2" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <label className="block mb-1.5 font-bold font-sans">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 animate-slideUp stagger-3" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <button type="submit" className="btn btn-primary w-full font-sans font-bold text-text-light hover:bg-accent-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
                            LOGIN
                        </button>
                    </div>
                </form>
                <div className="mt-6 flex flex-col items-center gap-2 animate-fadeIn stagger-4">
                    <Link to="/login" className="text-text-main text-sm hover:underline font-sans transition-all duration-300 hover:text-accent-1">Login as User</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;