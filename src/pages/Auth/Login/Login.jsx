import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import axios from 'axios';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import imglogin from '../../../assets/images/img-login.jpg';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
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
        alert('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        alert('AccessToken không tồn tại trong phản hồi!');
      }
    } catch (error) {
      console.error('❌ Có lỗi khi đăng nhập:', error);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryPassword = () => {
    alert('Chuyển đến trang khôi phục mật khẩu...');
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="left-login-form">
          <div className="left-container">
            {' '}
            <h1>Hello Again !</h1>
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
            <p className="text-forgot-password" onClick={handleRecoveryPassword}>
              Recovery Password
            </p>
            <Button label={'Login'} onClick={handleLogin} />
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
          <img className="img-login" src={imglogin} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
