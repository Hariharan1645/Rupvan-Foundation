import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Services.css";
import client from "../contexts/ContentfulClient";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    client
      .getEntries({ content_type: "services" }) // make sure this matches your Services content type ID in Contentful
      .then((response) => {
        setServices(response.items);
      })
      .catch(console.error);
  }, []);

  if (!services.length) return <div>Loading services...</div>;

  return (
    <div className="services-container">
      <h1 className="services-title">Our Comprehensive Services</h1>
      <p className="services-subtitle">
        We provide a full range of services designed to ensure the health, happiness, 
        and well-being of every resident at Rupvan Foundation.
      </p>

      <div className="services-grid">
        {services.map((service, index) => {
          const fields = service.fields;
          return (
            <div key={index} className="service-card">
              <div className="service-image-container">
                {fields.serviceImage?.map((img, i) => (
                  <img
                    key={i}
                    src={"https:" + img.fields.file.url}
                    alt={fields.serviceTitle}
                    className="service-image"
                  />
                ))}
              </div>

              <div className="service-content">
                <h3 className="service-title">{fields.serviceTitle}</h3>
                <p className="service-description">{fields.serviceDescription}</p>
                
                <ul className="service-features">
                  {fields.serviceFeatures?.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>

                <Link to="/contact" className="service-cta">
                  Learn More
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="services-action">
        <h2 className="services-action-title">Ready to Learn More?</h2>
        <p className="services-action-text">
          Contact us today to schedule a visit and see how our comprehensive services 
          can provide the care and support your loved ones deserve.
        </p>
        <div className="services-action-buttons">
          <Link to="/contact" className="action-btn-primary">Contact Us</Link>
          <Link to="/about" className="action-btn-secondary">About Us</Link>
        </div>
      </div>
    </div>
  );
}