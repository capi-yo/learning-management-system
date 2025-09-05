import React, { useState } from "react";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  read_time: number;
  tags: string[];
  featured_image?: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "The Future of Online Learning: Trends to Watch in 2024",
    excerpt:
      "Explore the latest trends shaping the future of online education, from AI-powered personalization to immersive virtual reality experiences.",
    content: `The landscape of online learning continues to evolve at a rapid pace. As we move through 2024, several key trends are reshaping how we approach digital education.

**Artificial Intelligence and Personalization**

AI is revolutionizing online learning by providing personalized learning paths tailored to individual student needs. Machine learning algorithms analyze learning patterns, identify knowledge gaps, and suggest targeted content to optimize the learning experience.

**Microlearning and Bite-sized Content**

The trend toward microlearning continues to gain momentum. Students increasingly prefer short, focused learning modules that can be completed in 5-15 minutes, making it easier to fit learning into busy schedules.

**Virtual and Augmented Reality**

VR and AR technologies are creating immersive learning experiences that were previously impossible in traditional online formats. From virtual lab experiments to historical site visits, these technologies are making abstract concepts tangible.

**Social Learning and Collaboration**

Online learning platforms are incorporating more social features, enabling peer-to-peer learning, group projects, and collaborative problem-solving that mirrors real-world work environments.`,
    author: "Dr. Sarah Johnson",
    published_at: "2024-01-15T10:00:00Z",
    read_time: 5,
    tags: ["Education Technology", "AI", "Future of Learning"],
    featured_image:
      "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "post-2",
    title: "Effective Study Techniques for Online Learners",
    excerpt:
      "Discover proven strategies to maximize your learning efficiency and retention when studying online.",
    content: `Online learning requires different strategies than traditional classroom learning. Here are evidence-based techniques to help you succeed.

**The Pomodoro Technique**

Break your study sessions into 25-minute focused intervals followed by 5-minute breaks. This technique helps maintain concentration and prevents mental fatigue.

**Active Note-Taking**

Don't just passively consume content. Engage with the material by taking notes, asking questions, and summarizing key concepts in your own words.

**Spaced Repetition**

Review material at increasing intervals to strengthen long-term retention. This technique is particularly effective for memorizing facts and concepts.

**Create a Dedicated Study Space**

Establish a specific area for learning that's free from distractions. This helps your brain associate the space with focused work.

**Join Study Groups**

Connect with fellow learners to discuss concepts, share insights, and stay motivated. Many online platforms offer forums and chat features for this purpose.`,
    author: "Michael Chen",
    published_at: "2024-01-10T14:30:00Z",
    read_time: 7,
    tags: ["Study Tips", "Productivity", "Learning Strategies"],
    featured_image:
      "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "post-3",
    title: "Building a Career in Web Development: A Complete Roadmap",
    excerpt:
      "A comprehensive guide to starting and advancing your career in web development, from beginner to expert.",
    content: `Web development offers exciting career opportunities with high demand and competitive salaries. Here's your roadmap to success.

**Phase 1: Foundation (Months 1-3)**

Start with HTML, CSS, and JavaScript fundamentals. Build simple projects like personal websites and basic interactive applications.

**Phase 2: Frontend Specialization (Months 4-6)**

Learn a modern framework like React, Vue, or Angular. Master responsive design, state management, and modern development tools.

**Phase 3: Backend Development (Months 7-9)**

Explore server-side technologies like Node.js, Python, or PHP. Learn about databases, APIs, and server deployment.

**Phase 4: Full-Stack Integration (Months 10-12)**

Combine frontend and backend skills to build complete applications. Learn about authentication, security, and performance optimization.

**Building Your Portfolio**

Create 3-5 projects that showcase different skills:
- A responsive landing page
- An interactive web application
- A full-stack project with database integration
- A mobile-responsive e-commerce site
- An API-driven application

**Networking and Job Search**

Join developer communities, attend meetups, contribute to open source projects, and build your professional network on platforms like LinkedIn and GitHub.`,
    author: "Alex Rodriguez",
    published_at: "2024-01-05T09:15:00Z",
    read_time: 10,
    tags: ["Career", "Web Development", "Programming"],
    featured_image:
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = mockBlogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors mb-6"
        >
          ← Back to Blog
        </button>

        <article className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/30 overflow-hidden">
          {selectedPost.featured_image && (
            <img
              src={selectedPost.featured_image}
              alt={selectedPost.title}
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-8">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-full border border-blue-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {selectedPost.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {selectedPost.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(selectedPost.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {selectedPost.read_time} min read
              </div>
            </div>

            {/* Content (kept as plain text with line breaks like your original) */}
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {selectedPost.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Learning Blog
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Insights, tips, and updates from the world of online learning
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-gray-100 border border-gray-300/30 dark:border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group relative bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/20 dark:border-gray-700/30 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            {/* Image */}
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Content */}
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-400/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{post.author}</span>
                <span>{formatDate(post.published_at)}</span>
              </div>

              {/* Read more */}
              <div className="mt-4 flex items-center text-blue-500 group-hover:text-blue-400 font-medium text-sm transition">
                Read more
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* No results */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
}
