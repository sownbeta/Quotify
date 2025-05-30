import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import './MainLayout.scss';

const PlayerLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content player-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout; 