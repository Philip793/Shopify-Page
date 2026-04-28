import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      setShowError(true);
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      return;
    }
    
    // If email is valid, show success message
    setSuccessMessage('Thank you for subscribing! You will receive our newsletter shortly.');
    setEmail('');
    setShowError(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'Twitter', icon: 't', url: '#' },
    { name: 'Instagram', icon: 'i', url: '#' },
    { name: 'LinkedIn', icon: 'l', url: '#' }
  ];

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', url: '/shop' },
        { name: 'Featured', url: '/featured' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Blog', url: '/blog' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'Shipping Info', url: '/shipping' },
        { name: 'Returns', url: '/returns' },
        { name: 'FAQ', url: '/faq' }
      ]
    },
    {
      title: 'About',
      links: [
        { name: 'Our Story', url: '/our-story' },
        { name: 'Contact', url: '/contact' }
      ]
    }
  ];

  return (
    <footer className="bg-burgundy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Magestic</h3>
            <p className="text-white mb-6">
              Your ultimate destination for board games and family fun.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-burgundy-700 rounded-full flex items-center justify-center hover:bg-burgundy-700 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.url}
                      className="text-white hover:text-burgundy-200 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-burgundy-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Stay Connected</h4>
              <p className="text-white">
                Subscribe to get special offers and new product updates
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md bg-burgundy-100 text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              />
              <button type="submit" className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-500 transition-colors font-semibold">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-burgundy-700 text-center">
          <p className="text-white">
            2024 Magestic. All rights reserved.
          </p>
        </div>
      </div>

        {/* Error Popup */}
        {showError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-xl">!</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Error</h3>
              </div>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowError(false)}
                className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Success Message Popup */}
        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Success</h3>
              </div>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage('')}
                className="w-full px-4 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        )}
    </footer>
  );
};

export default Footer;
