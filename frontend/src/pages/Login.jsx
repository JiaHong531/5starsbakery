import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', formData);
        // Add login logic here
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px]">
                <h2 className="mb-6 text-header-bg text-center text-2xl font-bold font-serif">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold font-sans">Username or email address *</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Password *</label>
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

                    <Link to="/register" className="text-text-main text-sm hover:underline font-sans">Don't have an account yet? Register Now</Link>
                    <Link to="/admin-login" className="text-text-main text-sm hover:underline font-sans">Login as Administrator</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
