import React from 'react';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-section about">
                <h2>About Us</h2>
                <p>
                    This is a news website providing the latest updates on various topics.
                    Stay tuned for more information.
                </p>
            </div>
            <div className="footer-section links">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
            </div>
            <div className="footer-section contact">
                <h2>Contact Us</h2>
                <p>Email: info@newswebsite.com</p>
                <p>Phone: +123 456 7890</p>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; Copyright 2024 All rights reserved | Site made by Farrukh.
        </div>
    </footer>
);

export default Footer;