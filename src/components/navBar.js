import React, { useState, useEffect, useRef } from 'react';
import './navBar.css';

const NavBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const introTextRef = useRef(null);
  const navTextRef = useRef(null);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    if (introTextRef.current && navTextRef.current) {
      const scale = Math.max(1 - window.scrollY / 300, 0.5);
      introTextRef.current.style.transform = `scale(${scale}) translateY(-${window.scrollY / 2}px)`;
      navTextRef.current.style.transform = `scale(${1 - scale}) translateY(${window.scrollY / 2}px)`;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <a href="/" className="plus-contact-us">
        +
      </a>
      <a href="/" className="contact-us">
        Contact Us
      </a>
      <a href="/" className="nav-text-link">
        <h1 ref={navTextRef} id="nav-text" className="nav-text" onClick={"#"}>Satta Pai</h1>
      </a>
    </nav>
  );
};

export default NavBar;