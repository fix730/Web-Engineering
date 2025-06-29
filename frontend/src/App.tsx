import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@material-tailwind/react";

import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import PostNew from './pages/PostNew';
import Einstellungen from './pages/Einstellungen';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from './slices/authSlice';
import { AppDispatch } from './store';

// Hole die Auth-States aus dem Redux Store
// Define RootState type for your Redux store
interface RootState {
  auth: {
    basicUserInfo: any;
    authError: string | null;
  };
}


function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const basicUserInfo = useSelector((state: RootState) => state.auth.basicUserInfo);
  const authError = useSelector((state: RootState) => state.auth.authError);

  useEffect(() => {
    const handleLogout = async () => {
      if (authError === "Sitzung abgelaufen. Bitte erneut anmelden.") {
        alert("Sitzung abgelaufen. Bitte erneut anmelden.");
        console.warn("Sitzung abgelaufen, navigiere zu /logout...");
        try {
          await dispatch(logout()).unwrap();
          navigate("/login");
          //axiosInstance.post("/api/auth/logout")
        } catch (e) {
          console.error(e);
        }
      };
    }
    handleLogout();
  }, [authError, basicUserInfo, navigate, dispatch]);
  return (
    <ThemeProvider>
      <Routes>

        <Route path="/posts" element={<Navigate to="/myposts" replace />} />

        {/* öffentlich */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* geschützt */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;