import { Alert } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const Contact = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    fullname: "",
    subject: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState(null);

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/contact/contact-us`,
        formData
      );

      console.log(response);

      if (response.status === 200) {
        await swal("Success", "Message sent successfully!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });
        setError(null);
      } else {
        setError(response?.data?.message);
      }
      // Reset the form after submission
      setFormData({ fullname: "", subject: "", email: "", message: "" });
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section: Contact Form */}
        <div className="col-md-6">
          <h2 className="mb-4">Contact Us</h2>
          <p className="text-muted">
            Have questions, feedback, or just want to say hi? We’d love to hear
            from you! Fill out the form below and we'll get back to you as soon
            as possible.
          </p>
          <form className="shadow-sm p-4 rounded bg-white">
          {error && <Alert severity="error">{error}</Alert>}
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter Subject"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="Write your message here"
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary btn-lg w-100"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Section: Contact Information */}
        <div className="col-md-6 mt-5 mt-md-0">
          <h3>Get in Touch</h3>
          <p className="text-muted">
            You can also reach out to us directly through the following
            channels:
          </p>
          <p>
            <i className="fas fa-envelope me-2"></i> recipesupport@example.com
          </p>
          <p>
            <i className="fas fa-phone me-2"></i> +1 234 567 890
          </p>
          <h4 className="mt-4">Follow Us</h4>
          <div className="mt-3 d-flex gap-3">
            <a
              href="https://facebook.com"
              className="text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f fs-4"></i>
            </a>
            <a
              href="https://twitter.com"
              className="text-info"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter fs-4"></i>
            </a>
            <a
              href="https://instagram.com"
              className="text-danger"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram fs-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
