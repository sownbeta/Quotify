import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.scss';
import { 
  FaQuoteLeft, FaArrowRight, FaCheck, FaTwitter, 
  FaInstagram, FaLinkedin, FaLightbulb, FaUser, FaHeart 
} from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Generate particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 15 + Math.random() * 10;
      
      particle.style.setProperty('--x', `${x}%`);
      particle.style.setProperty('--y', `${y}%`);
      particle.style.setProperty('--delay', `${delay}s`);
      particle.style.setProperty('--duration', `${duration}s`);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const featureVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Generate 30 particles for the background
  const particles = Array.from({ length: 30 }, (_, index) => (
    <div key={index} className="particle"></div>
  ));

  return (
    <div className='home-container'>
      {/* Modern Hero Section with Animated Gradient Background */}
      <section className="hero-section">
        <div 
          className="animated-bg" 
          style={{ 
            backgroundPosition: `${mousePosition.x * 30}% ${mousePosition.y * 30}%`,
            transform: `translateY(${scrollY * 0.5}px)` 
          }}
        >
          <div className="particles-container">
            {particles}
          </div>
        </div>
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp}>
            Find Your <span className="highlight">Daily Inspiration</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="hero-subtitle">
            Discover and share inspiring quotes from the world's greatest minds
          </motion.p>
          <motion.div variants={fadeInUp}>
            <button className="cta-button" onClick={handleGetStarted}>
              Get Started <FaArrowRight />
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="floating-quotes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="quote-bubble q1">
            <FaQuoteLeft />
            <p>"Be yourself; everyone else is already taken."</p>
          </div>
          <div className="quote-bubble q2">
            <FaQuoteLeft />
            <p>"The only way to do great work is to love what you do."</p>
          </div>
          <div className="quote-bubble q3">
            <FaQuoteLeft />
            <p>"In the middle of difficulty lies opportunity."</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp}>
          Why Choose <span className="highlight">Quotify</span>
        </motion.h2>
        <div className="features-grid">
          <motion.div className="feature-card" variants={featureVariant}>
            <div className="feature-icon">
              <FaLightbulb />
            </div>
            <h3>Daily Inspiration</h3>
            <p>Start your day with a fresh dose of motivation from our curated collection</p>
          </motion.div>
          <motion.div className="feature-card" variants={featureVariant}>
            <div className="feature-icon">
              <FaUser />
            </div>
            <h3>Personalized Feed</h3>
            <p>Discover quotes tailored to your interests and preferences</p>
          </motion.div>
          <motion.div className="feature-card" variants={featureVariant}>
            <div className="feature-icon">
              <FaHeart />
            </div>
            <h3>Save Favorites</h3>
            <p>Collect your favorite quotes in one place for easy access</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="stat-item">
          <motion.div 
            className="stat-number"
            variants={fadeInUp}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.8
              }
            }}
            viewport={{ once: true }}
          >
            10,000+
          </motion.div>
          <motion.p variants={fadeInUp}>Inspiring Quotes</motion.p>
        </div>
        <div className="stat-item">
          <motion.div 
            className="stat-number"
            variants={fadeInUp}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.1,
                duration: 0.8
              }
            }}
            viewport={{ once: true }}
          >
            5,000+
          </motion.div>
          <motion.p variants={fadeInUp}>Happy Users</motion.p>
        </div>
        <div className="stat-item">
          <motion.div 
            className="stat-number"
            variants={fadeInUp}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.2,
                duration: 0.8
              }
            }}
            viewport={{ once: true }}
          >
            500+
          </motion.div>
          <motion.p variants={fadeInUp}>Famous Authors</motion.p>
        </div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section 
        className="testimonial-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div 
          className="testimonial-container"
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FaQuoteLeft className="quote-icon" />
          <p className="testimonial-text">
            "Quotify has transformed my daily routine. I start each morning with a new quote that sets a positive tone for my entire day. The app is beautifully designed and intuitive to use."
          </p>
          <div className="testimonial-author">
            <div className="author-avatar"></div>
            <div className="author-info">
              <h4>Emily Johnson</h4>
              <p>Creative Director</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp}>Ready to get inspired daily?</motion.h2>
        <motion.p variants={fadeInUp}>Join thousands of users who start their day with Quotify</motion.p>
        <motion.div variants={fadeInUp}>
          <button 
            className="cta-button pulse"
            onClick={handleGetStarted}
          >
            Start Now <FaArrowRight />
          </button>
        </motion.div>
      </motion.section>

      {/* Social Section */}
      <motion.section 
        className="social-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeInUp}>Connect with us</motion.h3>
        <motion.div 
          className="social-icons"
          variants={fadeInUp}
        >
          <motion.a 
            href="#" 
            className="social-icon"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTwitter />
          </motion.a>
          <motion.a 
            href="#" 
            className="social-icon"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaInstagram />
          </motion.a>
          <motion.a 
            href="#" 
            className="social-icon"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaLinkedin />
          </motion.a>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;