import React from 'react';

const OurStoryPage = () => {
  return (
    <div className="min-h-screen bg-gold-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-burgundy-900">Our Story</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">The Beginning</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Magestic was born from a simple belief: board games bring people together in ways that digital entertainment cannot. 
                Founded in 2020, we started as a small family-run business with a passion for quality games that create lasting memories.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What began as a hobby quickly grew into a mission to share the joy of board gaming with families everywhere. 
                We carefully curate each game in our collection, ensuring it meets our standards for quality, engagement, and fun.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Magestic, we believe that every family deserves quality time together. Our mission is to provide the best 
                board games that foster connection, creativity, and friendly competition.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We're more than just a store – we're a community of game enthusiasts dedicated to preserving the art of 
                face-to-face interaction in an increasingly digital world.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Quality: Every game is tested and approved by our team</li>
                <li>Family: We prioritize games that bring families together</li>
                <li>Community: We support local gaming groups and events</li>
                <li>Sustainability: We partner with eco-conscious manufacturers</li>
                <li>Education: We believe games should be both fun and enriching</li>
              </ul>
            </div>

            <div className="bg-gold-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-burgundy-800 mb-4">Looking Forward</h2>
              <p className="text-gray-700 leading-relaxed">
                As we grow, our commitment to quality and community remains unchanged. We continue to seek out the best 
                games from around the world and build a community where board game lovers can connect, share, and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStoryPage;
