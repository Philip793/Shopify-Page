import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-burgundy-900 mb-4">About Magestic</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in bringing families together through the joy of board games
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="h-96 bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"
                alt="Family playing board games together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Magestic began as a small family-run business with a simple belief: 
              board games have the power to bring people together in ways that digital entertainment cannot.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a passion project in our living room quickly grew into a mission to share the joy 
              of board gaming with families across Australia. We carefully curate each game in our collection, 
              ensuring it meets our high standards for quality, engagement, and fun.
            </p>
            <p className="text-gray-600">
              Today, Magestic stands as a testament to the enduring appeal of face-to-face gaming, 
              offering a carefully selected range of games that create lasting memories and strengthen family bonds.
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-burgundy-900 mb-4">Our Mission</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            To provide exceptional board games that foster connection, creativity, and friendly competition 
            while preserving the art of face-to-face interaction in an increasingly digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎲</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Quality Selection</h4>
            <p className="text-gray-600">
              Every game in our collection is personally tested and approved by our team of gaming enthusiasts.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Family Focus</h4>
            <p className="text-gray-600">
              We prioritize games that bring families together and create opportunities for meaningful connections.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Community Building</h4>
            <p className="text-gray-600">
              We support local gaming groups and events to build a vibrant board gaming community.
            </p>
          </div>
        </div>

        <div className="bg-burgundy-900 text-white rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gold-200">Premium Games</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gold-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-gold-200">Customer Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2020</div>
              <div className="text-gold-200">Founded</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
