import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Stellen Sie sicher, dass dieser Import oben ist
import store from './store'; // Stellen Sie sicher, dass dieser Import oben ist
import { BrowserRouter } from 'react-router-dom'; // Stellen Sie sicher, dass dieser Import oben ist

// --- Hinzufügen des ThemeProvider Imports ---
import { ThemeProvider } from "@material-tailwind/react";
// --- Ende des Hinzufügens ---

//dotenv.config(); // Diese Zeile ist normalerweise nicht hier im Frontend notwendig
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/* --- Hinzufügen des ThemeProviders um Ihre App --- */}
        <ThemeProvider>
          <App />
        </ThemeProvider>
        {/* --- Ende des Hinzufügens --- */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();