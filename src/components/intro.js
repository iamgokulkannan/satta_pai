import React, { useState, useEffect } from 'react';
import { assets } from '../assets/images/assets';
import './intro.css';


const Intro = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="heroImg">
        <img src={assets.hero} alt="Hero" className="heroBanner" />
      </div>
      <div className={`heroText ${isScrolled ? 'scrolled' : ''}`}>
        <h1>Satta Pai</h1>
      </div>
      <div className={`slogan ${isScrolled ? 'scrolled' : ''}`}>
        <h1>The tribe of clothes you wanted till now</h1>
      </div>
    </section>
  );
};

export default Intro;