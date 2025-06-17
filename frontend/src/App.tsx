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
      {/* ThemeProvider muss Ihre gesamte Anwendung umfassen,
        damit Material Tailwind Komponenten überall Theme-Daten haben.
      */}
      <ThemeProvider>
        {/* Das <link>-Tag für CSS-Dateien gehört in die public/index.html, 
          NICHT hierher. Bitte verschieben Sie es dorthin.
          Ich entferne es hier, da es im React-DOM fehl am Platz ist.
        */}
        {/* <link href="./output.css" rel="stylesheet"></link> */} 

        {/* Routen sollten direkt in <Routes> oder in spezifischen 
          Parent <Route>s für verschachtelte Pfade liegen. 
          Die leeren <Route>-Wrapper waren hier falsch.
        */}
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