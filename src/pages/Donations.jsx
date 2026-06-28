import React, { useState, useRef } from "react";
import emailjs from "emailjs-com";
import "../Css/Donations.css";

function Donations() {
  const formRef = useRef(null);

  // ---------------- Tab State ----------------
  const [activeTab, setActiveTab] = useState("monetary");

  // ---------------- Monetary Donations ----------------
  const [moneyFormData, setMoneyFormData] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });
  const [moneyErrors, setMoneyErrors] = useState({});
  const [isMoneySubmitting, setIsMoneySubmitting] = useState(false);
  const [presetSelected, setPresetSelected] = useState("");
  const [moneySuccess, setMoneySuccess] = useState("");
  const [moneyServerError, setMoneyServerError] = useState("");

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;
    setMoneyFormData({ ...moneyFormData, [name]: value });
    setMoneyErrors({ ...moneyErrors, [name]: "" });
    setMoneyServerError("");
    if (name === "amount") setPresetSelected("");
  };

  const handlePresetAmount = (amount) => {
    setMoneyFormData({ ...moneyFormData, amount });
    setPresetSelected(amount);
  };

  const validateMoneyForm = () => {
    let errors = {};
    if (!moneyFormData.name.trim()) errors.name = "Name is required.";
    if (!moneyFormData.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(moneyFormData.email))
      errors.email = "Invalid email format.";
    if (!moneyFormData.amount || moneyFormData.amount < 1)
      errors.amount = "Please enter a valid donation amount.";
    return errors;
  };

  const handleMoneySubmit = (e) => {
    e.preventDefault();
    const errors = validateMoneyForm();
    if (Object.keys(errors).length > 0) {
      setMoneyErrors(errors);
      return;
    }

    setIsMoneySubmitting(true);

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXX",
        amount: Number(moneyFormData.amount) * 100, // in paise
        currency: "INR",
        name: "Rupvan Foundation",
        description: "Monetary Donation",
        handler: function (response) {
          console.log("Payment Success:", response);
          setMoneySuccess("Payment Successful! Thank you for your donation ❤");
          setMoneyFormData({ name: "", email: "", amount: "", message: "" });
          setPresetSelected("");
          setTimeout(() => setMoneySuccess(""), 6000);
        },
        prefill: {
          name: moneyFormData.name,
          email: moneyFormData.email,
        },
        theme: {
          color: "#ff914d",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      setMoneyServerError("Oops! Something went wrong. Payment Failed.");
    } finally {
      setIsMoneySubmitting(false);
    }
  };

  // ---------------- In-Kind Donations ----------------
  const [kindFormData, setKindFormData] = useState({
    name: "",
    email: "",
    item: "",
    quantity: "",
    message: "",
  });
  const [kindErrors, setKindErrors] = useState({});
  const [isKindSubmitting, setIsKindSubmitting] = useState(false);
  const [kindSuccess, setKindSuccess] = useState("");
  const [kindServerError, setKindServerError] = useState("");

  const handleKindChange = (e) => {
    const { name, value } = e.target;
    setKindFormData({ ...kindFormData, [name]: value });
    setKindErrors({ ...kindErrors, [name]: "" });
    setKindServerError("");
  };

  const validateKindForm = () => {
    let errors = {};
    if (!kindFormData.name.trim()) errors.name = "Name is required.";
    if (!kindFormData.email.trim()) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(kindFormData.email))
      errors.email = "Invalid email format.";
    if (!kindFormData.item.trim()) errors.item = "Please specify the item.";
    if (!kindFormData.quantity || kindFormData.quantity < 1)
      errors.quantity = "Please enter a valid quantity.";
    return errors;
  };

  const handleKindSubmit = async (e) => {
    e.preventDefault();
    const errors = validateKindForm();
    if (Object.keys(errors).length > 0) {
      setKindErrors(errors);
      return;
    }

    setIsKindSubmitting(true);
    setKindServerError("");
    setKindSuccess("");

    try {
      const result = await emailjs.send(
        "service_ck1iz1k",
        "template_fdwo40f",
        {
          name: kindFormData.name,
          email: kindFormData.email,
          item: kindFormData.item,
          quantity: kindFormData.quantity,
          message: kindFormData.message,
          submitted_at: new Date().toLocaleString(),
        },
        "Fp-fIcpFuBdytxFT9"
      );

      console.log("In-Kind Donation Email Sent:", result);

      setKindSuccess("Thank you for your in-kind donation!");
      setKindFormData({ name: "", email: "", item: "", quantity: "", message: "" });
      setTimeout(() => setKindSuccess(""), 5000);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("In-Kind Email Error:", error);
      setKindServerError("Network error. Please try again later.");
    } finally {
      setIsKindSubmitting(false);
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="donations-page">
      <div className="donation-header">
        <h1>Make a Donation</h1>
        <p>Your generosity helps us care for our beloved residents.</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "monetary" ? "active" : ""}`}
          onClick={() => setActiveTab("monetary")}
        >
          Monetary Donation
        </button>
        <button
          className={`tab-btn ${activeTab === "inkind" ? "active" : ""}`}
          onClick={() => setActiveTab("inkind")}
        >
          In-Kind Donation
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Monetary Donation */}
        <div className={`donation-card monetary ${activeTab === "monetary" ? "active" : ""}`}>
          <h2>Monetary Donation</h2>

          {/* Preset Amount Buttons */}
          <div className="preset-buttons">
            {[100, 500, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                className={`preset-btn ${presetSelected === amt ? "selected" : ""}`}
                onClick={() => handlePresetAmount(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <form onSubmit={handleMoneySubmit} noValidate>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={moneyFormData.name}
                onChange={handleMoneyChange}
                className={moneyErrors.name ? "error" : ""}
              />
              {moneyErrors.name && <p className="error-message">{moneyErrors.name}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={moneyFormData.email}
                onChange={handleMoneyChange}
                className={moneyErrors.email ? "error" : ""}
              />
              {moneyErrors.email && <p className="error-message">{moneyErrors.email}</p>}
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={moneyFormData.amount}
                onChange={handleMoneyChange}
                className={moneyErrors.amount ? "error" : ""}
              />
              {moneyErrors.amount && <p className="error-message">{moneyErrors.amount}</p>}
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                value={moneyFormData.message}
                onChange={handleMoneyChange}
              />
            </div>

            {moneyServerError && <p className="error-message">{moneyServerError}</p>}
            {moneySuccess && <p className="success-message">{moneySuccess}</p>}

            <button type="submit" className="btn-accent" disabled={isMoneySubmitting}>
              {isMoneySubmitting ? "Processing..." : "Donate Money"}
            </button>
          </form>
        </div>

        {/* In-Kind Donation */}
        <div className={`donation-card inkind ${activeTab === "inkind" ? "active" : ""}`}>
          <h2>In-Kind Donation</h2>
          <form ref={formRef} onSubmit={handleKindSubmit} noValidate>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={kindFormData.name}
                onChange={handleKindChange}
                className={kindErrors.name ? "error" : ""}
              />
              {kindErrors.name && <p className="error-message">{kindErrors.name}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={kindFormData.email}
                onChange={handleKindChange}
                className={kindErrors.email ? "error" : ""}
              />
              {kindErrors.email && <p className="error-message">{kindErrors.email}</p>}
            </div>

            <div className="form-group">
              <label>Item</label>
              <input
                type="text"
                name="item"
                value={kindFormData.item}
                onChange={handleKindChange}
                className={kindErrors.item ? "error" : ""}
              />
              {kindErrors.item && <p className="error-message">{kindErrors.item}</p>}
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={kindFormData.quantity}
                onChange={handleKindChange}
                className={kindErrors.quantity ? "error" : ""}
              />
              {kindErrors.quantity && <p className="error-message">{kindErrors.quantity}</p>}
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                value={kindFormData.message}
                onChange={handleKindChange}
              />
            </div>

            {kindServerError && <p className="error-message">{kindServerError}</p>}
            {kindSuccess && <p className="success-message">{kindSuccess}</p>}

            <button type="submit" className="btn-accent" disabled={isKindSubmitting}>
              {isKindSubmitting ? "Processing..." : "Donate Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Donations;
