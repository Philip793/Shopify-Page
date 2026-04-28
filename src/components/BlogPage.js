import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO.js';

const BlogPage = () => {
  const navigate = useNavigate();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Magestic Blog - Board Game Reviews & Tips",
    "description": "Stay updated with the latest board game trends, reviews, and gaming tips from our experts at Magestic.",
    "url": "https://magestic.com.au/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Magestic",
      "logo": {
        "@type": "ImageObject",
        "url": "https://magestic.com.au/logo.png"
      }
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "The Resurgence of Board Games in the Digital Age",
      excerpt: "Explore how board games are making a comeback and bringing families together in meaningful ways.",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1611997223036-302c7758526c?w=800&h=400&fit=crop",
      category: "Trends",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Top 10 Strategy Games for Family Game Night",
      excerpt: "Discover the best strategy games that challenge your mind while keeping the whole family engaged.",
      date: "March 10, 2024",
      image: "https://images.unsplash.com/photo-1596435084672-12f674b677b1?w=800&h=400&fit=crop",
      category: "Reviews",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "How Board Games Help Child Development",
      excerpt: "Learn about the educational benefits of board games and how they contribute to cognitive development.",
      date: "March 5, 2024",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=400&fit=crop",
      category: "Education",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Building Your Board Game Collection",
      excerpt: "Tips and strategies for curating the perfect board game collection for your family.",
      date: "February 28, 2024",
      image: "https://images.unsplash.com/photo-1528360983277-3d33e4e2e1f1?w=800&h=400&fit=crop",
      category: "Guides",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "The Psychology of Game Design",
      excerpt: "Understanding what makes board games engaging and how designers create memorable experiences.",
      date: "February 20, 2024",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
      category: "Design",
      readTime: "10 min read"
    },
    {
      id: 6,
      title: "Board Games for Different Age Groups",
      excerpt: "A comprehensive guide to choosing age-appropriate board games for everyone in the family.",
      date: "February 15, 2024",
      image: "https://images.unsplash.com/photo-1611997223036-302c7758526c?w=800&h=400&fit=crop",
      category: "Guides",
      readTime: "9 min read"
    }
  ];

  return (
    <>
      <SEO 
        title="Blog - Board Game Reviews & Tips"
        description="Stay updated with the latest board game trends, reviews, and gaming tips from our experts at Magestic."
        keywords="board game blog, game reviews, gaming tips, board game trends, family games, strategy games"
        url="/blog"
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-gray-50 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-burgundy-900 mb-4">Magestic Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest board game trends, reviews, and gaming tips from our experts.
          </p>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          <section className="mb-16">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-burgundy-600 text-white text-xs px-2 py-1 rounded-full mr-3">
                      Featured
                    </span>
                    <span className="text-sm text-gray-500">{blogPosts[0].date}</span>
                    <span className="text-sm text-gray-500 ml-3">{blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{blogPosts[0].title}</h2>
                  <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                  <button 
                    onClick={() => navigate(`/blog/${blogPosts[0].id}`)}
                    className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </article>
          </section>

          {/* Recent Posts Grid */}
          <section>
            <h2 className="text-2xl font-bold text-burgundy-800 mb-8">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-gold-100 text-burgundy-700 text-xs px-2 py-1 rounded-full mr-2">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <button 
                        onClick={() => navigate(`/blog/${post.id}`)}
                        className="text-gold-600 font-semibold hover:text-burgundy-700 transition-colors"
                      >
                        Read More &rarr;
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="mt-16 bg-burgundy-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6">Get the latest blog posts and exclusive content delivered to your inbox.</p>
            <div className="max-w-md mx-auto flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-burgundy-800 text-white placeholder-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              />
              <button className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default BlogPage;
