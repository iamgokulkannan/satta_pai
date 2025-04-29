import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navBar.css';
import { assets } from '../assets/images/assets'; // Adjust the import as needed
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import SearchBar from './SearchBar';

const NavBar = ({ disableScrollEffect, username, setUsername, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const introTextRef = useRef(null);
  const navTextRef = useRef(null);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Track dropdown visibility
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null); // Add ref for dropdown menu

  const auth = getAuth();
  const db = getFirestore();

  // Add useEffect for handling dropdown hover behavior
  useEffect(() => {
    const handleMouseEnter = () => {
      setShowDropdown(true);
    };
    
    const handleMouseLeave = () => {
      setShowDropdown(false);
    };
    
    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener('mouseenter', handleMouseEnter);
      dropdownElement.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener('mouseenter', handleMouseEnter);
        dropdownElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

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

    // Prevent scroll on search focus
    const preventScrollOnSearch = (e) => {
      if (e.target.closest('.search-container')) {
        e.preventDefault();
      }
    };

    document.addEventListener('focusin', preventScrollOnSearch, true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', preventScrollOnSearch, true);
    };
  }, [disableScrollEffect]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalQuantity);
  
    // Listen for user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(username || user.displayName || user.email.split('@')[0]);
        
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });
  
    return () => unsubscribe();
  }, [auth, navigate, username, setUsername, db]);
  
  const cartClick = () => {
    navigate('/cart');
    window.scrollTo(0, 0);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Clear local storage cart
      localStorage.removeItem('cart');
      
      // Sign out from Firebase
      await signOut(auth);
      setIsLoggedIn(false);
      setUsername('');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };
  
  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <div className="nav-content">
        <SearchBar />
        <Link to="/" className="logo">
          <img src={assets.logo} alt="Satta Pai" />
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products/all" className="nav-link">Products</Link>
          {isLoggedIn ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-button"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => {
                  if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
                    setShowDropdown(false);
                  }
                }}
              >
                {username}
              </button>
              <div 
                className={`dropdown-menu ${showDropdown ? '' : 'hidden'}`}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/orders" className="dropdown-item">Orders</Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="dropdown-item">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
          <Link to="/cart" className="cart-link" onClick={cartClick}>
            <img src={assets.cart} alt="Cart" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
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