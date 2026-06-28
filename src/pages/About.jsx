import React, { useEffect, useState } from "react";
import client from "../contexts/ContentfulClient";
import { Target, Compass, Award } from "lucide-react";
import "../Css/About.css";

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client
      .getEntries({ content_type: "aboutPage" })
      .then((res) => {
        if (res.items.length > 0) {
          setData(res.items[0].fields);
        }
      })
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="about-container">
      {/* ================= HERO SECTION ================= */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">{data.heroTitle}</h1>
          <p className="about-hero-subtitle">{data.heroSubtitle}</p>
        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="story-section">
        <div className="section-header">
          <h2 className="section-title">{data.storyTitle}</h2>
        </div>
        <div className="story-content">{data.storyDescription}</div>
      </section>

      {/* ================= MISSION & VISION SECTION ================= */}
      <section className="mission-vision-section">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <div className="card-icon">
              <Target size={42} strokeWidth={2} style={{ color: "var(--primary-blue)" }} />
            </div>
            <h3 className="card-title">{data.missionTitle}</h3>
            <p className="card-description">{data.missionDescription}</p>
          </div>
          <div className="vision-card">
            <div className="card-icon">
              <Compass size={42} strokeWidth={2} style={{ color: "var(--secondary-gold)" }} />
            </div>
            <h3 className="card-title">{data.visionTitle}</h3>
            <p className="card-description">{data.visionDescription}</p>
          </div>
        </div>
      </section>

      {/* ================= VALUES SECTION ================= */}
      {data.values && (
        <section className="values-section">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {data.values.map((value, index) => (
              <div key={index} className="value-item">
                <div className="value-icon">
                  <Award size={36} strokeWidth={2} />
                </div>
                <h3 className="value-title">{value.fields.valueTitle}</h3>
                <p className="value-description">
                  {value.fields.valueDescription}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= TEAM SECTION ================= */}
      {data.teamMembers && (
        <section className="team-section">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="team-grid">
            {data.teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                {member.fields.image && (
                  <img
                    src={"https:" + member.fields.image.fields.file.url}
                    alt={member.fields.name}
                    className="team-image"
                  />
                )}
                <h3 className="team-name">{member.fields.name}</h3>
                <p className="team-role">{member.fields.role}</p>
                {member.fields.description && (
                  <p className="team-description">
                    {member.fields.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}