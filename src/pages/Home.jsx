import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Css/Home.css";
import client from "../contexts/ContentfulClient";

const heroSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
};

const gallerySettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } },
  ],
};

export default function Home() {
  const [data, setData] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [faqField, setFaqField] = useState("FAQs"); // detected FAQ key

  useEffect(() => {
    client
      .getEntries({ content_type: "homePage", include: 10 })
      .then((response) => {
        if (response.items.length > 0) {
          const fields = response.items[0].fields;

          // Detect FAQ field automatically
          const faqKey = Object.keys(fields).find((key) =>
            key.toLowerCase().includes("faq")
          );
          setFaqField(faqKey || null);

          setData(fields);
          console.log("Fetched HomePage data:", JSON.stringify(fields, null, 2));
          console.log("Detected FAQ field:", faqKey);
        } else {
          console.warn("No HomePage entry found in Contentful.");
        }
      })
      .catch((error) => console.error("Contentful Error:", error));
  }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  if (!data) return <div>Loading...</div>;



  // Get FAQ data safely
  const faqs = faqField ? data[faqField] : [];

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <Slider {...heroSettings}>
          {data.heroImages?.map((img, index) => (
            <div key={index}>
              <img
                src={`https:${img.fields.file.url}`}
                alt={img.fields.title || `Hero ${index + 1}`}
                className="hero-image"
              />
            </div>
          ))}
        </Slider>
        <div className="hero-content">
          <h1 className="hero-title">{data.heroTitle}</h1>
          <p className="hero-subtitle">{data.heroSubtitle}</p>
          <div className="hero-buttons">
            {data.heroButtons?.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                className={btn.type === "primary" ? "btn-primary" : "btn-secondary"}
              >
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-header">
          <h2 className="section-title">{data.missionTitle}</h2>
        </div>
        <p className="mission-content">{data.missionDescription}</p>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="section-header">
          <h2 className="section-title">{data.galleryTitle}</h2>
        </div>
        <Slider {...gallerySettings}>
          {data.galleryMedia?.map((img, index) => (
            <div key={index} className="gallery-slide">
              <img
                src={`https:${img.fields.file.url}`}
                alt={img.fields.title || `Gallery ${index + 1}`}
                className="gallery-image"
              />
            </div>
          ))}
        </Slider>
        {data.galleryButton && (
          <div className="center-btn">
            <a href={data.galleryButton.link} className="btn-primary">
              {data.galleryButton.label}
            </a>
          </div>
        )}
      </section>

      {/* Programs Section */}
      <section className="programs-section">
        <div className="section-header">
          <h2 className="section-title">Our Programs</h2>
        </div>
        <div className="programs-grid">
          {data.programs?.map((program, index) => (
            <div key={index} className="program-card">
              <h3 className="program-title">{program.fields.programTitle}</h3>
              <p className="program-description">{program.fields.programDescription}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Clients Say</h2>
        </div>
        <div className="testimonial-cards">
          {data.testimonials?.map((t, index) => (
            <div key={index} className="testimonial-card">
              <p>{t.fields.message}</p>
              <h4>{t.fields.author}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-container">
          {faqs && faqs.length > 0 ? (
            faqs.map((faqItem, index) => {
              // Detect question and answer keys dynamically
              const questionKey = Object.keys(faqItem.fields || {}).find((key) =>
                key.toLowerCase().includes("question")
              );
              const answerKey = Object.keys(faqItem.fields || {}).find((key) =>
                key.toLowerCase().includes("answer")
              );

              const question = questionKey ? faqItem.fields[questionKey] : "No question provided";
              const answer = answerKey ? faqItem.fields[answerKey] : "No answer provided";

              return (
                <div key={faqItem.sys.id} className={`faq-item ${activeFAQ === index ? "active" : ""}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={activeFAQ === index}
                  >
                    <h3>{question}</h3>
                  </button>
                  <div className="faq-answer-wrapper">
                    <div className="faq-answer">
                      <p>{answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No FAQs available at the moment.</p>
          )}
        </div>
      </section>

    </div>
  );
}
