import { useState } from 'react';
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';
import AdminRegisterForm from './AdminRegisterForm';

const AdminAuthLayout = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();

  const switchToRegister = () => {
    setAuthMode('register');
    navigate('/admin/register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
    navigate('/admin/login');
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
    navigate('/admin/login');
  };

  const handleLoginSuccess = (loginData) => {
    onLogin(loginData);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Secured access for administrators</p>
        </div>

        <Routes>
          <Route path="/login" element={
            <AdminLoginForm 
              onLogin={handleLoginSuccess} 
              switchToRegister={switchToRegister} 
            />
          } />
          <Route path="/register" element={
            <AdminRegisterForm 
              onSuccess={handleRegisterSuccess} 
              switchToLogin={switchToLogin} 
            />
          } />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="text-center">
            {authMode === 'login' ? (
              <div className="mt-4">
                <p className="text-gray-600">Need to create an account?</p>
                <Link 
                  to="/admin/register" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToRegister}
                >
                  Register as Admin
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-gray-600">Already have an account?</p>
                <Link 
                  to="/admin/login" 
                  className="mt-2 inline-block text-blue-600 hover:underline"
                  onClick={switchToLogin}
                >
                  Log in as Admin
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <Link to="/auth" className="text-gray-500 hover:text-gray-700">
              Return to main login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthLayout; 