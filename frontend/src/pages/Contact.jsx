import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import baseURL from "../utils/baseURL";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    try {
      const response = await axios.post(`${baseURL}/contact`, formData);

      if (response.status === 200) {
        setSubmitted(true);
        setFormData({ fullname: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Something went wrong while sending the message.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
          <p className="mt-3 text-lg text-blue-100">
            We’d love to hear your thoughts, questions, or ideas.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-10">
          {/* Contact Form */}
          <div>
            {submitted && (
              <div className="mb-6 bg-green-100 text-green-700 py-3 px-4 rounded">
                Your message has been sent successfully!
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-100 text-red-700 py-3 px-4 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="self-start bg-[#3C76D2] text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col bg-gray-50 p-8 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Contact Information
            </h2>

            <div className="flex items-center mb-5">
              <FaEnvelope className="text-indigo-600 text-xl mr-3" />
              <p className="text-gray-700">support@recipeshare.com</p>
            </div>

            <div className="flex items-center mb-5">
              <FaPhone className="text-indigo-600 text-xl mr-3" />
              <p className="text-gray-700">0312-9903376</p>
            </div>

            <div className="flex items-center">
              <FaMapMarkerAlt className="text-indigo-600 text-xl mr-3" />
              <p className="text-gray-700">Charsadda (Near madan adda)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
