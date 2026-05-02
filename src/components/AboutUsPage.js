import React from "react";
import SEO from "./SEO.js";

const AboutUsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us - Magestic Board Games",
    description:
      "Learn about Magestic, your premium board games store. Discover our mission, values, and commitment to bringing families together through quality games.",
    url: "https://magestic.com.au/about-us",
    mainEntity: {
      "@type": "Organization",
      name: "Magestic",
      description:
        "Premium board games store dedicated to bringing families together through quality gaming experiences.",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Game Street",
        addressLocality: "Board City",
        addressRegion: "BC",
        postalCode: "12345",
        addressCountry: "AU",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+61 2 1234 5678",
        contactType: "Customer Service",
        email: "support@magestic.com.au",
      },
    },
  };

  return (
    <>
      <SEO
        title="About Us - Magestic Board Games Store"
        description="Learn about Magestic, your premium board games store. Discover our mission, values, and commitment to bringing families together through quality games."
        keywords="about magestic, board game store, family games, company mission, our story, premium games"
        url="/about-us"
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-gray-50 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-burgundy-900 mb-4">
            About Magestic
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in bringing families together through the joy
            of board games
          </p>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-96 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1528360983277-3d33e4e2e1f1?w=800&h=600&fit=crop"
                      alt="Family playing board games together"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8 flex items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                      Our Story
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Founded in 2020, Magestic began as a small family-run
                      business with a simple belief: board games have the power
                      to bring people together in ways that digital
                      entertainment cannot.
                    </p>
                    <p className="text-gray-600 mb-4">
                      What started as a passion project in our living room
                      quickly grew into a mission to share the joy of board
                      gaming with families across Australia. We carefully curate
                      each game in our collection, ensuring it meets our high
                      standards for quality, engagement, and fun.
                    </p>
                    <p className="text-gray-600">
                      Today, Magestic stands as a testament to the enduring
                      appeal of face-to-face gaming, offering a carefully
                      selected range of games that create lasting memories and
                      strengthen family bonds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-burgundy-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To provide exceptional board games that foster connection,
                creativity, and friendly competition while preserving the art of
                face-to-face interaction in an increasingly digital world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎲</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Quality Selection
                </h3>
                <p className="text-gray-600">
                  Every game in our collection is personally tested and approved
                  by our team of gaming enthusiasts.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Family Focus
                </h3>
                <p className="text-gray-600">
                  We prioritize games that bring families together and create
                  opportunities for meaningful connections.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Community Building
                </h3>
                <p className="text-gray-600">
                  We support local gaming groups and events to build a vibrant
                  board gaming community.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-burgundy-900 mb-8 text-center">
                Our Values
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-burgundy-600 text-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Quality Excellence
                    </h3>
                    <p className="text-gray-600">
                      We never compromise on quality. Every game is thoroughly
                      tested for durability, gameplay, and educational value
                      before it reaches our shelves.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-burgundy-600 text-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Customer Service
                    </h3>
                    <p className="text-gray-600">
                      Our knowledgeable team is here to help you find the
                      perfect game for your family, with personalized
                      recommendations and expert advice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-burgundy-600 text-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Sustainability
                    </h3>
                    <p className="text-gray-600">
                      We partner with eco-conscious manufacturers and promote
                      games made from sustainable materials to protect our
                      planet for future generations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-burgundy-600 text-white rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Educational Value
                    </h3>
                    <p className="text-gray-600">
                      We believe games should be both fun and enriching,
                      promoting critical thinking, problem-solving, and social
                      skills development.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-burgundy-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The passionate individuals behind Magestic who share your love
                for board games
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gold-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sarah Johnson
                </h3>
                <p className="text-burgundy-600 font-medium mb-3">
                  Founder & CEO
                </p>
                <p className="text-gray-600 text-sm">
                  A lifelong board game enthusiast with over 15 years of
                  experience in the gaming industry.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gold-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Michael Chen
                </h3>
                <p className="text-burgundy-600 font-medium mb-3">
                  Head of Curation
                </p>
                <p className="text-gray-600 text-sm">
                  Our expert game selector with a passion for finding the most
                  engaging and innovative games.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gold-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Emma Wilson
                </h3>
                <p className="text-burgundy-600 font-medium mb-3">
                  Customer Experience Manager
                </p>
                <p className="text-gray-600 text-sm">
                  Dedicated to ensuring every customer has an exceptional
                  shopping experience with Magestic.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16">
            <div className="bg-burgundy-900 text-white rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-burgundy-200">Premium Games</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <div className="text-burgundy-200">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <div className="text-burgundy-200">Customer Rating</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">2020</div>
                  <div className="text-burgundy-200">Founded</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="bg-gold-50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-burgundy-900 mb-4">
                Join Our Community
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Become part of the Magestic family and discover the perfect
                games for your next gathering.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold">
                  Shop Our Collection
                </button>
                <button className="px-8 py-3 bg-white text-burgundy-600 border-2 border-burgundy-600 rounded-md hover:bg-gold-50 transition-colors font-semibold">
                  Contact Our Team
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default AboutUsPage;
