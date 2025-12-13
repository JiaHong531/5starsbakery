import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backIcon from '../assets/back.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password toggle

    // Initialize with default values to avoid uncontrolled input warnings
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        gender: '',
        birthdate: '',
        password: '',
        confirm_password: '' // New field
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                first_name: user.firstName || '',
                last_name: user.lastName || '',
                phone_number: user.phoneNumber || '',
                gender: user.gender || '',
                birthdate: user.birthdate ? user.birthdate.split('T')[0] : '', // Ensure date format YYYY-MM-DD
                password: user.password || '',
                confirm_password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        let finalPassword = user.password; // Default to old password

        // If user typed a new password, validate it
        if (formData.password) {
            // Check if matches old password
            if (formData.password === user.password) {
                alert("New password cannot be the same as the old password!");
                return;
            }

            // Check if matches confirm password
            if (formData.password !== formData.confirm_password) {
                alert("New password and Confirm Password do not match!");
                return;
            }

            finalPassword = formData.password;
        }

        // Map form data (snake_case) to user object (camelCase)
        const updatedUser = {
            ...user,
            username: formData.username,
            email: formData.email,
            firstName: formData.first_name,
            lastName: formData.last_name,
            phoneNumber: formData.phone_number,
            gender: formData.gender,
            birthdate: formData.birthdate,
            password: finalPassword
        };

        try {
            const response = await fetch('http://localhost:8080/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                // Update local context only if backend update succeeded
                login(updatedUser);
                setIsEditing(false);
                alert("Profile and Database updated successfully!");

                // Clear password fields on success
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirm_password: ''
                }));
            } else {
                const errorData = await response.json();
                alert(`Failed to update profile: ${errorData.message || 'Unknown Error'}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel edits - reset form to current user data
            setFormData({
                username: user.username || '',
                email: user.email || '',
                first_name: user.firstName || '',
                last_name: user.lastName || '',
                phone_number: user.phoneNumber || '',
                gender: user.gender || '',
                birthdate: user.birthdate ? user.birthdate.split('T')[0] : '',
                password: user.password || '',
                confirm_password: ''
            });
        } else {
            // Entering Edit Mode - Clear password for "New Password" entry
            setFormData(prev => ({
                ...prev,
                password: '',
                confirm_password: ''
            }));
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="min-h-screen bg-bg-light p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section with Back Button */}
                <div className="flex items-center mb-8 gap-4">
                    <button
                        onClick={() => navigate(user && user.role === 'ADMIN' ? '/admin/dashboard' : '/')}
                        className="hover:opacity-80 transition-opacity"
                    >
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-header-bg">My Profile</h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
                    <div className="space-y-6">

                        {/* Username Field (Read-only usually, but editable here if desired, let's keep editable for now based on prev code) */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg active:outline-none focus:outline-none focus:ring-2 focus:ring-accent-1 transition-colors
                                    ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-transparent text-gray-500'}`}
                            />
                        </div>

                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg active:outline-none focus:outline-none focus:ring-2 focus:ring-accent-1 transition-colors
                                    ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-transparent text-gray-500'}`}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg active:outline-none focus:outline-none focus:ring-2 focus:ring-accent-1 transition-colors
                                    ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-transparent text-gray-500'}`}
                            />
                        </div>

                        {/* Gender & Birthdate */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                    Gender
                                </label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                    Birthdate
                                </label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                {isEditing ? "New Password" : "Password"}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-2 border rounded-lg active:outline-none focus:outline-none focus:ring-2 focus:ring-accent-1 transition-colors pr-10
                                        ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-100 border-transparent text-gray-500'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-accent-1"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field - Only when editing */}
                        {isEditing && (
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2 font-serif">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg active:outline-none focus:outline-none focus:ring-2 focus:ring-accent-1 transition-colors pr-10 bg-white border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-accent-1"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 pt-4 border-t">
                            {!isEditing ? (
                                <button
                                    onClick={toggleEdit}
                                    className="px-6 py-2 bg-header-bg text-white rounded-lg hover:bg-opacity-90 transition-colors font-bold"
                                >
                                    Edit Info
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={toggleEdit}
                                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
