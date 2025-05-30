import React, { useState } from 'react';
import './Header.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import logo from '../../../assets/images/logo.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="header-container">
      <div className="left-header">
        <Link to="/" className="logo-link">
          <img className="logo-header" src={logo} alt="Quotify Logo" />
          <h2 className="name-web">QUOTIFY</h2>
        </Link>
      </div>

      <button 
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`right-header ${mobileMenuOpen ? 'open' : ''}`}>
        <Link 
          className={`link-nav ${location.pathname === '/' ? 'active' : ''}`} 
          to="/"
          onClick={closeMobileMenu}
        >
          Home
        </Link>
        <Link 
          className={`link-nav ${location.pathname === '/dashboard' ? 'active' : ''}`} 
          to="/dashboard"
          onClick={closeMobileMenu}
        >
          Dashboard
        </Link>
        <Link 
          className={`link-nav ${location.pathname === '/player' ? 'active' : ''}`} 
          to="/player"
          onClick={closeMobileMenu}
        >
          Music Player
        </Link>
        <Link 
          className={`link-nav ${location.pathname === '/about' ? 'active' : ''}`} 
          to="/about"
          onClick={closeMobileMenu}
        >
          About Us
        </Link>
        <CaretDownOutlined className="custom-caret-icon" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Header;
