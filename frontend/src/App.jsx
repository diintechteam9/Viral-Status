import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './Admin';
import User from './User';
import Home from './component/Home';
import './App.css'

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem('usertoken');
    const admintoken = localStorage.getItem('admintoken');
    console.log("User/Client token:", token);
    console.log("Admin token:", admintoken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/auth/*" element={<User />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/superadmin/*" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;