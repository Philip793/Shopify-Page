import React from 'react';

const ShippingInfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-burgundy-900 text-center mb-12">Shipping Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Shipping Methods</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Standard Shipping</h3>
                  <p className="text-gray-600">5-7 business days • $9.95</p>
                  <p className="text-gray-600 text-sm mt-1">Available across Australia</p>
                </div>
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Express Shipping</h3>
                  <p className="text-gray-600">2-3 business days • $14.95</p>
                  <p className="text-gray-600 text-sm mt-1">Available across Australia</p>
                </div>
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Free Shipping</h3>
                  <p className="text-gray-600">7-10 business days • FREE</p>
                  <p className="text-gray-600 text-sm mt-1">On orders over $50</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Shipping Times</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Order Processing:</strong> 1-2 business days</li>
                  <li><strong>Standard Delivery:</strong> 5-7 business days after processing</li>
                  <li><strong>Express Delivery:</strong> 2-3 business days after processing</li>
                  <li><strong>International:</strong> Currently not available</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Order Tracking</h2>
              <p className="text-gray-700 mb-4">
                Once your order ships, you'll receive a tracking number via email. You can track your package 
                using the carrier's website or through your account on our website.
              </p>
              <div className="bg-gold-50 rounded-lg p-4">
                <p className="text-burgundy-700">
                  <strong>Tip:</strong> Track your package regularly to ensure you're available for delivery.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Shipping Restrictions</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We currently ship within Australia only</li>
                <li>PO Boxes and APO addresses are not eligible for express shipping</li>
                <li>Some heavy items may have additional shipping charges</li>
                <li>Delivery to remote areas may take longer</li>
              </ul>
            </div>

            <div className="bg-gold-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-burgundy-800 mb-3">Questions?</h2>
              <p className="text-burgundy-700">
                If you have any questions about shipping, please contact our customer service team at 
                <a href="mailto:support@magestic.com.au" className="text-burgundy-600 underline ml-1">
                  support@magestic.com.au
                </a> 
                {' '}or call us at +61 2 1234 5678.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
