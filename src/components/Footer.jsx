import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../contexts/ContentfulClient";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const [footerInfo, setFooterInfo] = useState(null);
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, linksRes, socialsRes, contactRes] = await Promise.all([
          client.getEntries({ content_type: "footerInfo" }),
          client.getEntries({ content_type: "footerLinks" }),
          client.getEntries({ content_type: "socialMediaLinks" }),
          client.getEntries({ content_type: "contactInformation" }),
        ]);

        setFooterInfo(infoRes.items[0]?.fields || null);
        setFooterLinks(linksRes.items.map((item) => item.fields));
        setSocialLinks(socialsRes.items.map((item) => item.fields));
        setContactInfo(contactRes.items.map((item) => item.fields));
      } catch (err) {
        console.error("Error fetching footer data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* About Section */}
          <div className="footer-section">
            <h4 className="footer-title">Rupvan Foundation</h4>
            <p className="footer-about">
              {footerInfo?.aboutText ||
                "Caring for elders with love, respect, and dignity."}
            </p>
            <p className="footer-tagline">
              {footerInfo?.tagline ||
                "Every elder deserves respect, care, and a loving home."}
            </p>

            {/* Social Media Links */}
            <div className="social-links">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                  >
                    {social.icon?.fields?.file?.url ? (
                      <img
                        src={social.icon.fields.file.url}
                        alt={social.platform}
                        className="social-icon"
                      />
                    ) : (
                      social.platform
                    )}
                  </a>
                ))
              ) : (
                <p>No social links available</p>
              )}
            </div>
          </div>

          {/* 🟢 Quick Links Section */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/gallery">Gallery</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* 🟢 Contact Information Section */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Information</h4>
            <div className="contact-info">
              {contactInfo.length > 0 ? (
                contactInfo.map((contact, index) => (
                  <div className="contact-item" key={index}>
                    {contact.iconSvg && (
                      <span
                        className="contact-icon"
                        dangerouslySetInnerHTML={{ __html: contact.iconSvg }}
                      ></span>
                    )}
                    <div className="contact-text">
                      {contact.link ? (
                        <a href={contact.link} className="contact-link">
                          {contact.value}
                        </a>
                      ) : (
                        <span>{contact.value}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "gray" }}>No contact info found.</p>
              )}
            </div>
          </div>
        </div>

        {/* 🟢 Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} Rupvan Foundation. All rights reserved.
          </div>
          <div className="footer-credits">Made with ❤️ for our beloved elders</div>
          <div className="footer-credits">By Manjushree Iyer and Hariharan Malwad</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;