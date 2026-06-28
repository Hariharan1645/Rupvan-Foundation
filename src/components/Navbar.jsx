import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import client from "../contexts/ContentfulClient";
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [links, setLinks] = useState([]);
  const [logo, setLogo] = useState(null);

  // Fetch navbar data from Contentful
  useEffect(() => {
    client.getEntries({ content_type: 'navbar' })
      .then((res) => {
        if (res.items.length > 0) {
          const navbarData = res.items[0].fields;
          setLogo(navbarData.logo?.fields?.file?.url);
          setLinks(navbarData.links || []);
        }
      })
      .catch(console.error);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
            {logo && <img src={logo} alt="Rupvan Logo" className="navbar-logo" />}
            Rupvan Foundation
          </NavLink>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            {links.map((link, index) => (
              <NavLink 
                key={index}
                to={link.fields.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.fields.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          {links.map((link, index) => (
            <NavLink 
              key={index}
              to={link.fields.path}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {link.fields.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;