import React, { useState } from "react";
import SEO from "./SEO.js";
import { Send, Loader2 } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 3)
          return "Subject must be at least 3 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setTouched({});
    setErrors({});
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Magestic - Board Games Store",
    description:
      "Get in touch with Magestic for questions about our premium board games, customer service, and orders.",
    url: "https://magestic.com.au/contact",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Game Street",
      addressLocality: "Board City",
      addressRegion: "BC",
      postalCode: "12345",
      addressCountry: "AU",
    },
    telephone: "+61 2 1234 5678",
    email: "support@magestic.com.au",
    openingHours: "Mo-Fr 09:00-18:00 Sa 10:00-16:00",
  };

  return (
    <>
      <SEO
        title="Contact Us - Magestic Board Games"
        description="Get in touch with Magestic for questions about our premium board games, customer service, and orders. Fast response guaranteed."
        keywords="contact board games, customer service, board game store contact, support, help"
        url="/contact"
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-gold-50 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-burgundy-600">Contact Us</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-burgundy-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 transition-colors ${
                    errors.name && touched.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.name && touched.name && (
                  <p
                    id="name-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 transition-colors ${
                    errors.email && touched.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.email && touched.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  aria-invalid={errors.subject ? "true" : "false"}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 transition-colors ${
                    errors.subject && touched.subject
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.subject && touched.subject && (
                  <p
                    id="subject-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  rows="4"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500 transition-colors ${
                    errors.message && touched.message
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.message && touched.message && (
                  <p
                    id="message-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.message.length}/10 characters minimum
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-burgundy-100 text-burgundy-700 rounded-md hover:bg-burgundy-200 transition-colors font-semibold py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Game Street
                    <br />
                    Board City, BC 12345
                    <br />
                    Australia
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                  <p className="text-gray-600">+61 2 1234 5678</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">support@magestic.com.au</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10: AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 rounded-lg p-6">
              <h3 className="font-semibold text-burgundy-800 mb-2">
                Follow Us
              </h3>
              <p className="text-burgundy-700">
                Stay connected with us on social media for latest updates, game
                reviews, and special offers!
              </p>
            </div>
          </div>
        </div>

        {/* Success Message Popup */}
        {showSuccess && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
          >
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl" aria-hidden="true">
                    ✓
                  </span>
                </div>
                <div>
                  <h3
                    id="success-title"
                    className="text-xl font-bold text-gray-900"
                  >
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for your message! We will get back to you soon.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSuccess(false)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setShowSuccess(false))
                  }
                  className="px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2"
                  autoFocus
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ContactPage;
