import React from "react";
import { useNavigate } from "react-router-dom";

const BlogArea = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Board Game Night",
      excerpt:
        "Discover tips and tricks for hosting the perfect board game night with friends and family.",
      date: "March 15, 2024",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Top 10 Strategy Games for Beginners",
      excerpt:
        "New to board games? Start with these amazing strategy games that are perfect for newcomers.",
      date: "March 10, 2024",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Why Board Games Are Making a Comeback",
      excerpt:
        "Explore the resurgence of board games in the digital age and their benefits for social connection.",
      date: "March 5, 2024",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-burgundy-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest board game trends, reviews, and gaming
            tips from our experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-64 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-gold-100 to-gold-200">
                <div className="text-sm text-burgundy-800 font-semibold mb-2">
                  {post.date}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <button
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="text-burgundy-800 font-semibold hover:text-burgundy-900 transition-colors"
                >
                  Read More &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogArea;
