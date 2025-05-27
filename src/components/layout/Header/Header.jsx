import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';

const Header = () => {
  return (
    <div className="header-container">
      <div className="left-header">
        <img className="logo-header" src={logo} alt="" />
        <h2 className="name-web">QUOTIFY</h2>
      </div>
      <div className="right-header">
        <Link className="link-nav" to="/about">
          Landing Page
        </Link>
        <Link className="link-nav" to="/about">
          About Us
        </Link>
        <Link className="link-nav" to="/about">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Header;
