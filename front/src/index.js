import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import your context providers
import { BigAdminAuthContextProvider } from './context/BigAdminContext';
import { AdminAuthContextProvider } from './context/AdminContext';
import { UserContextProvider } from './context/UserContext';

// Create root element and render the App component within context providers
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BigAdminAuthContextProvider>
      <AdminAuthContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </AdminAuthContextProvider>
    </BigAdminAuthContextProvider>
  </React.StrictMode>
);
