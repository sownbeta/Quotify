import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/Home/HomePage';
import LoginPage from '@pages/Auth/Login/Login';
import RegisterPage from '@pages/Auth/Register/Register';
import Dashboard from '@pages/Dashboard/Dashboard';
import About from '@pages/About/About';
import MainLayout from '@components/layout/MainLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* About page without layout */}
        <Route path="/about" element={<About />} />
        
        {/* Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
