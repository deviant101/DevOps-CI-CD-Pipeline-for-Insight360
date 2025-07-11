import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
    return (
        <div className="newsletter-section">
            <h2>Subscribe to the newsletter</h2>
            <p>Get a weekly digest of our most important stories direct to your inbox.</p>

            <div className="newsletter-input">
                <input type="email" placeholder="Enter Your Mail" />
                <button>Send Now</button>
            </div>

            <div className="disclaimer"><p>Place some disclaimer text here about how subscriber’s email, Privacy Policy and all that.</p></div>
        </div>
    );
};

export default Newsletter;