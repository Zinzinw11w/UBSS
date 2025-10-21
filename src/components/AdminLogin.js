import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import * as database from '../services/database';
import { showAlert } from './AlertSystem';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); // 'login', 'setup-2fa', 'verify-2fa'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpCode: '',
    recoveryCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [pendingAdmin, setPendingAdmin] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await database.authenticateAdmin(formData.username, formData.password);
      
      if (result.success) {
        if (result.requires2FA) {
          setPendingAdmin(result.admin);
          setStep('verify-2fa');
        } else {
          // No 2FA required, login directly
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('adminUser', JSON.stringify(result.admin));
          navigate('/admin');
        }
      } else {
        showAlert('Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await database.verify2FA(pendingAdmin.id, formData.totpCode);
      
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));
        navigate('/admin');
      } else {
        showAlert('Invalid 2FA code', 'error');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      showAlert('2FA verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await database.verifyRecoveryCode(pendingAdmin.id, formData.recoveryCode);
      
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));
        navigate('/admin');
      } else {
        showAlert('Invalid recovery code', 'error');
      }
    } catch (error) {
      console.error('Recovery code error:', error);
      showAlert('Recovery code verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAComplete = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await database.complete2FASetup(pendingAdmin.id, formData.totpCode);
      
      if (result.success) {
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));
        navigate('/admin');
      } else {
        showAlert('Invalid verification code', 'error');
      }
    } catch (error) {
      console.error('2FA completion error:', error);
      showAlert('2FA setup completion failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const render2FASetup = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Setup Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Scan the QR code with your authenticator app
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center mb-6">
            <QRCodeSVG value={qrCodeData} size={200} />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manual Entry Key:
            </label>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all">
              {secretKey}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recovery Codes (save these securely):
            </label>
            <div className="bg-gray-100 p-3 rounded">
              {recoveryCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm mb-1">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handle2FAComplete}>
            <div className="mb-4">
              <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code from your app:
              </label>
              <input
                id="totpCode"
                name="totpCode"
                type="text"
                maxLength="6"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="123456"
                value={formData.totpCode}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const render2FAVerification = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handle2FAVerification} className="space-y-4">
            <div>
              <label htmlFor="totpCode" className="block text-sm font-medium text-gray-700 mb-2">
                Authentication Code:
              </label>
              <input
                id="totpCode"
                name="totpCode"
                type="text"
                maxLength="6"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="123456"
                value={formData.totpCode}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Lost your device?</p>
            <form onSubmit={handleRecoveryCode} className="space-y-2">
              <div>
                <label htmlFor="recoveryCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Recovery Code:
                </label>
                <input
                  id="recoveryCode"
                  name="recoveryCode"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter recovery code"
                  value={formData.recoveryCode}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Use Recovery Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {step === 'login' && renderLoginForm()}
      {step === 'setup-2fa' && render2FASetup()}
      {step === 'verify-2fa' && render2FAVerification()}
    </>
  );
};

export default AdminLogin;
