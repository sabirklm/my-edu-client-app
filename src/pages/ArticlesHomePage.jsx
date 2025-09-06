import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, User, TrendingUp, Star, ArrowRight, 
  Calendar, Eye, MessageCircle, Bookmark, Share2, Search,
  Filter, Bell, Award, Users, Target, Lightbulb, Play,
  ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react';
import { Button, Card, Input, Tag, Carousel, Statistic, Avatar, Badge } from 'antd';
import Navigation from '../components/common/Navigation';
import { 
  featuredArticles, 
  latestNews, 
  examStats, 
  popularExams, 
  quickStats, 
  testimonials, 
  studyTips 
} from '../data/HomePageData';

const { Search: AntSearch } = Input;

const ArticlesHomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ['all', 'JEE Main', 'NEET', 'GATE', 'JEE Advanced', 'News', 'Tips'];

  const filteredArticles = featuredArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 py-20"
        >
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your <span className="text-yellow-400">Competitive Exams</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Get the latest updates, expert tips, and comprehensive guides for JEE, NEET, GATE and more
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <AntSearch
                placeholder="Search articles, news, exam guides..."
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg"
                enterButton={
                  <Button type="primary" icon={<Search className="w-4 h-4" />}>
                    Search
                  </Button>
                }
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Breaking News Ticker */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-red-600 text-white py-2"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <Badge count="LIVE" className="mr-4">
              <Bell className="w-5 h-5 animate-pulse" />
            </Badge>
            <div className="flex-1 overflow-hidden">
              <Carousel autoplay dots={false} effect="scrollx">
                {latestNews.filter(news => news.isUrgent).map(news => (
                  <div key={news.id}>
                    <p className="text-sm">{news.title} - {news.excerpt.substring(0, 100)}...</p>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                type={selectedCategory === category ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Articles */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Articles</h2>
              <p className="text-gray-600">Expert insights and comprehensive guides</p>
            </div>
            <Link to="/articles">
              <Button type="link" icon={<ArrowRight className="w-4 h-4" />}>
                View All Articles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 3).map((article, index) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Card 
                  hoverable
                  className="h-full overflow-hidden group"
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={article.featuredImage} 
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Tag color="blue">{article.category}</Tag>
                      </div>
                      {article.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readingTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link to={`/articles/${article.slug}`}>
                        <Button type="primary" size="small">
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Button type="text" size="small" icon={<Bookmark className="w-4 h-4" />} />
                        <Button type="text" size="small" icon={<Share2 className="w-4 h-4" />} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Latest News & Updates */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest News & Updates</h2>
              <p className="text-gray-600">Stay updated with the latest exam notifications and education news</p>
            </div>
            <Link to="/news">
              <Button type="link" icon={<ExternalLink className="w-4 h-4" />}>
                View All News
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main News */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${latestNews[0]?.isUrgent ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {latestNews[0]?.isUrgent ? (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Bell className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag color={latestNews[0]?.isUrgent ? "red" : "blue"}>
                        {latestNews[0]?.category}
                      </Tag>
                      <span className="text-sm text-gray-500">{latestNews[0]?.source}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{latestNews[0]?.title}</h3>
                    <p className="text-gray-600 mb-4">{latestNews[0]?.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(latestNews[0]?.publishedDate).toLocaleDateString()}
                      </span>
                      <Link to={latestNews[0]?.link}>
                        <Button type="primary" size="small">Read Full Story</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* News List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {latestNews.slice(1, 5).map((news, index) => (
                <Card key={news.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-16 rounded-full ${news.isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Tag size="small" color={news.isUrgent ? "red" : "blue"}>
                          {news.category}
                        </Tag>
                        <span className="text-xs text-gray-500">{news.source}</span>
                      </div>
                      <h4 className="font-semibold mb-1 line-clamp-1">{news.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{news.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(news.publishedDate).toLocaleDateString()}
                        </span>
                        <Link to={news.link}>
                          <Button type="link" size="small" className="p-0">
                            Read More <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Popular Exams */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Mock Exams</h2>
              <p className="text-gray-600">Practice with our most attempted mock tests</p>
            </div>
            <Link to="/exams">
              <Button type="primary" icon={<Target className="w-4 h-4" />}>
                View All Exams
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularExams.map((exam, index) => (
              <motion.div key={exam.id} variants={itemVariants}>
                <Card 
                  hoverable
                  className="h-full text-center"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${exam.color} flex items-center justify-center text-white text-2xl`}>
                    {exam.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{exam.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{exam.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="font-medium">{exam.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attempts:</span>
                      <span className="font-medium">{exam.attempts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Score:</span>
                      <span className="font-medium text-green-600">{exam.averageScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Tag color={exam.difficulty === 'Easy' ? 'green' : exam.difficulty === 'Medium' ? 'orange' : 'red'}>
                      {exam.difficulty}
                    </Tag>
                    <div className="pt-2">
                      <Link to={`/mocks/${exam.id}`}>
                        <Button type="primary" block icon={<Play className="w-4 h-4" />}>
                          Start Test
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Stories & Study Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Success Stories */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Success Stories</h2>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div key={testimonial.id} variants={itemVariants}>
                  <Card>
                    <div className="flex items-start gap-4">
                      <Avatar src={testimonial.avatar} size={60} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <Tag color="green">{testimonial.score}</Tag>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{testimonial.exam}</p>
                        <p className="text-gray-700 italic">"{testimonial.message}"</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Study Tips */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Study Tips</h2>
            <div className="space-y-4">
              {studyTips.map((tip, index) => (
                <motion.div key={tip.id} variants={itemVariants}>
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{tip.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{tip.title}</h4>
                          <Tag size="small" color="blue">{tip.category}</Tag>
                        </div>
                        <p className="text-gray-600 text-sm">{tip.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of successful students who achieved their dreams with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/exams">
              <Button type="primary" size="large" className="bg-white text-blue-600 hover:bg-gray-100 border-white">
                Start Practice Tests
              </Button>
            </Link>
            <Link to="/articles">
              <Button size="large" className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                Explore Study Materials
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ArticlesHomePage;