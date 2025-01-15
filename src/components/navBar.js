import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './navBar.css';
import {assets} from '../assets/images/assets'; // Adjust the import as needed

const NavBar = ({ disableScrollEffect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const introTextRef = useRef(null);
  const navTextRef = useRef(null);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



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

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };



  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <a href="/" className="plus-contact-us">+</a>
      <a href="/" className="contact-us">Contact Us</a>
      <a href="/" className="nav-text-link">
        <h1 ref={navTextRef} id="nav-text" className="nav-text" onClick={handleClick}>Satta Pai</h1>
      </a>

      <div className="icons">
        <img src={assets.user_icon} alt="user icon"/>
        <div className="cart-icon-container">
          <img src={assets.cart_icon} alt="cart icon"/>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <div
          className={`line line1 ${isMobileMenuOpen ? 'rotate45' : ''}`}
        ></div>
        <div
          className={`line line2 ${isMobileMenuOpen ? 'opacity0' : ''}`}
        ></div>
        <div
          className={`line line3 ${isMobileMenuOpen ? 'rotate135' : ''}`}
        ></div>
      </div>
    </nav>
  );
};

export default NavBar;