import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link to="/about" className="footer-link">עלינו</Link>
          <Link to="/contact" className="footer-link">צור קשר</Link>
          <Link to="/privacy" className="footer-link">מדיניות פרטיות</Link>
        </div>
        <div className="footer-info">
          <span>&copy; {new Date().getFullYear()} שם החברה שלך. כל הזכויות שמורות.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
