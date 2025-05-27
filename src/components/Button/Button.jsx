import React from 'react';
import './Button.scss';

const Button = ({ label, onClick, type = 'button' }) => {
  return (
    <button className="custom-button" type={type} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
