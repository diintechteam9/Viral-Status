import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, BrowserRouter } from 'react-router-dom'
import AuthLayout from './component/auth/AuthLayout'
import UserDashboard from './component/dashboards/UserDashboard'
import AdminDashboard from './component/dashboards/AdminDashboard'
import ClientDashboard from './component/dashboards/ClientDashboard'
import SuperAdminDashboard from './component/dashboards/SuperAdminDashboard'
import AdminAuthLayout from './component/auth/AdminAuthLayout'
import SuperAdminAuthLayout from './component/auth/SuperAdminAuthLayout'
import axios from 'axios'
import './App.css'
import Home from './component/Home'

// Protected Route component
const ProtectedRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
      // Set default axios auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Try to get user data using the token
      const userType = localStorage.getItem('userType')
      const userId = localStorage.getItem('userId')
      
      if (userType && userId) {
        setIsAuthenticated(true)
        setUser({
          id: userId,
          userType,
          // Other user data will be loaded in the dashboard
        })
      }
    }
    
    setLoading(false)
  }, [])

  // Handle login
  const handleLogin = (userData) => {
    console.log("Login data:", userData); // For debugging
    
    // Save auth data
    localStorage.setItem('token', userData.token)
    localStorage.setItem('userType', userData.userType)
    localStorage.setItem('userId', userData.user._id || userData.user.id)
    
    // Set axios default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    
    setIsAuthenticated(true)
    setUser({
      ...userData.user,
      userType: userData.userType,
    })
  }

  // Handle logout
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userId')
    
    // Clear axios auth header
    delete axios.defaults.headers.common['Authorization']
    
    setIsAuthenticated(false)
    setUser(null)
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path='/' index='/' element={<Home/>}/>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminAuthLayout onLogin={handleLogin} />} />
          
        {/* Super Admin Routes */}
        <Route path="/superadmin/*" element={<SuperAdminAuthLayout onLogin={handleLogin} />} />
          
        {/* Regular Authentication Routes */}
        <Route path="/selectrole" element={
          !isAuthenticated 
            ? <AuthLayout onLogin={handleLogin} /> 
            : <Navigate to="/dashboard" replace />
        } />
          
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/">
            {user?.userType === 'user' && <UserDashboard user={user} onLogout={handleLogout} />}
            {user?.userType === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
            {user?.userType === 'client' && <ClientDashboard user={user} onLogout={handleLogout} />}
            {user?.userType === 'superadmin' && <SuperAdminDashboard user={user} onLogout={handleLogout} />}
          </ProtectedRoute>
        } />
          
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
      
    </Router>
  )
}

export default App
