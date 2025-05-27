import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.scss';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import imglogin from '../../../assets/images/img-register.jpg';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      console.log('✅ Register success:', response.data);
      alert('Đăng ký thành công!');
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="register-container">
      <div className="register-form">
        <div className="left-register-form">
          <div className="left-container">
            {' '}
            <h1>Create Account</h1>
            <Input
              placeholder={'username'}
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder={'email'}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder={'password'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button label={'Create'} onClick={handleRegister} />
            <div className="already-login">
              Already have an account?{' '}
              <span className="login-link" onClick={handleToLogin}>
                Login
              </span>
            </div>
            <div className="social-login">
              <div className="social-icon google">
                <FaGoogle size={20} />
              </div>
              <div className="social-icon apple">
                <FaApple size={22} />
              </div>
              <div className="social-icon facebook">
                <FaFacebookF size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="right-login-form">
          <img className="img-login" src={imglogin} alt="" />
        </div>
      </div>
    </div>
  );
};
export default Login;
