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
                    <p>tshirt</p>
                </div>
                <div className="image-container">
                    <img src={sweatshirt} alt="sweatshirt" />
                    <p>sweatshirt</p>
                </div>
                <div className="image-container">
                    <img src={hoodie} alt="hoodie" />
                    <p>hoodie</p>
                </div>
                <div className="image-container">
                    <img src={oversized} alt="oversized" />
                    <p>oversized</p>
                </div>
            </div>
        </div>
    );
};

export default Curated;