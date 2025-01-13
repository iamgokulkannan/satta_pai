import './footer.css';
import React from 'react';


const Footer = () => {
    return (
        <div className="footer">
            <div className="updates">
                <div className="updates-sign-up">
                    <p>Subscribe to our emails</p>
                </div>
                <div className="updates-text">
                    <p>Subscribe to our mailing list for insider news, product launches, and more.</p>
                </div>
                <div className="subscribe">
                    <div className="input-container">
                        <input type="text" placeholder="subscribe@gmail.com" />
                        <button className="submit-btn">Submit</button>
                    </div>
                </div>
            </div>
            <div className="branding-and-links">
                <div className="branding">
                    <div className="satta-pai">
                        <p>Satta Pai</p>
                    </div>
                    <div className="branding-text">
                        <p>Welcome to Satta Pai <br/>The tribe of clothes -<br/>you wanted till now.</p>
                    </div>
                </div>
                <div className="quick-links">
                    <p>Quick Links</p>
                    <a href="/" className="quickLink">Tees</a>
                    <a href="/" className="quickLink">Hoodies</a>
                    <a href="/" className="quickLink">Sweat Shirts</a>
                    <a href="/" className="quickLink">Oversized Tshirts</a>
                </div>
            </div>
            <div className="footer-brand">Satta Pai</div>
            <div className="copyrights">&copy; Satta Pai | All Rights Reserved</div>
        </div>
    );
};

export default Footer;