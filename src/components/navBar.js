import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './navBar.css';

const NavBar = ({ disableScrollEffect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const introTextRef = useRef(null);
  const navTextRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll and hover effects
  useEffect(() => {
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

    const contactUs = document.querySelector(".contact-us");
    const plusContactUs = document.querySelector(".plus-contact-us");

    const handleMouseOver = () => {
      plusContactUs.style.transform = "rotate(45deg)";
    };

    const handleMouseOut = () => {
      plusContactUs.style.transform = "rotate(0deg)";
    };

    // Scroll effect will be disabled if the flag is set
    if (!disableScrollEffect) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setIsVisible(true); // Directly show the navbar when scroll effect is disabled
    }

    // Add hover effects for the buttons
    if (contactUs && plusContactUs) {
      contactUs.addEventListener("mouseover", handleMouseOver);
      contactUs.addEventListener("mouseout", handleMouseOut);
      plusContactUs.addEventListener("mouseover", handleMouseOver);
      plusContactUs.addEventListener("mouseout", handleMouseOut);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (contactUs && plusContactUs) {
        contactUs.removeEventListener("mouseover", handleMouseOver);
        contactUs.removeEventListener("mouseout", handleMouseOut);
        plusContactUs.removeEventListener("mouseover", handleMouseOver);
        plusContactUs.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, [disableScrollEffect]);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <a href="/" className="plus-contact-us">+</a>
      <a href="/" className="contact-us">Contact Us</a>
      <a href="/" className="nav-text-link">
        <h1 ref={navTextRef} id="nav-text" className="nav-text" onClick={handleClick}>Satta Pai</h1>
      </a>
    </nav>
  );
};

export default NavBar;