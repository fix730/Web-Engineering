import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostNew from './pages/PostNew';
import Einstellungen from './pages/Einstellungen';

function App() {
  return (
    <>
      <link href="./output.css" rel="stylesheet"></link>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/new" element={<PostNew />} />
          <Route path="/einstellungen" element={<Einstellungen />} />

        </Route>
        <Route>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}


export default App;
