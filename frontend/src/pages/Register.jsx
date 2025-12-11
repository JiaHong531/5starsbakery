import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate(); // Hook for redirection
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // 2. Map Frontend fields to Backend expected fields
            // Frontend: "phone", "birthday"
            // Backend: "phoneNumber", "birthdate"
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
                phoneNumber: formData.phone,    // Mapping here
                birthdate: formData.birthday    // Mapping here
            };

            // 3. Send to Java
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration Successful! Please Login.");
                navigate('/login'); // Redirect to login page
            } else {
                alert(data.message || "Registration failed.");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Server connection failed.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-8 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-[600px]">
                <h2 className="mb-6 text-header-bg text-center text-4xl font-bold font-serif">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block mb-1.5 font-bold font-sans">First Name</label>
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
                            <label className="block mb-1.5 font-bold font-sans">Last Name</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Username</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Email Address</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Confirm Password</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Gender</label>
                        <select
                            name="gender"
                            className="form-input"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1.5 font-bold font-sans">Phone Number</label>
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
                        <label className="block mb-1.5 font-bold font-sans">Birthday</label>
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
                            <span className="font-sans text-sm">I agree with the <Link to="/terms" className="text-header-bg font-bold underline">Terms and Conditions</Link> and <Link to="/privacy-policy" className="text-header-bg font-bold underline">Privacy Policy</Link></span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <button type="submit" className="btn btn-primary w-full font-serif font-bold text-base">
                            REGISTER
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-text-main text-sm font-sans">
                      Already have an account?&nbsp;<Link to="/login" className="hover:underline">
                        Click to Login
                      </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;