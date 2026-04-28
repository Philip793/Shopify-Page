import React from 'react';

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-burgundy-900 text-center mb-12">Returns & Refunds</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Our Return Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Magestic, we want you to be completely satisfied with your purchase. If you're not happy 
                with your order, we offer a straightforward return policy.
              </p>
              <div className="bg-gold-50 rounded-lg p-4 mb-4">
                <p className="text-burgundy-700 font-semibold">
                  30-Day Return Policy
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Return Eligibility</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-700">Items must be unused and in original condition</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-700">Original packaging must be intact</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-700">Return must be initiated within 30 days of purchase</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-gray-700">Proof of purchase required (receipt or order confirmation)</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">How to Return</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 1: Contact Us</h3>
                  <p className="text-gray-600 text-sm">Email support@magestic.com.au with your order number</p>
                </div>
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 2: Receive Return Label</h3>
                  <p className="text-gray-600 text-sm">We'll email you a prepaid return shipping label</p>
                </div>
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 3: Package and Ship</h3>
                  <p className="text-gray-600 text-sm">Pack items securely and attach the return label</p>
                </div>
                <div className="border-l-4 border-burgundy-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Step 4: Receive Refund</h3>
                  <p className="text-gray-600 text-sm">Refund processed within 5-7 business days of receipt</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Refund Options</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Original Payment Method:</strong> Full refund to original payment method</li>
                <li><strong>Store Credit:</strong> 10% bonus credit for future purchases</li>
                <li><strong>Exchange:</strong> Direct exchange for different item of equal value</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Non-Returnable Items</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Clearance items (marked as final sale)</li>
                <li>Gift cards</li>
                <li>Items damaged by customer</li>
                <li>Items returned after 30 days</li>
              </ul>
            </div>

            <div className="bg-gold-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-burgundy-800 mb-3">Questions?</h2>
              <p className="text-burgundy-700">
                For any return-related questions, contact our customer service team at 
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

export default ReturnsPage;
