import React, { useState, useEffect, useRef } from "react";
import "../Css/Contact.css";
import client from "../contexts/ContentfulClient";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import emailjs from "emailjs-com";
import { MapPin, Phone, Mail } from "lucide-react";

function Contact() {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [focusedField, setFocusedField] = useState(null);

  // Contentful data states
  const [header, setHeader] = useState({ title: "", description: "" });
  const [visitUs, setVisitUs] = useState(null);
  const [callUs, setCallUs] = useState(null);
  const [emailUs, setEmailUs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Contentful data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await client.getEntries({
          content_type: "contactPage", // Adjust to your actual content type ID
        });

        if (response.items.length > 0) {
          const data = response.items[0].fields;
          
          setHeader({
            title: data.title || "Get in Touch",
            description: data.description || "We'd love to hear from you",
          });
          
          setVisitUs(data.visitUs);
          setCallUs(data.callUs);
          setEmailUs(data.emailUs);
        }
      } catch (error) {
        console.error("Error fetching Contentful data:", error);
        // Set default values on error
        setHeader({
          title: "Get in Touch",
          description: "We'd love to hear from you",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) setErrors({ ...errors, [name]: "" });

    // Clear submit message
    if (submitMessage.text) setSubmitMessage({ type: "", text: "" });
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters long";

    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (
      formData.phone.trim() &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ""))
    )
      newErrors.phone = "Please enter a valid phone number";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitMessage({
        type: "error",
        text: "Please correct the errors below and try again.",
      });

      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = formRef.current?.querySelector(
          `[name="${firstErrorField}"]`
        );
        errorElement?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        "service_ck1iz1k",
        "template_fdwo40f",
        {
          from_name: formData.name,
          from_email: formData.email,
          from_phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          submitted_at: new Date().toLocaleString(),
        },
        "Fp-fIcpFuBdytxFT9"
      );

      console.log("EmailJS result:", result.text);

      setSubmitMessage({
        type: "success",
        text: "Thank you for reaching out! We will get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitMessage({
        type: "error",
        text: "Failed to send your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    { value: "", label: "Select a subject..." },
    { value: "general-inquiry", label: "General Inquiry" },
    { value: "volunteer", label: "Volunteer Opportunities" },
    { value: "donations", label: "Donations & Funding" },
    { value: "services", label: "Our Services" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" },
  ];

  if (loading) {
    return (
      <div className="contact-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      {/* Header */}
      <div className="contact-header">
        <h1>{header.title}</h1>
        <p>{header.description}</p>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        {/* Form */}
        <div ref={formRef}>
          <div className="contact-form">
            <div className="form-header">
              <h2>Send us a Message</h2>
            </div>
            {submitMessage.text && (
              <div className={`form-message ${submitMessage.type}`} role="alert">
                {submitMessage.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className={`contact-form-group ${focusedField === "name" ? "focused" : ""}`}>
                <label htmlFor="contact-name">
                  Full Name <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="contact-input"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className={`contact-form-group ${focusedField === "email" ? "focused" : ""}`}>
                <label htmlFor="contact-email">
                  Email <span className="text-orange">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="contact-input"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className={`contact-form-group ${focusedField === "phone" ? "focused" : ""}`}>
                <label htmlFor="contact-phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  className="contact-input"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => handleFocus("phone")}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>

              {/* Subject */}
              <div className={`contact-form-group ${focusedField === "subject" ? "focused" : ""}`}>
                <label htmlFor="contact-subject">
                  Subject <span className="text-orange">*</span>
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="contact-input"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus("subject")}
                  onBlur={handleBlur}
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.subject && <div className="form-error">{errors.subject}</div>}
              </div>

              {/* Message */}
              <div className={`contact-form-group ${focusedField === "message" ? "focused" : ""}`}>
                <label htmlFor="contact-message">
                  Message <span className="text-orange">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  className="contact-textarea"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus("message")}
                  onBlur={handleBlur}
                  placeholder="Your message..."
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <div className="submit-container">
                <button type="submit" disabled={isSubmitting} className={`contact-submit-btn ${isSubmitting ? "loading" : ""}`}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Dynamic Contact Info */}
        <div className="contact-info-section">
          {/* Visit Us */}
          {visitUs && (
            <div className="contact-info-card">
              <div className="contact-info-header">
                <div className="contact-icon" aria-hidden="true">
                  <MapPin size={24} style={{ color: "var(--secondary-gold)" }} />
                </div>
                <h3>Visit Us</h3>
              </div>
              <div className="contact-details">
                {documentToReactComponents(visitUs)}
              </div>
            </div>
          )}

          {/* Call Us */}
          {callUs && (
            <div className="contact-info-card">
              <div className="contact-info-header">
                <div className="contact-icon" aria-hidden="true">
                  <Phone size={24} style={{ color: "var(--secondary-gold)" }} />
                </div>
                <h3>Call Us</h3>
              </div>
              <div className="contact-details">
                {callUs.numbers?.map((item, i) => (
                  <p key={i}><strong>{item.label}:</strong><br />
                    <a href={`tel:${item.number}`}>{item.number}</a>
                  </p>
                ))}
                <div className="quick-actions">
                  {callUs.quickActions?.map((action, i) => (
                    <a key={i} href={action.url} target="_blank" rel="noopener noreferrer" className="quick-action-btn">
                      <span aria-hidden="true">{action.icon}</span> {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Email Us */}
          {emailUs && (
            <div className="contact-info-card">
              <div className="contact-info-header">
                <div className="contact-icon" aria-hidden="true">
                  <Mail size={24} style={{ color: "var(--secondary-gold)" }} />
                </div>
                <h3>Email Us</h3>
              </div>
              <div className="contact-details">
                {emailUs.emails?.map((item, i) => (
                  <p key={i}><strong>{item.label}:</strong><br />
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </p>
                ))}
                <div className="quick-actions">
                  {emailUs.quickActions?.map((action, i) => (
                    <a key={i} href={action.url} target="_blank" rel="noopener noreferrer" className="quick-action-btn">
                      <span aria-hidden="true">{action.icon}</span> {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;