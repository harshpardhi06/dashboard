import React, { useState } from 'react';
import './LoginPage.css';

export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would validate credentials here
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">आ</div>
          <h2 className="login-title">Dashboard Login</h2>
          <p className="login-subtitle">Login to view complete WhatsApp Services analytics</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {/* <label className="form-label" htmlFor="email">Email Address</label> */}
            <input
              className="form-input"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            {/* <label className="form-label" htmlFor="password">Password</label> */}
            <input
              className="form-input"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        {/* <div className="login-footer">
          <p>Don't have an account? <a href="#">Request access</a></p>
        </div> */}
      </div>
    </div>
  );
};
