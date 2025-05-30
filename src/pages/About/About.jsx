import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    FaAngleDoubleDown,
    FaArrowLeft,
    FaCode,
    FaCss3Alt,
    FaEnvelope,
    FaGithub,
    FaHtml5,
    FaJs,
    FaLinkedin,
    FaMapMarkerAlt,
    FaNodeJs,
    FaPhone,
    FaReact
} from 'react-icons/fa';
import { SiTailwindcss } from 'react-icons/si';
import { Link } from 'react-router-dom';
import profileImg from '../../assets/images/profile.jpg';
import './About.scss';

// Placeholder profile image - replace with your own
const profileImage = profileImg;

// Work experience data
const workExperience = [
  {
    title: 'Ad Quality Evaluator (Remote)',
    company: 'APPEN ELECTRONICS',
    period: '04/2023 - 01/2025',
    description: 'Evaluated the relevance and quality of Google advertisements on various social media platforms. Analyzed and compiled advertising performance data to support optimization strategies.'
  },
  {
    title: 'IT Supported',
    company: 'HN COMPUTER',
    period: '02/2022 - 01/2023',
    description: 'Provided technical support and troubleshooting for software applications and web-based systems. Assisted in setup and maintenance of hardware, OS, and network tools.'
  },
  {
    title: 'UI Designer & Photographer',
    company: 'H2O STUDIO',
    period: '03/2021 - 01/2022',
    description: 'Wedding photography, yearbook photography, photo design, video making.'
  }
];

// Key Achievements
// const achievements = [
//   {
//     year: '2023',
//     description: 'Head of Communications & Media for a parish with nearly 10,000 members – led content planning, photography, and videography for major events, and maintained active community engagement via social platforms'
//   }
// ];

// Projects data
const projects = [
  {
    title: 'THIETKETDESIGN.VN',
    period: '06/2024 - 10/2024',
    description: 'Architectural design and business website company',
    role: 'Developer, Tester, UI Design',
    team: '3 members',
    responsibilities: 'Developer',
    technologies: ['NodeJS', 'MongoDB', 'EJS', 'LESS', 'Bootstrap', 'SSR', 'SEO optimization'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80'
  },
  {
    title: 'ZOOMCODE',
    period: '09/2024 - 05/2025',
    description: 'Programming Teaching Support System',
    role: 'Developer, Tester, UI Design',
    team: '4 members',
    responsibilities: 'Developer',
    technologies: ['ReactJS', 'SASS', 'NodeJS', 'Websocket', 'MongoDB', 'Docker', 'Figma'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    title: 'CHATBOT AI',
    period: '12/2024 - 12/2024',
    description: 'Built a smart chatbot system that fetches contextual answers through Gemini Pro API integration',
    role: 'Developer',
    team: '1 member',
    responsibilities: 'Developer',
    technologies: ['ReactJS', 'JavaScipt', 'SCSS', 'NodeJS'],
    image: 'https://i.imgur.com/8zPC0Hi.png'

  }
];

// Skills data
const skills = [
  { name: 'ReactJS', icon: <FaReact />, level: 85, color: '#61DAFB' },
  { name: 'JavaScript', icon: <FaJs />, level: 90, color: '#F7DF1E' },
  { name: 'HTML5', icon: <FaHtml5 />, level: 95, color: '#E34F26' },
  { name: 'CSS3/SASS', icon: <FaCss3Alt />, level: 90, color: '#1572B6' },
  { name: 'NodeJS', icon: <FaNodeJs />, level: 80, color: '#339933' },
  { name: 'UI/UX Design', icon: <SiTailwindcss />, level: 85, color: '#38B2AC' },
];

const otherSkills = [
  'C++ and Java (Basic)',
  'Figma, Postman, Fork',
  'Workflow: Agile (Scrum), Waterfall',
  'Photoshop, Lightroom, Premiere Pro',
  'Good Communication Skills',
  'English: Intermediate'
];

const About = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(3);
  const containerRef = useRef(null);
  
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const contactRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);
  
  // Handle cursor movement - only within the about container
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Handle scroll to determine active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      
      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection('hero');
      } else if (aboutRef.current && scrollPosition < aboutRef.current.offsetTop + aboutRef.current.offsetHeight) {
        setActiveSection('about');
      } else if (skillsRef.current && scrollPosition < skillsRef.current.offsetTop + skillsRef.current.offsetHeight) {
        setActiveSection('skills');
      } else if (experienceRef.current && scrollPosition < experienceRef.current.offsetTop + experienceRef.current.offsetHeight) {
        setActiveSection('experience');
      } else if (contactRef.current) {
        setActiveSection('contact');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to section function
  const scrollToSection = (sectionRef) => {
    window.scrollTo({
      top: sectionRef.current.offsetTop - 50,
      behavior: 'smooth'
    });
  };
  
  // Show more projects
  const handleShowMoreProjects = () => {
    setVisibleProjects(projects.length);
  };
  
  // Custom cursor component
  const CustomCursor = () => (
    <motion.div 
      className={`custom-cursor ${cursorHovered ? 'hovered' : ''}`}
      style={{ 
        left: cursorPosition.x, 
        top: cursorPosition.y,
        display: containerRef.current ? 'block' : 'none'
      }}
      animate={{
        scale: cursorHovered ? 1.5 : 1,
        opacity: cursorHovered ? 0.8 : 0.5
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
  
  // Loading screen component
  const LoadingScreen = () => (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="loading-logo"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 2, ease: "linear" },
          scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
      >
        <FaCode />
      </motion.div>
      <motion.div 
        className="loading-bar"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {!isLoaded && <LoadingScreen />}
      </AnimatePresence>
      
      <div className="about-container" ref={containerRef}>
        <CustomCursor />
        
        {/* Progress bar */}
        <motion.div className="progress-bar" style={{ scaleX }} />
        
        {/* Navigation */}
        <nav className="navigation">
          <motion.div 
            className="nav-content"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="logo">
              <span>N</span>guyễn Ngọc Sơn
            </div>
            <ul className="nav-links">
              <li className={activeSection === 'hero' ? 'active' : ''}>
                <button onClick={() => scrollToSection(heroRef)}>Home</button>
              </li>
              <li className={activeSection === 'about' ? 'active' : ''}>
                <button onClick={() => scrollToSection(aboutRef)}>About</button>
              </li>
              <li className={activeSection === 'skills' ? 'active' : ''}>
                <button onClick={() => scrollToSection(skillsRef)}>Skills</button>
              </li>
              {/* <li className={activeSection === 'achievements' ? 'active' : ''}>
                <button onClick={() => scrollToSection(achievementsRef)}>Achievements</button>
              </li>
              <li className={activeSection === 'education' ? 'active' : ''}>
                <button onClick={() => scrollToSection(educationRef)}>Education</button>
              </li> */}
              <li className={activeSection === 'experience' ? 'active' : ''}>
                <button onClick={() => scrollToSection(experienceRef)}>Experience</button>
              </li>
              <li className={activeSection === 'contact' ? 'active' : ''}>
                <button onClick={() => scrollToSection(contactRef)}>Contact</button>
              </li>
              <li>
                <Link to="/" className="back-link">
                  <FaArrowLeft /> Back to App
                </Link>
              </li>
            </ul>
          </motion.div>
        </nav>
        
        {/* Hero Section */}
        <section ref={heroRef} className="hero-section">
          <motion.div 
            className="hero-background"
            style={{ y: y1 }}
          />
          <motion.div 
            className="hero-content"
            style={{ y: y2, opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Nguyễn Ngọc Sơn
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Frontend Developer
            </motion.h2>
            <motion.div 
              className="hero-icons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <FaReact />
              <FaJs />
              <FaHtml5 />
              <FaCss3Alt />
            </motion.div>
            <motion.div 
              className="scroll-indicator"
              animate={{ 
                y: [0, 10, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
              onClick={() => scrollToSection(aboutRef)}
            >
              <FaAngleDoubleDown />
            </motion.div>
          </motion.div>
        </section>
        
        {/* About Section */}
        <section ref={aboutRef} className="about-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            About Me
          </motion.h2>
          
          <div className="about-content">
            <motion.div 
              className="profile-image-container"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <div className="profile-image">
                <img src={profileImage} alt="Nguyễn Ngọc Sơn" />
              </div>
            </motion.div>
            
            <motion.div 
              className="about-details"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Frontend Developer</h3>
              <p>
                I am a senior student majoring in software engineering at Duy Tan University. I have knowledge
                of design and HTML, CSS, JS, ReactJS and NodeJS. With passion and commitment to contribute to projects, 
                I am excited to start this journey and make a positive impact on the team.
              </p>
              
              <div className="personal-details">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">Nguyễn Ngọc Sơn</span>
                </div>
                <div className="detail-item">
                  <span className="label">Birth:</span>
                  <span className="value">11/02/2003</span>
                </div>
                <div className="detail-item">
                  <span className="label">Address:</span>
                  <span className="value">Nghe An, Viet Nam</span>
                </div>
                <div className="detail-item">
                  <span className="label">Position:</span>
                  <span className="value">Front-end Developer</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">+84 326298990</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">nguyenngocson2003211@gmail.com</span>
                </div>
              </div>
              
              <motion.button 
                className="download-cv"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                Download CV
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section ref={skillsRef} className="skills-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Skills
          </motion.h2>
          
          <motion.div 
            className="skills-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="skill-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <div className="skill-icon" style={{ color: skill.color }}>
                  {skill.icon}
                </div>
                <div className="skill-info">
                  <h3>{skill.name}</h3>
                  <div className="skill-progress">
                    <div 
                      className="progress-bar"
                      style={{ 
                        backgroundColor: skill.color,
                        width: `${skill.level}%`,
                        transition: 'width 1.5s ease-out'
                      }}
                    />
                  </div>
                  <span className="skill-percentage">{skill.level}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Experience Section */}
        <section ref={experienceRef} className="experience-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Experience & Projects
          </motion.h2>
          
          <div className="experience-container">
            <div className="timeline">
              {workExperience.map((exp, index) => (
                <motion.div 
                  key={index} 
                  className="timeline-item"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  <div className="timeline-content">
                    <h3>{exp.title}</h3>
                    <h4>{exp.company}</h4>
                    <p className="period">{exp.period}</p>
                    <p>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="projects-container">
            <h3 className="projects-title">Featured Projects</h3>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.title} 
                  className="project-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -10 }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-info">
                    <h4>{project.title}</h4>
                    <p className="project-period">{project.period}</p>
                    <p>{project.description}</p>
                    <div className="project-details">
                      <p><strong>Role:</strong> {project.role}</p>
                      <p><strong>Team:</strong> {project.team}</p>
                      <p><strong>Responsibilities:</strong> {project.responsibilities}</p>
                    </div>
                    <div className="project-tech">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {visibleProjects < projects.length && (
              <motion.button 
                className="show-more"
                onClick={handleShowMoreProjects}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                Show More Projects
              </motion.button>
            )}
          </div>
        </section>
        
        {/* Contact Section */}
        <section ref={contactRef} className="contact-section">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Get In Touch
          </motion.h2>
          
          <div className="contact-container">
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3>Contact Information</h3>
              <p>Feel free to reach out to me for collaborations or opportunities!</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <FaPhone />
                  <span>0326298990</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>nguyenngocson2003211@gmail.com</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Da Nang, Vietnam</span>
                </div>
              </div>
              
              <div className="social-links">
                <motion.a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  <FaGithub />
                </motion.a>
                <motion.a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  onMouseEnter={() => setCursorHovered(true)}
                  onMouseLeave={() => setCursorHovered(false)}
                >
                  <FaLinkedin />
                </motion.a>
              </div>
            </motion.div>
            
            <motion.form 
              className="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <motion.button 
                type="submit" 
                className="submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} Nguyễn Ngọc Sơn. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default About;
