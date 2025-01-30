import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './navBar.css';
import { assets } from '../assets/images/assets'; // Adjust the import as needed
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


const NavBar = ({ disableScrollEffect, username, setUsername, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const introTextRef = useRef(null);
  const navTextRef = useRef(null);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Track dropdown visibility

  const auth = getAuth();

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

    if (!disableScrollEffect) {
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disableScrollEffect]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  
    // Listen for user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername( username || user.displayName || user.email.split('@')[0]); // Use display name or part of email
      } else {
        setIsLoggedIn(false);
      }
    });
  
    return () => unsubscribe();
  }, [auth, navigate, username, setUsername]);
  
  const handleClick = () => {
    navigate('/');
  };

  const cartClick = () => {
    navigate('/cart');
    window.scrollTo(0, 0);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUsername('');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const profile = () =>{
    navigate('/profile');
    setShowDropdown(false);
  }

  const order = () =>{
    navigate('/orders');
    setShowDropdown(false);
  }
  
  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <a href="/" className="plus-contact-us">+</a>
      <a href="/" className="contact-us">Contact Us</a>
      <a href="/" className="nav-text-link">
        <h1 ref={navTextRef} id="nav-text" className="nav-text" onClick={handleClick}>
          Satta Pai
        </h1>
      </a>
      <div className="icons">
      {isLoggedIn ? (
          <div 
            className="user-menu"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="greeting">
              Hi, {username} <img src={assets.user_icon} alt="User Icon" />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={() => profile()}>Profile</button>
                <button onClick={() => order()}>My Orders</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="profile" onClick={() => navigate('/login')}>
            <img src={assets.user_icon} alt="User Icon" />
          </div>
        )}
        <div className="cart-icon-container" onClick={cartClick}>
          <img src={assets.cart_icon} alt="Cart Icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <div className={`line line1 ${isMobileMenuOpen ? 'rotate45' : ''}`}></div>
        <div className={`line line2 ${isMobileMenuOpen ? 'opacity0' : ''}`}></div>
        <div className={`line line3 ${isMobileMenuOpen ? 'rotate135' : ''}`}></div>
      </div>
    </nav>
  );
};

export default NavBar;