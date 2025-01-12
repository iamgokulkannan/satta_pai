import React from 'react';
import './infinteScroll.css';
import image1 from '../assets/slider2_1.png';
import image2 from '../assets/slider2_2.png';
import image3 from '../assets/slider2_3.png';
import image4 from '../assets/slider2_4.png';
import image5 from '../assets/slider2_5.png';
import image6 from '../assets/slider2_6.png';
import image7 from '../assets/slider2_7.png';
import image8 from '../assets/slider2_8.png';
import image9 from '../assets/slider2_9.png';

const InfinteScroll = () => {
  return (
    <div class="logos">
      <div class="logos-slide">
      <img src={image1} alt='Hero 1'/>
      <img src={image2} alt='Hero 2'/>
      <img src={image3} alt='Hero 3'/>
      <img src={image4} alt='Hero 4'/>
      <img src={image5} alt='Hero 5'/>
      <img src={image6} alt='Hero 6'/>
      <img src={image7} alt='Hero 7'/>
      <img src={image8} alt='Hero 8'/>
      <img src={image9} alt='Hero 9'/>
      <img src={image1} alt='Hero 1'/>
      <img src={image2} alt='Hero 2'/>
      <img src={image3} alt='Hero 3'/>
      <img src={image4} alt='Hero 4'/>
      <img src={image5} alt='Hero 5'/>
      <img src={image6} alt='Hero 6'/>
      <img src={image7} alt='Hero 7'/>
      <img src={image8} alt='Hero 8'/>
      <img src={image9} alt='Hero 9'/>
      </div>
  </div>
  );
};

export default InfinteScroll;