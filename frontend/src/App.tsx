import React from 'react';
import logo from './logo.svg'; // Sie benötigen dies möglicherweise nicht, wenn es nicht verwendet wird
import './App.css'; // Behalten Sie dies für globale App-Styles
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ThemeProvider } from "@material-tailwind/react";
import PostNew from './pages/PostNew';
import Einstellungen from './pages/Einstellungen';

function App() {
  return (
    <>
      
      <ThemeProvider>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;