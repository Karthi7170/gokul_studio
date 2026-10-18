import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import App from './App';
import './style.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BookingProvider><HashRouter><App /></HashRouter></BookingProvider>
  </React.StrictMode>
);
