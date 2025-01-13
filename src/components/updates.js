import './updates.css';
import React from 'react';

const Updates = () => {
    return (
        <div className="updates">
            <div className="updates-sign-up">
                <p>SIGN UP FOR LATEST UPDATES</p>
            </div>
            <div className="updates-text">
                <p>Get exclusive updates on the collection's launch</p>
            </div>
            <div className="subscribe">
                <div className="input-container">
                    <input type="text" placeholder="subscribe@gmail.com" />
                    <button className="submit-btn">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default Updates;