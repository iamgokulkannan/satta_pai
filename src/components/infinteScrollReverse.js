import React from 'react';
import { useNavigate } from 'react-router-dom';
import './infinteScrollReverse.css';
import { assets, products } from '../assets/images/assets';

const InfinteScrollReverse = () => {
  const navigate = useNavigate(); 

  const imageSources = [
    assets.slider9,
    assets.slider8,
    assets.slider7,
    assets.slider6,
    assets.slider5,
    assets.slider4,
    assets.slider3,
    assets.slider2,
    assets.slider1,
  ];

  const handleImageClick = (productId, index) => {
    // Calculate the actual product index based on the clicked image index
    const productIndex = (products.length - (index % products.length)) - 1; 
    navigate(`/productDetails/${products[productIndex]._id}`);
  };

  return (
    <div className="logos-reverse">
      {products.map((product, productIndex) => (
        <div
          key={product._id}
          className="logos-slide-reverse"
        >
          {imageSources.map((src, index) => (
            <img 
              key={index} 
              src={src} 
              alt={`Hero ${index + 1}`} 
              onClick={() => handleImageClick(product._id, index)} 
            /> 
          ))}
          {/* Repeat the images for infinite scroll effect */}
          {imageSources.slice().concat(imageSources).map((src, index) => (
            <img 
              key={index + imageSources.length} 
              src={src} 
              alt={`Hero ${index + imageSources.length + 1}`} 
              onClick={() => handleImageClick(product._id, index + imageSources.length)} 
            /> 
          ))}
        </div>
      ))}
    </div>
  );
};

export default InfinteScrollReverse;