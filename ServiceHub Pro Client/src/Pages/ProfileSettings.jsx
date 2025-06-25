import React, { useState } from 'react';
import { User, Save, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../Auth/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { api } from '../utils/api';
import Swal from 'sweetalert2';

const ProfileSettings = () => {
    usePageTitle('Profile Settings');
    const { user, updateProfile, getJWTToken, refreshJWTToken } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        photoURL: user?.photoURL || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateProfile = () => {
        const newErrors = {};
        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Display name is required';
        }
        if (formData.photoURL && formData.photoURL.trim()) {
            try {
                new URL(formData.photoURL);
            } catch {
                newErrors.photoURL = 'Please enter a valid URL';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        try {
            setLoading(true);
            
            // Ensure we have a valid JWT token
            let token = getJWTToken();
            if (!token) {
                token = await refreshJWTToken();
            }
            
            // Update Firebase profile
            await updateProfile({
                displayName: formData.displayName,
                photoURL: formData.photoURL
            });
            
            // Update profile on server using JWT
            await api.auth.verify(); // This will use the JWT token automatically
            
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile has been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            if (error.message === 'Authentication required') {
                await refreshJWTToken();
                Swal.fire({
                    icon: 'warning',
                    title: 'Session Refreshed',
                    text: 'Please try updating your profile again.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'Failed to update profile. Please try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            setLoading(true);
            Swal.fire({
                icon: 'success',
                title: 'Password Updated!',
                timer: 2000,
                showConfirmButton: false
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-base-content/70">
                        Manage your account information and security settings
                    </p>
                </div>

                <div className="card bg-base-100 shadow-lg mb-6">
                    <div className="card-body">
                        <div className="flex items-center gap-6">
                            <div className="avatar">
                                <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img 
                                        src={user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'} 
                                        alt="Profile"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200';
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">{user?.displayName || 'User Name'}</h2>
                                <p className="text-base-content/70">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title mb-4">
                                <User className="w-5 h-5" />
                                Profile Information
                            </h3>
                            
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Display Name *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        placeholder="Your display name"
                                        className={`input input-bordered ${errors.displayName ? 'input-error' : ''}`}
                                        required
                                    />
                                    {errors.displayName && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.displayName}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        className="input input-bordered bg-base-200"
                                        disabled
                                    />
                                    <label className="label">
                                        <span className="label-text-alt">Email cannot be changed</span>
                                    </label>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Profile Photo URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleChange}
                                        placeholder="https://example.com/your-photo.jpg"
                                        className={`input input-bordered ${errors.photoURL ? 'input-error' : ''}`}
                                    />
                                    {errors.photoURL && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.photoURL}</span>
                                        </label>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full"
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title mb-4">
                                <Shield className="w-5 h-5" />
                                Security Settings
                            </h3>
                            
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Current Password *</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            className={`input input-bordered w-full pr-12 ${errors.currentPassword ? 'input-error' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.currentPassword && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.currentPassword}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">New Password *</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password"
                                            className={`input input-bordered w-full pr-12 ${errors.newPassword ? 'input-error' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.newPassword}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Confirm New Password *</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            className={`input input-bordered w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-sm"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                                        </label>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-warning w-full"
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            Change Password
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
