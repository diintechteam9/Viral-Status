import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './component/Home';
import AuthLayout from './component/auth/AuthLayout';
import UserDashboard from './component/dashboards/UserDashboard';
import ClientDashboard from './component/dashboards/ClientDashboard';

const User = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const userToken = localStorage.getItem('usertoken');
      const clientToken = sessionStorage.getItem('clienttoken');
      const userData = localStorage.getItem('userData');
      const clientData = sessionStorage.getItem('userData');
      
      console.log('Auth Check:', {
        hasUserToken: !!userToken,
        hasClientToken: !!clientToken,
        hasUserData: !!userData,
        hasClientData: !!clientData
      });
      
      // Check for either user or client token
      const token = userToken || clientToken;
      const data = userData || clientData;
      
      if (token && data) {
        try {
          const parsedData = JSON.parse(data);
          console.log('Parsed auth data:', parsedData);
          
          setIsAuthenticated(true);
          setUserRole(parsedData.role);
          
          // Navigate based on role
          if (parsedData.role === 'client') {
            navigate('/auth/dashboard');
          } else if (parsedData.role === 'user') {
            navigate('/auth/dashboard');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          clearAuth();
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setIsLoading(false);
    };
    
    initializeAuth();
  }, [navigate]);

  const clearAuth = () => {
    // Clear all possible tokens and data
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('clienttoken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserRole(null);
    setIsLoading(false);
  };

  const handleAuthSuccess = (loginData) => {
    console.log('Login data received:', loginData);
    
    // Store credentials based on role
    if (loginData.role === 'client') {
      sessionStorage.setItem('clienttoken', loginData.token);
      sessionStorage.setItem('userData', JSON.stringify({
        role: loginData.role,
        name: loginData.name,
        email: loginData.email,
        clientId: loginData.clientId || loginData._id // Add fallback for _id
      }));
    } else {
      localStorage.setItem('usertoken', loginData.token);
      localStorage.setItem('userData', JSON.stringify({
        role: loginData.role,
        name: loginData.name,
        email: loginData.email
      }));
    }
    
    // Update state and navigate
    setIsAuthenticated(true);
    setUserRole(loginData.role);
    navigate('/auth/dashboard');
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/home');
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
        <Route path="/" element={
          isAuthenticated ? 
            <Navigate to="/auth/dashboard" replace /> 
            : <AuthLayout onLogin={handleAuthSuccess} />
        } />
        
        {isAuthenticated ? (
          <>
            {userRole === 'user' && (
              <Route path="/dashboard" element={<UserDashboard onLogout={handleLogout} />} />
            )}
            {userRole === 'client' && (
              <Route path="/dashboard" element={<ClientDashboard onLogout={handleLogout} />} />
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </div>
  );
};

export default User;