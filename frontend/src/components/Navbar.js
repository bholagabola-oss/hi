import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Huli<span className="logo-accent">magic</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/pricing" className={location.pathname === '/pricing' ? 'nav-link active' : 'nav-link'}>Pricing</Link>
          <a href="#features" className="nav-link">Features</a>
        </div>

        <div className="navbar-actions">
          <Link to="/dashboard" className="btn btn-secondary btn-sm">Dashboard</Link>
          <Link to="/editor" className="btn btn-primary btn-sm">Start Free</Link>
        </div>
      </div>
    </nav>
  );
}
