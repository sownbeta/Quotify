import React from 'react';
import './HomePage.scss';
import landingImg from '../../assets/images/landing.jpg';

const HomePage = () => {
  return (
    <div className='home-container'>
      <img className='landing-img' src={landingImg} alt="" />
    </div>
  )
}

export default HomePage