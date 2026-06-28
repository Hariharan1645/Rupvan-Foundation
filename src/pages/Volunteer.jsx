import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import "../Css/Volunteer.css";

function Volunteer() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    availability: "",
    skills: "",
    experience: "",
    motivation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");
    setShowSuccess(false);

    try {
      const result = await emailjs.send(
        "service_3795nqa",
        "template_qqtat5d",
        {
          from_name: formData.name,
          from_email: formData.email,
          from_phone: formData.phone,
          availability: formData.availability,
          skills: formData.skills,
          experience: formData.experience,
          motivation: formData.motivation,
          submitted_at: new Date().toLocaleString(),
        },
        "Fp-fIcpFuBdytxFT9"
      );

      console.log("Volunteer Email Sent:", result);
      setShowSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        availability: "",
        skills: "",
        experience: "",
        motivation: "",
      });

      setTimeout(() => setShowSuccess(false), 5000);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("EmailJS Submission Error:", error);
      setServerError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="volunteer-container">
      {/* Hero Section */}
      <div className="volunteer-hero">
        <h1 className="volunteer-title">Become a Volunteer</h1>
        <p className="volunteer-subtitle">
          Join our compassionate community and make a meaningful difference in
          the lives of our beloved elders. Your time, skills, and kindness can
          bring joy, companionship, and support to those who have given so much
          to society.
        </p>

        <div className="volunteer-stats">
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Active Volunteers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Hours Monthly</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Lives Touched</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="volunteer-form-container">
        <div className="form-header">
          <h2 className="form-title">Volunteer Application Form</h2>
          <p className="form-subtitle">
            Fill out the form below and we'll get in touch with you to discuss
            volunteer opportunities that match your interests and availability.
          </p>
        </div>

        {showSuccess && (
          <div className="success-message">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Thank you for signing up as a volunteer! We'll be in touch soon.
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="volunteer-form">
          <div className="form-group form-row">
            <div>
              <label className="form-label required">Full Name</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? "error" : ""}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <div className="error-message">⚠ {errors.name}</div>
              )}
            </div>

            <div>
              <label className="form-label required">Email Address</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <div className="error-message">⚠ {errors.email}</div>
              )}
            </div>
          </div>

          <div className="form-group form-row">
            <div>
              <label className="form-label required">Phone Number</label>
              <div className="input-with-icon">
                <svg
                  className="input-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.phone && (
                <div className="error-message">⚠ {errors.phone}</div>
              )}
            </div>

            <div>
              <label className="form-label">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select your availability</option>
                <option value="weekdays-morning">
                  Weekdays - Morning (9 AM - 12 PM)
                </option>
                <option value="weekdays-afternoon">
                  Weekdays - Afternoon (2 PM - 5 PM)
                </option>
                <option value="weekdays-evening">
                  Weekdays - Evening (6 PM - 8 PM)
                </option>
                <option value="weekends-morning">
                  Weekends - Morning (9 AM - 12 PM)
                </option>
                <option value="weekends-afternoon">
                  Weekends - Afternoon (2 PM - 5 PM)
                </option>
                <option value="weekends-evening">
                  Weekends - Evening (6 PM - 8 PM)
                </option>
                <option value="flexible">Flexible timings</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills & Interests</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
              placeholder="Please describe your skills, hobbies, or interests..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Volunteer Experience</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="Tell us about any previous volunteer work or experience..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">What Motivates You?</label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              rows="3"
              className="form-textarea"
              placeholder="What inspired you to volunteer with us?"
            />
          </div>

          <div className="submit-section">
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting Application..."
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Join Our Volunteer Family
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Why Volunteer Section */}
      <div className="why-volunteer">
        <h2 className="why-volunteer-title">Why Volunteer With Us?</h2>
        <p className="why-volunteer-text">
          Volunteering at Rupvan Foundation is more than just giving back – it's
          about creating meaningful connections and sharing experiences.
        </p>

        <div className="impact-cards">
          <div className="impact-card">
            <div className="impact-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h4 className="impact-title">Make a Real Impact</h4>
            <p className="impact-description">
              Your presence and care directly improve the quality of life for
              our residents.
            </p>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h4 className="impact-title">Build Connections</h4>
            <p className="impact-description">
              Form meaningful relationships with residents and fellow
              volunteers.
            </p>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="impact-title">Personal Growth</h4>
            <p className="impact-description">
              Gain valuable experience while developing empathy and life skills.
            </p>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="impact-title">Flexible Schedule</h4>
            <p className="impact-description">
              Choose volunteer opportunities that fit your availability and
              interests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Volunteer;