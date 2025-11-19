import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    if (formData.name.length > 50) {
      setError('Name cannot exceed 50 characters');
      return;
    }

    if (formData.bio.length > 500) {
      setError('Bio cannot exceed 500 characters');
      return;
    }

    if (formData.avatar && !/^https?:\/\/.+/.test(formData.avatar)) {
      setError('Avatar must be a valid URL');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put('/user/profile', formData);
      updateUser(response.data.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="card">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/128?text=' + (user?.name?.[0] || 'U');
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-primary-600">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                className="input-field bg-gray-100 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.name.length}/50 characters
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input-field"
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a valid image URL for your profile picture
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information</h3>
              <div className="text-sm text-gray-600">
                <p>Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: user.name || '',
                    bio: user.bio || '',
                    avatar: user.avatar || '',
                  });
                  setError('');
                  setSuccess('');
                }}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
