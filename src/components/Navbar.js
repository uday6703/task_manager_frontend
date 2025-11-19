import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold">
              📋 Task Manager
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors ${isActive('/profile')}`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block text-sm">
              Welcome, <span className="font-semibold">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
