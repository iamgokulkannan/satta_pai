import './curated.css';
import React from 'react';
import tshirt from '../assets/images/tshirt.png';
import sweatshirt from '../assets/images/sweatshirt.png';
import hoodie from '../assets/images/hoodie.png';
import oversized from '../assets/images/oversized.png';

const Curated = () => {
    return (
        <div className="options">
            <h1>CURATED BY SATTA PAI</h1>
            <div className="option-images">
                <div className="image-container">
                    <img src={tshirt} alt="tshirt" />
                    <p>Tees</p>
                </div>
                <div className="image-container">
                    <img src={sweatshirt} alt="sweatshirt" />
                    <p>Sweat Shirt</p>
                </div>
                <div className="image-container">
                    <img src={hoodie} alt="hoodie" />
                    <p>Hoodies</p>
                </div>
                <div className="image-container">
                    <img src={oversized} alt="oversized" />
                    <p>Oversized Tees</p>
                </div>
            </div>
        </div>
    );
};

export default Curated;