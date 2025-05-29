import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import axios from 'axios';
import { message } from 'antd';
import {
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaArrowLeft,
  FaSignOutAlt,
} from 'react-icons/fa';
import imglogin from '../../../assets/images/img-login.jpg';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning('Please fill in all required fields!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('✅ Login success:', accessToken);
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Access token not found in the response!');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      message.error('Login failed. Please check your credentials!');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryPassword = () => {
    message.info('Redirecting to password recovery...');
    navigate('/register');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    message.success('Logout successful!');
  };

  if (isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-form">
          <div className="already-logged-in">
            <div className="message-container">
              <h2>You are already logged in!</h2>
              <p>You can return to the Dashboard or log out.</p>
              <div className="action-buttons">
                <button className="back-button" onClick={handleBackToDashboard}>
                  <FaArrowLeft /> Back to Dashboard
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="left-login-form">
          <div className="left-container">
            <h1>Welcome Back!</h1>
            <Input
              placeholder={'Email'}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder={'Password'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-forgot-password" onClick={handleRecoveryPassword}>
              Forgot Password?
            </p>
            <Button label={loading ? 'Loading...' : 'Login'} onClick={handleLogin} />
            <div className="already-login">Or continue with</div>
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
          <img className="img-login" src={imglogin} alt="Login Visual" />
        </div>
      </div>
    </div>
  );
};

export default Login;
