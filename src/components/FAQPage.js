import React, { useState } from 'react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Afterpay. All transactions are secured with SSL encryption."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days, express shipping takes 2-3 business days. Free shipping is available on orders over $50."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 2 hours of placement. After that, please contact our customer service team for assistance."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes! We offer complimentary gift wrapping on all orders. You can select this option at checkout and add a personalized message."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused items in original packaging. Items must be returned with proof of purchase."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within Australia. We're working on expanding our international shipping options in the near future."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can track your package through our website or the carrier's tracking page."
    },
    {
      question: "Are your games authentic?",
      answer: "Yes, all our games are 100% authentic and sourced directly from manufacturers or authorized distributors."
    },
    {
      question: "Do you have a physical store?",
      answer: "We are currently an online-only store, but we participate in local gaming events and markets. Follow us on social media for updates!"
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via email at support@magestic.com.au or call us at +61 2 1234 5678 during business hours (9 AM - 6 PM, Mon-Fri)."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-burgundy-900 text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <p className="text-gray-700 text-center mb-6">
              Find answers to common questions about our products, shipping, and policies.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gold-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <span className="text-burgundy-600 text-xl">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gold-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-burgundy-800 mb-3">Still have questions?</h2>
            <p className="text-burgundy-700 mb-4">
              Can't find the answer you're looking for? Our customer service team is here to help!
            </p>
            <button className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
