import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PhoneLogin from './components/PhoneLogin';
import OTPVerification from './components/OTPVerification';
import ChatPanel from './components/ChatPanel';
import PrivateRoute from './components/PrivateRoute';
import { setUserFromStorage } from './store/authSlice'; 

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Check auth state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(setUserFromStorage({ user: JSON.parse(user), token }));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {isAuthenticated ? (
            // If the user is authenticated, redirect them to the chat panel
            <Route path="/login" element={<Navigate to="/" replace />} />
          ) : (
            <>
              <Route path="/login" element={<PhoneLogin />} />
              <Route path="/verify" element={<OTPVerification />} />
            </>
          )}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<ChatPanel />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
