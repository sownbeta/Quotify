import React from 'react';
import './Header.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import logo from '../../../assets/images/logo.png';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="header-container">
      <div className="left-header">
        <Link to="/" className="logo-link">
          <img className="logo-header" src={logo} alt="Quotify Logo" />
          <h2 className="name-web">QUOTIFY</h2>
        </Link>
      </div>
      <div className="right-header">
        <Link 
          className={`link-nav ${location.pathname === '/' ? 'active' : ''}`} 
          to="/"
        >
          Home
        </Link>
        <Link 
          className={`link-nav ${location.pathname === '/dashboard' ? 'active' : ''}`} 
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link 
          className={`link-nav ${location.pathname === '/about' ? 'active' : ''}`} 
          to="/about"
        >
          About Us
        </Link>
<CaretDownOutlined className="custom-caret-icon" onClick={handleLogout} />

      </div>
    </div>
  );
};

export default Header;
