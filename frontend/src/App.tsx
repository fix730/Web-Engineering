import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@material-tailwind/react";

import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import PostNew from './pages/PostNew';
import Einstellungen from './pages/Einstellungen';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './pages/components/ProtectedRoute';
import EditPost from './pages/EditPosts';
import { Calendar } from 'lucide-react';
import Cal from './pages/calender';


function App() {
  return (
    <>
      
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
            <Route path="/posts/edit/:id" element={<EditPost />} />
            <Route path="/einstellungen" element={<Einstellungen />} />
            <Route path="/calender" element={<Cal />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;