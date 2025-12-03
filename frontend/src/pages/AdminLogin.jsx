import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
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
        console.log('Admin Login submitted:', formData);
        // Add admin login logic here
        // Check if user is admin
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[500px]">
                <h2 className="mb-6 text-header-bg text-center text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>Login as Administrator</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Username *</label>
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
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Password *</label>
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
                        <button type="submit" className="btn btn-primary w-full" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>
                            LOGIN
                        </button>
                    </div>
                </form>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <Link to="/login" className="text-text-main text-sm hover:underline" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Login as User</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
