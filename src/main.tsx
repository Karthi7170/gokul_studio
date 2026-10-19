import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import App from './App';
import './style.css';
import './styles/ios-home.css';
import './styles/auth-reference.css';
import './styles/official-brand.css';
import './styles/account-reference.css';
import './styles/profile-avatar-fix.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider><BookingProvider><HashRouter><App /></HashRouter></BookingProvider></AuthProvider>
  </React.StrictMode>
);
