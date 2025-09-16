import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../context/authContext';
import LoginPage from './LoginPage';

const ProtectedRoute = () => {
  const { userInfo } = useAuth();

  return userInfo ? <Outlet/> : <LoginPage />; 
};

export default ProtectedRoute;