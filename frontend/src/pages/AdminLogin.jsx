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
            const response = await fetch('http://localhost:8080/api/login', {
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
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px]">
                <h2 className="mb-6 text-header-bg text-center text-4xl font-bold font-serif">Login as Administrator</h2>

                {/* Error Display */}
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <button type="submit" className="btn btn-primary w-full font-sans font-bold text-base">
                            LOGIN
                        </button>
                    </div>
                </form>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <Link to="/login" className="text-text-main text-sm hover:underline font-sans">Login as User</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;