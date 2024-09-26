import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const BigAdminContext = createContext();

export const BigAdminAuthContextProvider = ({ children }) => {
  const [currentBigAdmin, setCurrentBigAdmin] = useState(
    JSON.parse(localStorage.getItem('bigAdmin')) || null
  );

  const login = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error('שם משתמש וסיסמה נדרשים');
    }
    try {
      const res = await axios.post('/auth/bigadminlogin', { username, password });
      setCurrentBigAdmin(res.data);
      localStorage.setItem('bigAdmin', JSON.stringify(res.data)); // שמור את פרטי הביג אדמין אם נדרש
    } catch (error) {
      throw new Error(error.response?.data?.error || 'שגיאה בהתחברות');
    }
  };

  const logout = async () => {
    await axios.post('/auth/bigadminlogout');
    setCurrentBigAdmin(null);
    localStorage.removeItem('bigAdmin'); // הסר את פרטי הביג אדמין מה-localStorage
  };

  return (
    <BigAdminContext.Provider value={{ currentBigAdmin, login, logout }}>
      {children}
    </BigAdminContext.Provider>
  );
};

export const useBigAdminAuth = () => useContext(BigAdminContext);
