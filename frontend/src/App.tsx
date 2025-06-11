import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <>
      <link href="./output.css" rel="stylesheet"></link>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}


export default App;
