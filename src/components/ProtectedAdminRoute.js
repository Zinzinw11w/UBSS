import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as database from '../services/database';

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const adminUser = localStorage.getItem('adminUser');

        if (!token || !adminUser) {
          navigate('/admin/login');
          return;
        }

        const result = await database.verifyAdminSession(token);
        
        if (result.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {JSON.parse(localStorage.getItem('adminUser') || '{}').username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Content */}
      {children}
    </div>
  );
};

export default ProtectedAdminRoute;
