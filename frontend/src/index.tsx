import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';

import ReactBigCalendar from './pages/components/Calender/ReactBigCalender';
import FullCalendar from './pages/components/Calender/FullCalender';
import TuiCalendar from './pages/components/Calender/TuiCalender';
import ReactCalendar from './pages/components/Calender/ReactCalender';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <ReactBigCalendar />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

reportWebVitals();