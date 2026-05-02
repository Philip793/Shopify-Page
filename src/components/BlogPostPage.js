import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SEO from "./SEO.js";

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  // Sample blog posts data (same as BlogPage)
  const blogPosts = [
    {
      id: 1,
      title: "The Resurgence of Board Games in the Digital Age",
      excerpt:
        "Explore how board games are making a comeback and bringing families together in meaningful ways.",
      content: `
        <p>In an era dominated by digital entertainment, board games are experiencing a remarkable renaissance. Families and friends are rediscovering the joy of gathering around a table, rolling dice, and engaging in face-to-face interaction that screens simply cannot replicate.</p>
        
        <h3>The Digital Detox Movement</h3>
        <p>As people become more aware of screen time's impact on mental health and social connections, many are intentionally seeking analog alternatives. Board games offer the perfect escape from digital fatigue while providing meaningful social interaction.</p>
        
        <h3>Educational Benefits</h3>
        <p>Modern board games go beyond simple entertainment. They teach critical thinking, strategy, negotiation, and even mathematical skills. Children develop patience and sportsmanship while adults sharpen their cognitive abilities.</p>
        
        <h3>The Social Connection</h3>
        <p>Perhaps most importantly, board games create shared experiences. The laughter, friendly competition, and collaborative problem-solving strengthen relationships in ways that scrolling through social media never could.</p>
        
        <h3>Looking Forward</h3>
        <p>The board game industry continues to innovate with new mechanics, themes, and accessibility features. Whether you're a casual player or a serious strategist, there's never been a better time to explore the world of modern board games.</p>
      `,
      date: "March 15, 2024",
      image:
        "https://images.unsplash.com/photo-1611997223036-302c7758526c?w=1200&h=600&fit=crop",
      category: "Trends",
      readTime: "5 min read",
      author: "Sarah Johnson",
      tags: [
        "board games",
        "digital detox",
        "family time",
        "social connection",
      ],
    },
    {
      id: 2,
      title: "Top 10 Strategy Games for Family Game Night",
      excerpt:
        "Discover the best strategy games that challenge your mind while keeping the whole family engaged.",
      content: `
        <p>Strategy games bring families together while exercising critical thinking skills. Here are our top 10 picks that balance complexity with accessibility, ensuring everyone from kids to adults can join in the fun.</p>
        
        <h3>1. Settlers of Catan</h3>
        <p>The perfect entry point into strategy gaming. Simple rules but deep gameplay that keeps everyone engaged from start to finish.</p>
        
        <h3>2. Ticket to Ride</h3>
        <p>Easy to learn but surprisingly strategic. Build your railway empire while blocking opponents' routes.</p>
        
        <h3>3. Carcassonne</h3>
        <p>Tile-laying mechanics create a unique game every time. Great for spatial reasoning and planning ahead.</p>
        
        <h3>4. Pandemic</h3>
        <p>Cooperative gameplay where the family works together to save the world. Excellent for teaching teamwork and strategic planning.</p>
        
        <h3>5. Azul</h3>
        <p>Beautiful abstract strategy game with simple rules but deep tactical decisions.</p>
        
        <h3>6. Wingspan</h3>
        <p>Elegant engine-building game with a bird theme. Educational and relaxing yet strategically satisfying.</p>
        
        <h3>7. Splendor</h3>
        <p>Quick-playing engine builder about trading gems. Perfect for when you want strategic depth without a huge time commitment.</p>
        
        <h3>8. King of Tokyo</h3>
        <p>Light-hearted dice-rolling strategy with a fun monster theme. Great for families who enjoy a bit of luck with their strategy.</p>
        
        <h3>9. 7 Wonders</h3>
        <p>Civilization-building game that scales perfectly from 3 to 7 players. Everyone plays simultaneously, keeping game time reasonable.</p>
        
        <h3>10. Terraforming Mars</h3>
        <p>For families with older children, this deep strategy game about making Mars habitable offers endless replayability.</p>
      `,
      date: "March 10, 2024",
      image:
        "https://images.unsplash.com/photo-1596435084672-12f674b677b1?w=1200&h=600&fit=crop",
      category: "Reviews",
      readTime: "8 min read",
      author: "Mike Chen",
      tags: [
        "strategy games",
        "family games",
        "game recommendations",
        "reviews",
      ],
    },
    {
      id: 3,
      title: "How Board Games Help Child Development",
      excerpt:
        "Learn about the educational benefits of board games and how they contribute to cognitive development.",
      content: `
        <p>Board games are more than just entertainment – they're powerful educational tools that support children's development in numerous ways. From cognitive skills to emotional intelligence, the benefits are both immediate and long-lasting.</p>
        
        <h3>Cognitive Development</h3>
        <p>Board games challenge children to think critically, plan ahead, and make strategic decisions. Games like chess teach foresight and consequence, while pattern-matching games enhance visual processing and memory.</p>
        
        <h3>Mathematical Skills</h3>
        <p>Many games naturally incorporate counting, probability, and resource management. Children practice arithmetic without even realizing they're learning, developing number sense through play.</p>
        
        <h3>Social Skills</h3>
        <p>Perhaps the most valuable benefit is social development. Children learn to take turns, follow rules, communicate clearly, and handle both winning and losing gracefully. These skills are crucial for success in school and life.</p>
        
        <h3>Emotional Regulation</h3>
        <p>Board games teach patience and impulse control. Children learn to wait their turn, handle frustration when things don't go their way, and celebrate others' successes.</p>
        
        <h3>Language Development</h3>
        <p>Many games require reading comprehension, vocabulary building, and clear communication. Children articulate strategies, negotiate trades, and explain their reasoning, all valuable language skills.</p>
        
        <h3>Problem-Solving</h3>
        <p>Every board game presents problems to solve. Children learn to analyze situations, consider multiple options, and adapt their strategies based on new information.</p>
        
        <h3>Building Resilience</h3>
        <p>Losing a game teaches children that setbacks are temporary and that improvement comes with practice. This builds resilience and a growth mindset that extends beyond the game table.</p>
      `,
      date: "March 5, 2024",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=600&fit=crop",
      category: "Education",
      readTime: "6 min read",
      author: "Dr. Emily Roberts",
      tags: [
        "child development",
        "educational games",
        "parenting",
        "learning through play",
      ],
    },
    {
      id: 4,
      title: "Building Your Board Game Collection",
      excerpt:
        "Tips and strategies for curating the perfect board game collection for your family.",
      content: `
        <p>Building a board game collection is an exciting journey that can provide years of entertainment. However, with thousands of games available, it's easy to feel overwhelmed. Here's how to build a thoughtful collection that grows with your family's interests.</p>
        
        <h3>Start with the Basics</h3>
        <p>Begin with versatile games that work for different group sizes and skill levels. Gateway games like Ticket to Ride or Carcassonne are perfect starting points that appeal to both beginners and experienced players.</p>
        
        <h3>Consider Your Audience</h3>
        <p>Think about who will be playing most often. Young children need different games than teenagers or adults. Consider age ranges, interests, and attention spans when making selections.</p>
        
        <h3>Vary the Game Types</h3>
        <p>A well-rounded collection includes different types of experiences: cooperative games, competitive strategy games, party games, and solo games. This variety ensures you have something for every mood and occasion.</p>
        
        <h3>Quality Over Quantity</h3>
        <p>It's better to have fewer games that get played regularly than many that gather dust. Focus on games that your family genuinely enjoys and will return to repeatedly.</p>
        
        <h3>Think About Play Time</h3>
        <p>Include games of different lengths. Quick 15-minute games are perfect for weeknights, while longer epic games are great for weekends or holidays.</p>
        
        <h3>Storage and Organization</h3>
        <p>Plan for how you'll store your collection. Consider shelf space, game box sizes, and whether you'll need storage solutions for components.</p>
        
        <h3>Budget Wisely</h3>
        <p>Board games can range from $20 to $100+. Start with affordable options and gradually add more expensive games as you discover what your family truly enjoys.</p>
        
        <h3>Try Before You Buy</h3>
        <p>Many game stores have demo copies you can try. Game cafes and local gaming groups are also great ways to test games before committing to a purchase.</p>
      `,
      date: "February 28, 2024",
      image:
        "https://images.unsplash.com/photo-1528360983277-3d33e4e2e1f1?w=1200&h=600&fit=crop",
      category: "Guides",
      readTime: "7 min read",
      author: "Alex Thompson",
      tags: [
        "game collection",
        "board game storage",
        "family games",
        "game recommendations",
      ],
    },
    {
      id: 5,
      title: "The Psychology of Game Design",
      excerpt:
        "Understanding what makes board games engaging and how designers create memorable experiences.",
      content: `
        <p>Great board games don't happen by accident – they're carefully crafted experiences that tap into fundamental aspects of human psychology. Understanding these psychological principles can help you appreciate games on a deeper level and even design your own.</p>
        
        <h3>The Flow State</h3>
        <p>The best games induce a state of flow, where players are fully immersed and lose track of time. This happens when the challenge level perfectly matches the player's skill level, creating an engaging but not frustrating experience.</p>
        
        <h3>Dopamine and Reward Systems</h3>
        <p>Games strategically release dopamine through achievement and progression. Whether it's collecting resources, completing objectives, or outsmarting opponents, these small victories keep players engaged and coming back for more.</p>
        
        <h3>Social Psychology</h3>
        <p>Multiplayer games leverage our innate social nature. Cooperation, competition, negotiation, and social bonding all trigger different psychological responses that make games compelling.</p>
        
        <h3>Cognitive Load Management</h3>
        <p>Good designers balance complexity and accessibility. They introduce mechanics gradually, allowing players to master concepts before adding new layers of complexity.</p>
        
        <h3>Emotional Investment</h3>
        <p>Games create emotional stakes through narrative, theme, and personal investment in outcomes. When players care about what happens, the experience becomes meaningful and memorable.</p>
        
        <h3>The Endowment Effect</h3>
        <p>Players value resources they've earned more than equivalent resources given freely. This psychological principle explains why building an engine or collecting items feels so satisfying.</p>
        
        <h3>Loss Aversion</h3>
        <p>People feel the pain of losing more strongly than the pleasure of winning. Smart game designers use this to create tension and meaningful decisions.</p>
      `,
      date: "February 20, 2024",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
      category: "Design",
      readTime: "10 min read",
      author: "Dr. Lisa Park",
      tags: ["game design", "psychology", "game mechanics", "user experience"],
    },
    {
      id: 6,
      title: "Board Games for Different Age Groups",
      excerpt:
        "A comprehensive guide to choosing age-appropriate board games for everyone in the family.",
      content: `
        <p>Finding the right board game for each age group can be challenging, but it's essential for ensuring everyone has a great experience. Here's a comprehensive guide to help you choose age-appropriate games that will engage and entertain every member of your family.</p>
        
        <h3>Ages 3-5: Preschool Games</h3>
        <p>Young children need games that focus on basic skills like color recognition, counting, and taking turns. Look for games with large, durable components and simple rules. Games like Memory, Chutes and Ladders, and cooperative games like Hoot Owl Hoot! are perfect for this age group.</p>
        
        <h3>Ages 6-8: Early Elementary</h3>
        <p>Children in this age group can handle more complex rules and basic strategy. Games like Uno, Sorry!, and introductory strategy games like My First Carcassonne work well. Focus on games that teach turn-taking, basic counting, and simple decision-making.</p>
        
        <h3>Ages 9-12: Upper Elementary</h3>
        <p>This is where children can handle more complex strategy and longer game times. Games like Settlers of Catan Junior, Ticket to Ride, and strategy games like Splendor are excellent choices. They can understand multiple game mechanics and longer-term planning.</p>
        
        <h3>Ages 13-17: Teenagers</h3>
        <p>Teens can handle complex strategy games and enjoy more mature themes. Games like Pandemic, 7 Wonders, and Terraforming Mars offer deep strategic gameplay. They also enjoy social deduction games and party games that work well with friends.</p>
        
        <h3>Ages 18+: Adults</h3>
        <p>Adults can handle the most complex games and longer play sessions. Heavy strategy games, legacy games, and complex eurogames are all appropriate. This age group also enjoys thematic games and social games that work well at parties.</p>
        
        <h3>Mixed Age Groups</h3>
        <p>When playing with mixed ages, choose games that work for the youngest player but still engage older participants. Cooperative games often work well, as do games with handicaps or team-based play.</p>
        
        <h3>Adapting Games</h3>
        <p>Don't be afraid to modify rules to make games work for your family. You can simplify complex games or add challenges to simple ones to create the perfect experience for your group.</p>
      `,
      date: "February 15, 2024",
      image:
        "https://images.unsplash.com/photo-1611997223036-302c7758526c?w=1200&h=600&fit=crop",
      category: "Guides",
      readTime: "9 min read",
      author: "Jennifer Martinez",
      tags: [
        "age-appropriate games",
        "family games",
        "game recommendations",
        "parenting",
      ],
    },
  ];

  const post = blogPosts.find((p) => p.id === parseInt(postId));

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Magestic",
    },
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={post.tags.join(", ")}
        url={`/blog/${post.id}`}
        structuredData={structuredData}
      />

      <main className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-burgundy-600">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/blog" className="hover:text-burgundy-600">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-800">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            <div className="h-96 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <span className="bg-burgundy-100 text-burgundy-700 text-xs px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">By {post.author}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none text-gray-700 mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/blog")}
                  className="px-6 py-2 bg-burgundy-600 text-white rounded-md hover:bg-burgundy-700 transition-colors font-semibold"
                >
                  ← Back to Blog
                </button>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <div className="h-48 bg-gradient-to-br from-gold-100 to-gold-200 relative overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <span className="bg-gold-100 text-burgundy-700 text-xs px-2 py-1 rounded-full mb-3 inline-block">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {relatedPost.readTime}
                      </p>
                      <button className="text-gold-600 font-semibold hover:text-burgundy-700 transition-colors">
                        Read More →
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default BlogPostPage;
