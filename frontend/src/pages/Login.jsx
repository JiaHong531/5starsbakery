import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Context

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // <--- Get the login function from Context

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
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
            const payload = {
                username: formData.usernameOrEmail,
                password: formData.password
            };

            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const user = await response.json();

                // ------------------------------------------------
                // CRITICAL CHANGE: Use Context instead of localStorage
                // ------------------------------------------------
                login(user);
                // This triggers the Header to update INSTANTLY!

                if (user.role === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('Invalid username, email, or password.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Is Backend running?');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px]">
                <h2 className="mb-6 text-header-bg text-center text-4xl font-bold font-serif">Login</h2>

                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold font-sans">Username or email address</label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            className="form-input"
                            value={formData.usernameOrEmail}
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
                        <button type="submit" className="btn btn-primary w-full font-serif font-bold text-base">
                            LOGIN
                        </button>
                    </div>
                </form>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-text-main text-sm font-sans">
                      Don't have an account yet?&nbsp;
                      <Link to="/register" className="hover:underline">
                        Register Now
                      </Link>
                    </p>
                    <Link to="/admin-login" className="text-text-main text-sm hover:underline font-sans">Login as Administrator</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;