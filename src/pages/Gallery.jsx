import React, { useState, useEffect } from "react";
import "../Css/Gallery.css";
import client from "../contexts/ContentfulClient";

function Gallery() {
  const [header, setHeader] = useState({ title: "", description: "" });
  const [galleryImages, setGalleryImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch Gallery Page (header and description)
    client
      .getEntries({ content_type: "galleryPage", include: 2 })
      .then((response) => {
        if (response.items.length > 0) {
          const page = response.items[0].fields;
          setHeader({ title: page.title, description: page.description });

          // Map gallery images from references
          const images = page.imagesGallery.map((item) => ({
            id: item.sys.id,
            title: item.fields.title,
            description: item.fields.description,
            src: "https:" + item.fields.image.fields.file.url,
            category: item.fields.category.toLowerCase(),
            alt: item.fields.altText || item.fields.title,
          }));

          setGalleryImages(images);
          setFilteredImages(images);
        }
      })
      .catch(console.error);
  }, []);

  // Compute categories dynamically
  const categories = [
    { key: "all", label: "All Photos", count: galleryImages.length },
    ...Array.from(new Set(galleryImages.map((img) => img.category))).map((cat) => ({
      key: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: galleryImages.filter((img) => img.category === cat).length,
    })),
  ];

  const handleFilter = (category) => {
    setActiveFilter(category);
    setVisibleImages(6);
    if (category === "all") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter((img) => img.category === category));
    }
  };

  const openLightbox = (image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxIndex(0);
    document.body.style.overflow = "unset";
  };

  const navigateLightbox = (direction) => {
    const currentImages = filteredImages.slice(0, visibleImages);
    let newIndex;
    if (direction === "next") {
      newIndex = lightboxIndex < currentImages.length - 1 ? lightboxIndex + 1 : 0;
    } else {
      newIndex = lightboxIndex > 0 ? lightboxIndex - 1 : currentImages.length - 1;
    }
    setLightboxIndex(newIndex);
    setLightboxImage(currentImages[newIndex]);
  };

  const loadMoreImages = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleImages((prev) => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!lightboxImage) return;
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          navigateLightbox("prev");
          break;
        case "ArrowRight":
          navigateLightbox("next");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [lightboxImage, lightboxIndex]);

  const currentVisibleImages = filteredImages.slice(0, visibleImages);
  const hasMoreImages = visibleImages < filteredImages.length;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <h1>{header.title}</h1>
        <p>{header.description}</p>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`filter-btn ${activeFilter === category.key ? "active" : ""}`}
            onClick={() => handleFilter(category.key)}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {currentVisibleImages.map((image, index) => (
          <div key={image.id} className="gallery-item">
            <img src={image.src} alt={image.alt} className="gallery-image" />
            <div className="gallery-caption">
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreImages && (
        <div className="load-more-container">
          <button onClick={loadMoreImages} disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : `Load More Photos (${filteredImages.length - visibleImages} remaining)`}
          </button>
        </div>
      )}

      {/* No Images Message */}
      {filteredImages.length === 0 && <p>No photos found in this category.</p>}
    </div>
  );
}

export default Gallery;