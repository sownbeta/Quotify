import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/Home/HomePage';
import LoginPage from '@pages/Auth/Login/Login';
import RegisterPage from '@pages/Auth/Register/Register';
import Dashboard from '@pages/Dashboard/Dashboard';
import About from '@pages/About/About';
import Player from '@pages/Player/Player';
import MainLayout from '@components/layout/MainLayout';
import PlayerLayout from '@components/layout/PlayerLayout';
import { message } from 'antd';

export default function AppRouter() {
  const isLogin = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      message('Bạn Đã Đăng Nhập !');
    } else {
      message('Bạn cần đăng nhập để truy cập trang này')
      window.location.href = '/login';
    }
    return !!token;
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* About page without layout */}
        <Route path="/about" element={<About />} />
        
        {/* Player page with PlayerLayout (no footer) */}
        <Route element={<PlayerLayout />}>
          <Route path="/player" element={<Player />} />
        </Route>
        
        {/* Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
