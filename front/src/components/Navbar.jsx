// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="links">
          <Link className="link" to="/settings" aria-label="Settings">
            <h3>הגדרות</h3>
          </Link>
          <Link className="link" to="/?cat=science" aria-label="Categories">
            <h3>קטגוריות</h3>
          </Link>
          <Link className="link" to="/home" aria-label="Home">
            <h3>חזרה לדף הבית</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
