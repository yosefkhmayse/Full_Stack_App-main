import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Function to parse JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('כשלון בפיענוח טוקן JWT', error);
    return null;
  }
};

// Provider component
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    if (!username || !password) {
      throw new Error('שם משתמש וסיסמה נדרשים');
    }

    try {
      const response = await axios.post('/auth/userlogin', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedToken = parseJwt(token);
      setUser({ id: decodedToken.id, username: decodedToken.username });
      console.log('המשתמש התחבר:', { id: decodedToken.id, username: decodedToken.username });
    } catch (error) {
      console.error('ההתחברות נכשלה:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || 'ההתחברות נכשלה');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/userlogout');
      localStorage.removeItem('token');
      setUser(null);
      console.log('המשתמש התנתק');
    } catch (error) {
      console.error('ההתנתקות נכשלה:', error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setUser({ id: decodedToken.id, username: decodedToken.username });
      console.log('המשתמש נטען מהטוקן:', { id: decodedToken.id, username: decodedToken.username });
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using context
export const useUserContext = () => useContext(UserContext);
