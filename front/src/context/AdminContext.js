import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const AdminAuthContextProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(
    JSON.parse(localStorage.getItem('admin')) || null
  );

  const login = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error('נדרש שם משתמש וסיסמה');
    }
    try {
      const res = await axios.post('/auth/adminlogin', { username, password });
      setCurrentAdmin(res.data);
      localStorage.setItem('admin', JSON.stringify(res.data)); // שמור מידע על המנהל אם נדרש
    } catch (error) {
      throw new Error(error.response?.data?.error || 'הכניסה נכשלה');
    }
  };

  const logout = async () => {
    await axios.post('/auth/adminlogout');
    setCurrentAdmin(null);
    localStorage.removeItem('admin'); // הסר את המידע על המנהל מ-localStorage
  };

  return (
    <AdminContext.Provider value={{ currentAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminContext);
