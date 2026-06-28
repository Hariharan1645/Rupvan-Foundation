import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Volunteer from "./pages/Volunteer";
import Donations from "./pages/Donations";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      {/* Add padding top so content doesn't hide behind sticky navbar */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
