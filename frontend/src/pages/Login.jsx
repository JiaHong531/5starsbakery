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

                if (user.role === 'ADMIN') {
                    setError('Admins cannot login here. Please use the Admin Portal.');
                    return;
                }

                // ✅ SUCCESS (Customer Only)
                login(user);
                navigate('/');

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
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px] animate-scaleIn">
                <h2 className="mb-6 text-header-bg text-center text-4xl font-bold font-serif animate-slideUp">Login</h2>

                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center text-sm animate-wiggle">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 animate-slideUp stagger-1" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <label className="block mb-1.5 font-bold font-sans">Username or Email Address</label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            className="form-input"
                            value={formData.usernameOrEmail}
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
                    <p className="text-text-main text-sm font-sans">
                        Don't have an account yet?&nbsp;
                        <Link to="/register" className="hover:underline transition-all duration-300 hover:text-accent-1 font-bold">
                            Register Now
                        </Link>
                    </p>
                    <Link to="/admin-login" className="text-text-main text-sm hover:underline font-sans transition-all duration-300 hover:text-accent-1">Login as Administrator</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;