import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        phone: '',
        birthday: '',
        agreeTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Register submitted:', formData);
        // Add register logic here
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-8 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[600px]">
                <h2 className="mb-6 text-header-bg text-center text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-input"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-input"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
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
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Gender *</label>
                        <select
                            name="gender"
                            className="form-input"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: '600', fontStyle: 'normal' }}>Birthday *</label>
                        <input
                            type="date"
                            name="birthday"
                            className="form-input"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                className="mr-2.5"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                            />
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>I agree with the <Link to="/terms" className="text-header-bg font-bold underline">Terms and Conditions</Link></span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <button type="submit" className="btn btn-primary w-full" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontOpticalSizing: 'auto', fontWeight: 'bold', fontStyle: 'normal' }}>
                            REGISTER
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-text-main text-sm hover:underline" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontOpticalSizing: 'auto', fontWeight: 'normal', fontStyle: 'normal' }}>Already have an account? Click to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
