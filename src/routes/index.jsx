import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/Home/HomePage';
import LoginPage from '@pages/Auth/Login/Login';
import RegisterPage from '@pages/Auth/Register/Register';
import Dashboard from '@pages/Dashboard/Dashboard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
