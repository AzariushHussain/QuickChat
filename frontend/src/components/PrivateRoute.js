import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user); // Optional: to check user data
  const isLoading = user === null; // Assuming user is null when not authenticated

  console.log('isAuthenticated:', isAuthenticated);
  console.log('isLoading:', isLoading);

  // Display a loading indicator or nothing while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}


export default PrivateRoute