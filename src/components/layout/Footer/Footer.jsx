import React from 'react';
import './Footer.scss';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quotify</h3>
          <p>Your search ends here</p>
        </div>
        
        <div className="right-footer-section">
          <h3>Contact</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Made with ❤️ by Quotify</p>
        <p>&copy; {currentYear} Quotify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
