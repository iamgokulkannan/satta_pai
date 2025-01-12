import React from 'react';
import './infinteScrollReverse.css';
import image1 from '../assets/images/slider2_1.png';
import image2 from '../assets/images/slider2_2.png';
import image3 from '../assets/images/slider2_3.png';
import image4 from '../assets/images/slider2_4.png';
import image5 from '../assets/images/slider2_5.png';
import image6 from '../assets/images/slider2_6.png';
import image7 from '../assets/images/slider2_7.png';
import image8 from '../assets/images/slider2_8.png';
import image9 from '../assets/images/slider2_9.png';

const InfinteScrolReverse = () => {
  const images = [image9, image8, image7, image6, image5, image4, image3, image2, image1];
  
  return (
    <div className="logos-reverse">
      <div className="logos-slide-reverse">
        {/* Render images in reverse order, and repeat the sequence */}
        {Array(10).fill().map((_, index) => (
          <React.Fragment key={index}>
            {images.map((image, i) => (
              <img key={i} src={image} alt={`Hero ${9 - i}`} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InfinteScrolReverse;