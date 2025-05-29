import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import AdminAuthLayout from './component/auth/AdminAuthLayout';
import AdminDashboard from './component/dashboards/AdminDashboard'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const adminToken = localStorage.getItem('admintoken');
      const adminData = localStorage.getItem('adminData');
      
      if (adminToken && adminData) {
        try {
          const parsedAdminData = JSON.parse(adminData);
          if (parsedAdminData.role === 'admin') {
            setIsAuthenticated(true);
            // Update admin user data if needed
            localStorage.setItem('adminData', JSON.stringify({
              ...parsedAdminData,
              name: parsedAdminData.name
            }));
          } else {
            throw new Error('Invalid role');
          }
        } catch (error) {
          console.error('Error validating admin token:', error);
          clearAuth();
        }
      }
      
      setIsLoading(false);
      setIsAuthenticated(false);
    };
    
    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('admintoken');
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  const handleAuthSuccess = (adminData) => {
    // Store admin token and user data
    localStorage.setItem('admintoken', adminData.token);
    localStorage.setItem('adminData', JSON.stringify({
      role: adminData.role,
      name: adminData.name,
      email: adminData.email
    }));
    
    setIsAuthenticated(true);
    console.log("Admin authentication successful");
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
        <Routes>
        <Route path='/' element={<AdminAuthLayout onLogin={handleAuthSuccess}/>}/>
        {
            isAuthenticated?
            (
                <Route path='/dashboard' element={<AdminDashboard onLogout={handleLogout}/>}/>
            )
            :
            (
                <Route path='*' element={<AdminAuthLayout onLogin={handleAuthSuccess}/>}/>

            )
        }
        </Routes>
    </div>
  );
};

export default Admin;