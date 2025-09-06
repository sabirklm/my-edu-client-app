import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid, List, BookOpen, 
  Clock, User, Eye, Heart,
  Bookmark, Share2, Star, 
  SlidersHorizontal,
  Users
} from 'lucide-react';
import { 
  Card, Button, Input, Select, Tag, Badge, 
  Row, Col, Pagination, Tabs,
  Typography, Divider, Radio, Checkbox, Slider
} from 'antd';

const { Search: AntSearch } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ContentHub = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: [],
    category: [],
    contentType: [],
    duration: [0, 120]
  });
  const [sortBy, setSortBy] = useState('popular');

  // Mock data - replace with API calls
  const allContent = [
    {
      id: 1,
      type: 'mock-test',
      title: 'JEE Main Physics - Complete Test Series',
      description: 'Comprehensive physics mock test covering all JEE Main topics with detailed solutions.',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400',
      difficulty: 'Medium',
      duration: 180,
      questions: 30,
      attempts: 15420,
      rating: 4.8,
      category: 'Physics',
      tags: ['JEE Main', 'Physics', 'Mock Test'],
      author: 'Dr. Rajesh Kumar',
      publishedDate: '2024-09-01',
      isBookmarked: false,
      isFree: false,
      price: 299
    },
    {
      id: 2,
      type: 'article',
      title: 'Organic Chemistry Quick Revision Guide',
      description: 'Essential organic chemistry concepts and reactions for JEE and NEET preparation.',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      readTime: 15,
      views: 24500,
      likes: 1240,
      category: 'Chemistry',
      tags: ['Organic Chemistry', 'JEE', 'NEET'],
      author: 'Prof. Priya Sharma',
      publishedDate: '2024-09-03',
      isBookmarked: true,
      isFree: true
    },
    {
      id: 3,
      type: 'news',
      title: 'JEE Advanced 2025: Important Changes in Exam Pattern',
      description: 'Latest updates on JEE Advanced 2025 including new question patterns and marking scheme.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      category: 'Exam Updates',
      tags: ['JEE Advanced', 'Exam Pattern', '2025'],
      publishedDate: '2024-09-05',
      isUrgent: true,
      source: 'IIT Delhi',
      isFree: true
    },
    {
      id: 4,
      type: 'job',
      title: 'Software Engineer - Google India',
      description: 'Exciting opportunity for fresh graduates. Work on cutting-edge technology with competitive compensation.',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
      company: 'Google',
      location: 'Bangalore, India',
      salary: '₹25-35 LPA',
      experience: '0-2 years',
      category: 'Software Engineering',
      tags: ['Software Engineer', 'Google', 'Fresh Graduate'],
      publishedDate: '2024-09-04',
      deadline: '2024-10-15',
      isFeatured: true,
      isFree: true
    },
    {
      id: 5,
      type: 'course',
      title: 'Complete Data Structures & Algorithms Course',
      description: 'Master DSA concepts with hands-on coding practice and interview preparation.',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
      duration: 40,
      lessons: 120,
      difficulty: 'Intermediate',
      category: 'Programming',
      tags: ['DSA', 'Coding', 'Interview Prep'],
      instructor: 'Rahul Gupta',
      rating: 4.9,
      students: 45000,
      price: 1999,
      discount: 50,
      isFree: false
    }
  ];

  const categories = [
    { key: 'all', label: 'All Content', count: 250 },
    { key: 'mock-tests', label: 'Mock Tests', count: 85 },
    { key: 'articles', label: 'Study Articles', count: 120 },
    { key: 'news', label: 'Exam News', count: 25 },
    { key: 'jobs', label: 'Job Opportunities', count: 15 },
    { key: 'courses', label: 'Online Courses', count: 5 }
  ];

  const filterOptions = {
    difficulty: ['Easy', 'Medium', 'Hard'],
    category: ['Physics', 'Chemistry', 'Mathematics', 'Programming', 'General'],
    contentType: ['Free', 'Premium', 'Featured'],
    examType: ['JEE Main', 'JEE Advanced', 'NEET', 'GATE', 'Other']
  };

  const ContentCard = ({ item, isListView = false }) => {
    if (isListView) {
      return (
        <Card className="mb-4 hover:shadow-lg transition-all">
          <div className="flex items-start space-x-4">
            <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag color={
                    item.type === 'mock-test' ? 'blue' :
                    item.type === 'article' ? 'green' :
                    item.type === 'news' ? 'orange' :
                    item.type === 'job' ? 'purple' : 'cyan'
                  }>
                    {item.type.replace('-', ' ').toUpperCase()}
                  </Tag>
                  {item.difficulty && <Tag color="red">{item.difficulty}</Tag>}
                  {item.isFeatured && <Badge status="success" text="Featured" />}
                  {item.isUrgent && <Badge status="error" text="Urgent" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="text" 
                    size="small"
                    icon={<Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'text-blue-500' : 'text-gray-400'}`} />}
                  />
                  <Button type="text" size="small" icon={<Share2 className="w-4 h-4 text-gray-400" />} />
                </div>
              </div>
              
              <Title level={5} className="mb-2 line-clamp-1">{item.title}</Title>
              <Paragraph className="text-gray-600 mb-3 line-clamp-2">{item.description}</Paragraph>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {item.author && (
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {item.author}
                    </span>
                  )}
                  {item.duration && (
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.duration} min
                    </span>
                  )}
                  {item.readTime && (
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {item.readTime} min read
                    </span>
                  )}
                  {item.rating && (
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {item.rating}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.price && !item.isFree ? (
                    <Text className="font-semibold text-green-600">
                      ₹{item.discount ? Math.floor(item.price * (100 - item.discount) / 100) : item.price}
                      {item.discount && <span className="text-gray-400 line-through ml-1">₹{item.price}</span>}
                    </Text>
                  ) : (
                    <Text className="text-green-600 font-medium">Free</Text>
                  )}
                  <Button type="primary" size="small">
                    {item.type === 'mock-test' ? 'Start Test' :
                     item.type === 'article' ? 'Read' :
                     item.type === 'course' ? 'Enroll' :
                     item.type === 'job' ? 'Apply' : 'View'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card
        hoverable
        className="h-full"
        cover={
          <div className="relative h-48 overflow-hidden">
            <img 
              src={item.thumbnail} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex space-x-1">
              <Tag color={
                item.type === 'mock-test' ? 'blue' :
                item.type === 'article' ? 'green' :
                item.type === 'news' ? 'orange' :
                item.type === 'job' ? 'purple' : 'cyan'
              }>
                {item.type.replace('-', ' ').toUpperCase()}
              </Tag>
              {item.difficulty && <Tag color="red">{item.difficulty}</Tag>}
            </div>
            <div className="absolute top-3 right-3 flex space-x-1">
              {item.isFeatured && <Badge status="success" />}
              {item.isUrgent && <Badge status="error" />}
            </div>
            {!item.isFree && item.price && (
              <div className="absolute bottom-3 left-3">
                <div className="bg-white px-2 py-1 rounded text-sm font-semibold text-green-600">
                  ₹{item.discount ? Math.floor(item.price * (100 - item.discount) / 100) : item.price}
                  {item.discount && (
                    <span className="text-gray-400 line-through ml-1">₹{item.price}</span>
                  )}
                </div>
              </div>
            )}
            {item.isFree && (
              <div className="absolute bottom-3 left-3">
                <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  FREE
                </div>
              </div>
            )}
          </div>
        }
        actions={[
          <Button key="action" type="primary" size="small" block>
            {item.type === 'mock-test' ? 'Start Test' :
             item.type === 'article' ? 'Read Now' :
             item.type === 'course' ? 'Enroll Now' :
             item.type === 'job' ? 'Apply Now' : 'View Details'}
          </Button>,
          <div key="icons" className="flex justify-center space-x-2">
            <Button 
              type="text" 
              size="small"
              icon={<Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'text-blue-500' : 'text-gray-400'}`} />}
            />
            <Button type="text" size="small" icon={<Heart className="w-4 h-4 text-gray-400" />} />
            <Button type="text" size="small" icon={<Share2 className="w-4 h-4 text-gray-400" />} />
          </div>
        ]}
      >
        <div className="px-2">
          <Title level={5} className="mb-2 line-clamp-2 min-h-[48px]">{item.title}</Title>
          <Paragraph className="text-gray-600 mb-3 line-clamp-3 text-sm">
            {item.description}
          </Paragraph>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags?.slice(0, 2).map(tag => (
              <Tag key={tag} size="small" color="default">{tag}</Tag>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {item.author && (
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {item.author.split(' ')[0]}
                </span>
              )}
              {item.duration && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.duration}m
                </span>
              )}
              {item.readTime && (
                <span className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {item.readTime}m
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {item.rating && (
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                  {item.rating}
                </span>
              )}
              {item.views && (
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {item.views > 1000 ? `${(item.views/1000).toFixed(1)}k` : item.views}
                </span>
              )}
              {item.attempts && (
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {item.attempts > 1000 ? `${(item.attempts/1000).toFixed(1)}k` : item.attempts}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Title level={2} className="mb-2">Content Hub</Title>
              <Text className="text-gray-600">
                Discover mock tests, articles, news, jobs, and courses tailored for you
              </Text>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button icon={<SlidersHorizontal className="w-4 h-4" />}>
                Advanced Filters
              </Button>
              <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} size="small">
                <Radio.Button value="grid"><Grid className="w-4 h-4" /></Radio.Button>
                <Radio.Button value="list"><List className="w-4 h-4" /></Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <AntSearch
                placeholder="Search for mock tests, articles, news, jobs..."
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Select
                placeholder="Sort by"
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 150 }}
                size="large"
              >
                <Option value="popular">Most Popular</Option>
                <Option value="recent">Most Recent</Option>
                <Option value="rating">Highest Rated</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
              </Select>
              
              <Select
                placeholder="Category"
                style={{ width: 150 }}
                size="large"
                allowClear
              >
                {filterOptions.category.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-80 hidden lg:block">
            <Card title="Categories" className="mb-6">
              <div className="space-y-2">
                {categories.map(category => (
                  <div
                    key={category.key}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      activeTab === category.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab(category.key)}
                  >
                    <span className="font-medium">{category.label}</span>
                    <Badge count={category.count} size="small" />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Filters" className="mb-6">
              <div className="space-y-6">
                <div>
                  <Text className="font-medium mb-3 block">Difficulty</Text>
                  <div className="space-y-2">
                    {filterOptions.difficulty.map(level => (
                      <Checkbox key={level}>{level}</Checkbox>
                    ))}
                  </div>
                </div>

                <Divider />

                <div>
                  <Text className="font-medium mb-3 block">Content Type</Text>
                  <div className="space-y-2">
                    {filterOptions.contentType.map(type => (
                      <Checkbox key={type}>{type}</Checkbox>
                    ))}
                  </div>
                </div>

                <Divider />

                <div>
                  <Text className="font-medium mb-3 block">Duration (minutes)</Text>
                  <Slider
                    range
                    min={0}
                    max={300}
                    defaultValue={[0, 120]}
                    marks={{
                      0: '0',
                      60: '1h',
                      120: '2h',
                      300: '5h+'
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card title="Popular Tags">
              <div className="flex flex-wrap gap-2">
                {['JEE Main', 'NEET', 'Physics', 'Chemistry', 'Mock Test', 'Free', 'Premium'].map(tag => (
                  <Tag key={tag} className="cursor-pointer hover:bg-blue-50">
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <Text className="text-gray-600">
                Showing {allContent.length} results for "{searchQuery || 'all content'}"
              </Text>
              <Text className="text-gray-500">
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </Text>
            </div>

            {/* Content Grid/List */}
            <AnimatePresence>
              {viewMode === 'grid' ? (
                <Row gutter={[16, 16]}>
                  {allContent.map(item => (
                    <Col key={item.id} xs={24} sm={12} lg={8} xl={6}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ContentCard item={item} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div>
                  {allContent.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContentCard item={item} isListView />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <div className="mt-12 text-center">
              <Pagination 
                current={1}
                total={250}
                pageSize={20}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHub;