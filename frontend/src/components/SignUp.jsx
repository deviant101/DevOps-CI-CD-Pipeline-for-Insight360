// src/components/SignUp.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './SignUp.css';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Making request to:', '/api/auth/register');
            console.log('Request data:', { fullName, email, password });
            const response = await axios.post('/api/auth/register', { fullName, email, password });
            console.log('Response:', response);
            if (response && response.data) {
                login(response.data);
                navigate('/');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error details:', error);
            console.error('Error response:', error.response);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Sign Up</h2>
                <p className="signup-subtitle">Create an account to get started</p>
                {error && <p className="error-message">{error}</p>}
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="signup-footer">
                    Already have an account? <Link to="/signin">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;