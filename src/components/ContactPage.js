import React, { useState } from 'react';
import SEO from './SEO.js';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Magestic - Board Games Store",
    "description": "Get in touch with Magestic for questions about our premium board games, customer service, and orders.",
    "url": "https://magestic.com.au/contact",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Game Street",
      "addressLocality": "Board City",
      "addressRegion": "BC",
      "postalCode": "12345",
      "addressCountry": "AU"
    },
    "telephone": "+61 2 1234 5678",
    "email": "support@magestic.com.au",
    "openingHours": "Mo-Fr 09:00-18:00 Sa 10:00-16:00"
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
          <h1 className="text-4xl font-bold text-burgundy-600 font-semibold">Contact Us</h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-burgundy-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-burgundy-100 text-burgundy-700 rounded-md hover:bg-burgundy-200 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Game Street<br />
                    Board City, BC 12345<br />
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
                  <h3 className="font-semibold text-gray-800 mb-2">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10: AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 rounded-lg p-6">
              <h3 className="font-semibold text-burgundy-800 mb-2">Follow Us</h3>
              <p className="text-burgundy-700">
                Stay connected with us on social media for latest updates, game reviews, and special offers!
              </p>
            </div>
          </div>
      </div>

      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600">Thank you for your message! We will get back to you soon.</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccess(false)}
                className="px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
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
