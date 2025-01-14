import './curated.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/images/assets';

const Curated = () => {
    return (
        <div className="options">
            <h1>CURATED BY SATTA PAI</h1>
            <div className="option-images">
                <div className="image-container">
                    <Link to="/teesPage">
                        <img src={assets.tshirt} alt="tshirt" />
                        <p>Tees</p>
                    </Link>
                </div>
                <div className="image-container">
                    <Link to="/sweatShirtsPage">
                        <img src={assets.sweatshirt} alt="sweatshirt" />
                        <p>Sweat Shirt</p>
                    </Link>
                </div>
                <div className="image-container">
                    <Link to="/hoodiesPage">
                        <img src={assets.hoodie} alt="hoodie" />
                        <p>Hoodies</p>
                    </Link>
                </div>
                <div className="image-container">
                    <Link to="/overSizedTeesPage">
                        <img src={assets.oversized} alt="oversized" />
                        <p>Oversized Tees</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Curated;