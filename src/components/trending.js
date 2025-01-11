import React from 'react';
import './trending.css';
import image1 from '../assets/slider2_1.png';
import image2 from '../assets/slider2_2.png';
import image3 from '../assets/slider2_3.png';
import image4 from '../assets/slider2_4.png';
import image5 from '../assets/slider2_5.png';
import image6 from '../assets/slider2_6.png';
import image7 from '../assets/slider2_7.png';
import image8 from '../assets/slider2_8.png';
import image9 from '../assets/slider2_9.png';

const Trending = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9];

  return (
    <div>
      <div className="slider">
        <div className="list">
          {images.map((image, index) => (
            <div
              className="item"
              key={index}
              style={{
                '--position': index + 1,
                animationDelay: `${(10 / images.length) * index}s`, // Stagger delay
              }}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="slider-reverse">
        <div className="list">
          {images.map((image, index) => (
            <div
              className="item"
              key={index}
              style={{
                '--position': index + 1,
                animationDelay: `${(10 / images.length) * index}s`, // Stagger delay
              }}
            >
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;