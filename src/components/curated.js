import './curated.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/images/assets';

const Curated = () => {
  const navigate = useNavigate();

  const handleImageClick = (subCategory) => {
    navigate(`/products/${subCategory}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="options">
      <h1>CURATED BY SATTA PAI</h1>
      <div className="option-images">
        <div className="image-container" onClick={() => handleImageClick('T-Shirts')}>
          <img src={assets.tshirt} alt="tshirt" />
          <p>Tees</p>
        </div>
        <div className="image-container" onClick={() => handleImageClick('Sweatshirts')}>
          <img src={assets.sweatshirt} alt="sweatshirt" />
          <p>Sweat Shirt</p>
        </div>
        <div className="image-container" onClick={() => handleImageClick('Hoodies')}>
          <img src={assets.hoodie} alt="hoodie" />
          <p>Hoodies</p>
        </div>
        <div className="image-container" onClick={() => handleImageClick('Oversized Tees')}>
          <img src={assets.oversized} alt="oversized" />
          <p>Oversized Tees</p>
        </div>
      </div>
    </div>
  );
};

export default Curated;