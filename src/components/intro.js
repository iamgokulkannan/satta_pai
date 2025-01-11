import React, { useState, useEffect } from 'react';
import hero from '../assets/hero.jpg';
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
        <img src={hero} alt="Hero" className="heroBanner" />
      </div>
      <div className={`heroText ${isScrolled ? 'scrolled' : ''}`}>
        <h1>Satta Pai</h1>
      </div>
    </section>
  );
};

export default Intro;