# Rupvan Foundation - Web Portal

A modern, responsive, and content-driven web application built for **Rupvan Foundation**—a non-profit resident care and welfare organization dedicated to ensuring the health, happiness, and well-being of its residents.

This platform is powered dynamically using **Contentful CMS** for content management, **Razorpay** for handling donations, and built using **React 19** and **Vite** for optimized speed and developer experience.

---

## 🚀 Key Features

* **Dynamic Content Management (Contentful CMS):** The entire copy (Hero sections, mission statements, list of programs, FAQ lists, team profiles, and footer links) is updated dynamically via Contentful CMS.
* **Monetary Donation System:** An integrated online donation gateway using the **Razorpay Checkout SDK**.
* **Interactive Media Gallery:** Dynamic media rendering loaded from Contentful with lightbox filters.
* **Volunteer Application Portal:** A dedicated validation form for registering volunteers.
* **Modern Design & Animations:** Sleek responsive UI designed with custom CSS styling, smooth transitions, carousel features (via React Slick), and Lucide React iconography.
* **Secure Architecture:** Built-in safeguards using `.env` configs to ensure all API tokens and environment keys are never exposed in Git history.

---

## 🛠️ Tech Stack

* **Framework:** React 19 + Vite
* **Routing:** React Router DOM v7
* **CMS Integration:** Contentful Delivery SDK
* **Payment Integration:** Razorpay SDK
* **Styling:** Custom CSS & TailwindCSS
* **Slider/Carousel:** React Slick & Slick Carousel
* **Icons:** Lucide React

---

## ⚙️ Getting Started & Setup

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/Hariharan1645/Rupvan-Foundation.git
cd Rupvan-Foundation
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
1. Copy the template environment file:
   ```bash
   cp .env.example .env
   ```
2. Open the new `.env` file and insert your API keys:
   ```env
   # Contentful API Configuration
   VITE_CONTENTFUL_SPACE_ID=your_contentful_space_id
   VITE_CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

   # Razorpay Configuration (Optional fallback is rzp_test_XXXXXXXX)
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

### 5. Start the Development Server
```bash
npm run dev
```
The application will run locally at `http://localhost:5173`.

---

## 📦 Directory Structure

```text
Rupvan/
├── public/                 # Static assets (logos, icons)
├── src/
│   ├── components/         # Reusable UI components (Navbar, Footer, ScrollToTop)
│   ├── contexts/           # Context providers (ContentfulClient client instance)
│   ├── Css/                # Page-specific CSS files
│   ├── pages/              # Main route views (Home, About, Services, Donations, Contact, etc.)
│   ├── App.css             # Global app styles
│   ├── App.jsx             # Route definitions and Core layout setup
│   ├── index.css           # Styling entrypoint (Tailwind configuration)
│   └── main.jsx            # React root mount point
├── .env.example            # Environment configuration template
├── .gitignore              # Files/folders excluded from Git control
├── index.html              # HTML shell template
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite compilation settings
```

---

## 🚀 Building for Production

To compile the application into static assets optimized for production, run:

```bash
npm run build
```

This creates a `dist/` directory with lightweight, optimized HTML, CSS, and JS files ready to deploy on hosting platforms such as Vercel, Netlify, or AWS Amplify. Make sure you add the environment keys defined in `.env` to your production hosting dashboard.

---

## 📄 License
This project is private and proprietary.
