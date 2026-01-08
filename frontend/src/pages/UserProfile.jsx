import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backIcon from '../assets/back.png';
import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const UserProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password toggle
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'success' }); // type: 'success' or 'error'

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

    const showNotification = (title, message, type) => {
        setModalContent({ title, message, type });
        setShowModal(true);
    };

    const handleSave = async () => {
        let finalPassword = user.password;

        // Validation
        if (formData.password) {
            if (formData.password === user.password) {
                showNotification("Error", "New password cannot be the same as the old password!", "error");
                return;
            }
            if (formData.password !== formData.confirm_password) {
                showNotification("Error", "New password and Confirm Password do not match!", "error");
                return;
            }
            finalPassword = formData.password;
        }

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                login(updatedUser);
                setIsEditing(false);

                showNotification("Success!", "Profile updated successfully.", "success");

                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirm_password: ''
                }));
            } else {
                const errorData = await response.json();
                showNotification("Update Failed", errorData.message || 'Unknown Error', "error");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification("Network Error", "Could not connect to server. Please try again.", "error");
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
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
            setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="min-h-screen bg-bg-light p-8 animate-fadeIn">
            <div className="max-w-4xl mx-auto">
                {/* Header Section with Back Button - Animated */}
                <div className="flex items-center mb-8 gap-4 ml-20 animate-slideUp">
                    <button
                        onClick={() => navigate(-1)}
                        className="hover:opacity-80 transition-all duration-300 group"
                    >
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:-translate-x-2"
                            style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(12%) saturate(2250%) hue-rotate(320deg) brightness(97%) contrast(90%)", color: "#4E342E" }}
                        />
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-header-bg">My Profile</h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto animate-scaleIn">
                    <div className="space-y-6">

                        {/* Username Field (Read-only usually, but editable here if desired, let's keep editable for now based on prev code) */}
                        <div>
                            <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                                <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                                <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                            <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                            <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                                <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                                <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                            <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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
                                <label className="block text-text-main text-sm font-bold mb-2 font-serif">
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

                        {/* Action Buttons - Enhanced animations */}
                        <div className="flex gap-4 mt-8 pt-4 border-t animate-fadeIn">
                            {!isEditing ? (
                                <button
                                    onClick={toggleEdit}
                                    className="btn btn-primary px-6 py-2 text-text-light rounded-lg hover:bg-opacity-90 hover:bg-accent-2 transition-all duration-300 font-bold hover:scale-105 hover:shadow-lg active:scale-95"
                                >
                                    Edit Info
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="btn btn-primary px-6 py-2 text-text-light rounded-lg hover:bg-accent-2 transition-all duration-300 font-bold hover:scale-105 hover:shadow-lg active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={toggleEdit}
                                        className="btn px-6 py-2 bg-header-bg text-text-light rounded-lg hover:bg-red-600 transition-all duration-300 font-bold hover:scale-105 active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scaleIn text-center">

                        {/* Icon based on Type */}
                        <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${modalContent.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {modalContent.type === 'success' ? <FaCheckCircle size={28} /> : <FaExclamationCircle size={28} />}
                        </div>

                        <h3 className="text-xl font-bold text-text-main mb-2 font-serif">{modalContent.title}</h3>
                        <p className="text-text-main mb-6 text-sm">
                            {modalContent.message}
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className={`w-full py-2.5 rounded-lg font-bold text-text-main transition-colors ${modalContent.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
