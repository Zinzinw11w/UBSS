import React, { useState } from 'react';
import * as database from '../services/database';
import { showAlert } from './AlertSystem';

const CreateAdminUser = () => {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123',
    email: 'admin@ubss.com'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const admin = await database.createAdminUser(
        formData.username,
        formData.password,
        formData.email
      );
      
      console.log('Admin user created successfully:', admin);
      showAlert('Admin user created successfully!', 'success');
      setIsCreated(true);
    } catch (error) {
      console.error('Error creating admin user:', error);
      showAlert('Error creating admin user. It may already exist.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin User Created!
            </h2>
            <div className="mt-4 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Login Credentials:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Username:</strong> {formData.username}</div>
                <div><strong>Password:</strong> {formData.password}</div>
                <div><strong>Email:</strong> {formData.email}</div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please change the default password after first login!
                </p>
              </div>
              <div className="mt-4">
                <a
                  href="/admin/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Admin Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Admin User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create the initial admin user for the system
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleCreateAdmin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Admin User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminUser;
