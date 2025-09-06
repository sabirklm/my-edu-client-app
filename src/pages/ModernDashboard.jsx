import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, Target, Users, 
  Bell, Calendar, BarChart3, Star,
  PlayCircle, Bookmark, Trophy, 
  Settings, Heart,
  Flame, CheckCircle, ArrowUp} from 'lucide-react';
import { 
  Card, Button, Progress, Avatar, Badge, Tag, Input, 
  Tabs, Statistic, Row, Col, Divider,
  Typography} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Search: AntSearch } = Input;
const { TabPane } = Tabs;

const ModernDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API calls
  const userStats = {
    testsCompleted: 24,
    averageScore: 78,
    studyStreak: 12,
    totalStudyTime: 145,
    rank: 342,
    improvementRate: 15
  };

  const recentActivity = [
    { id: 1, type: 'exam', title: 'JEE Main Physics Mock Test', score: 85, date: '2 hours ago', difficulty: 'Medium' },
    { id: 2, type: 'article', title: 'Advanced Calculus Concepts', readTime: 8, date: '1 day ago' },
    { id: 3, type: 'news', title: 'JEE 2025 Registration Extended', date: '2 days ago', category: 'Important' },
    { id: 4, type: 'job', title: 'Software Engineer at Google', date: '3 days ago', location: 'Remote' }
  ];

  const upcomingExams = [
    { id: 1, name: 'JEE Main 2025', date: '2025-01-15', daysLeft: 45, registered: true },
    { id: 2, name: 'NEET 2025', date: '2025-05-05', daysLeft: 156, registered: false },
    { id: 3, name: 'GATE CSE 2025', date: '2025-02-10', daysLeft: 71, registered: true }
  ];

  const recommendedContent = [
    {
      id: 1,
      type: 'mock-test',
      title: 'Physics Mechanics - JEE Advanced Level',
      difficulty: 'Hard',
      duration: 90,
      attempts: 1245,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300'
    },
    {
      id: 2,
      type: 'article',
      title: 'Organic Chemistry Quick Revision Notes',
      readTime: 12,
      views: 3400,
      author: 'Dr. Priya Sharma',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300'
    },
    {
      id: 3,
      type: 'news',
      title: 'New IIT Campus Announced in Assam',
      date: '2024-09-05',
      category: 'Education News',
      thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?w=300'
    }
  ];

  const studyStreakData = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: false },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false }
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Study for 7 consecutive days', earned: true, icon: '🔥' },
    { id: 2, title: 'First Century', description: 'Score 100% in any test', earned: false, icon: '💯' },
    { id: 3, title: 'Speed Demon', description: 'Complete test in under 30 minutes', earned: true, icon: '⚡' },
    { id: 4, title: 'Bookworm', description: 'Read 50 articles', earned: false, icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Badge dot color="red">
                <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
              </Badge>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <AntSearch 
              placeholder="Search tests, articles, news..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
              <div>
                <Text className="text-sm font-medium">Rahul Sharma</Text>
                <div className="text-xs text-gray-500">Rank #342</div>
              </div>
            </div>
            <Settings className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <div className="text-center">
                <Avatar size={80} src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" className="mb-4" />
                <Title level={4} className="mb-2">Rahul Sharma</Title>
                <Text className="text-gray-500">JEE Aspirant 2025</Text>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Study Streak</span>
                  <div className="flex items-center">
                    <Flame className="w-4 h-4 text-orange-500 mr-1" />
                    <Text className="font-bold text-orange-500">{userStats.studyStreak} days</Text>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg Score</span>
                  <Text className="font-bold text-blue-600">{userStats.averageScore}%</Text>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Global Rank</span>
                  <Text className="font-bold text-purple-600">#{userStats.rank}</Text>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Study Time</span>
                  <Text className="font-bold text-green-600">{userStats.totalStudyTime}h</Text>
                </div>
              </div>
            </Card>

            {/* Study Streak Visualization */}
            <Card title="This Week" className="mb-6">
              <div className="flex justify-between mb-2">
                {studyStreakData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${
                      day.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                      {day.completed ? <CheckCircle className="w-4 h-4 text-white" /> : null}
                    </div>
                    <Text className="text-xs">{day.day}</Text>
                  </div>
                ))}
              </div>
              <Text className="text-sm text-gray-500">Keep it up! You're on a roll 🔥</Text>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button type="primary" block icon={<PlayCircle className="w-4 h-4" />}>
                  Take Mock Test
                </Button>
                <Button block icon={<BookOpen className="w-4 h-4" />}>
                  Browse Articles
                </Button>
                <Button block icon={<Calendar className="w-4 h-4" />}>
                  Exam Calendar
                </Button>
                <Button block icon={<Trophy className="w-4 h-4" />}>
                  Leaderboard
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Performance Overview */}
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Tests Completed" 
                    value={userStats.testsCompleted} 
                    prefix={<CheckCircle className="w-4 h-4 text-green-500" />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Average Score" 
                    value={userStats.averageScore} 
                    suffix="%" 
                    prefix={<Target className="w-4 h-4 text-blue-500" />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Improvement" 
                    value={userStats.improvementRate} 
                    suffix="%" 
                    prefix={<ArrowUp className="w-4 h-4 text-green-500" />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic 
                    title="Study Hours" 
                    value={userStats.totalStudyTime} 
                    suffix="h" 
                    prefix={<Clock className="w-4 h-4 text-purple-500" />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Tabs for Different Content */}
            <Card>
              <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
                
                {/* Dashboard Tab */}
                <TabPane tab="Dashboard" key="dashboard">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Recent Activity */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Title level={4}>Recent Activity</Title>
                        <Link to="/dashboard/activity">
                          <Button type="link" size="small">View All</Button>
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        {recentActivity.map(activity => (
                          <Card key={activity.id} size="small" className="hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  activity.type === 'exam' ? 'bg-blue-100' :
                                  activity.type === 'article' ? 'bg-green-100' :
                                  activity.type === 'news' ? 'bg-orange-100' : 'bg-purple-100'
                                }`}>
                                  {activity.type === 'exam' && <Target className="w-5 h-5 text-blue-600" />}
                                  {activity.type === 'article' && <BookOpen className="w-5 h-5 text-green-600" />}
                                  {activity.type === 'news' && <Bell className="w-5 h-5 text-orange-600" />}
                                  {activity.type === 'job' && <Users className="w-5 h-5 text-purple-600" />}
                                </div>
                                <div>
                                  <Text className="font-medium">{activity.title}</Text>
                                  <div className="text-xs text-gray-500">
                                    {activity.score && `Score: ${activity.score}%`}
                                    {activity.readTime && `${activity.readTime} min read`}
                                    {activity.location && activity.location}
                                  </div>
                                </div>
                              </div>
                              <Text className="text-xs text-gray-400">{activity.date}</Text>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Title level={4}>Upcoming Exams</Title>
                        <Link to="/exams">
                          <Button type="link" size="small">View All</Button>
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        {upcomingExams.map(exam => (
                          <Card key={exam.id} size="small" className="hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div>
                                <Text className="font-medium">{exam.name}</Text>
                                <div className="text-xs text-gray-500">
                                  {new Date(exam.date).toLocaleDateString()} • {exam.daysLeft} days left
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {exam.registered ? (
                                  <Badge status="success" text="Registered" />
                                ) : (
                                  <Button size="small" type="primary">Register</Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Achievements Section */}
                  <div className="mt-8">
                    <Title level={4} className="mb-4">Achievements</Title>
                    <Row gutter={[16, 16]}>
                      {achievements.map(achievement => (
                        <Col key={achievement.id} xs={24} sm={12} md={6}>
                          <Card 
                            className={`text-center ${achievement.earned ? 'border-yellow-400 bg-yellow-50' : 'opacity-60'}`}
                            size="small"
                          >
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <Text className="font-medium">{achievement.title}</Text>
                            <div className="text-xs text-gray-500 mt-1">{achievement.description}</div>
                            {achievement.earned && <Badge status="success" className="mt-2" />}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </TabPane>

                {/* Recommendations Tab */}
                <TabPane tab="For You" key="recommendations">
                  <Title level={4} className="mb-4">Personalized Recommendations</Title>
                  <Row gutter={[16, 16]}>
                    {recommendedContent.map(item => (
                      <Col key={item.id} xs={24} md={12} lg={8}>
                        <Card
                          hoverable
                          cover={
                            <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                              <img 
                                src={item.thumbnail} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          }
                          actions={[
                            <Button key="start" type="primary" size="small">
                              {item.type === 'mock-test' ? 'Start Test' : 
                               item.type === 'article' ? 'Read Now' : 'View'}
                            </Button>,
                            <Bookmark key="bookmark" className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" />,
                            <Heart key="like" className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                          ]}
                        >
                          <div className="mb-2">
                            <Tag color={
                              item.type === 'mock-test' ? 'blue' :
                              item.type === 'article' ? 'green' : 'orange'
                            }>
                              {item.type.replace('-', ' ').toUpperCase()}
                            </Tag>
                            {item.difficulty && <Tag color="red">{item.difficulty}</Tag>}
                          </div>
                          
                          <Title level={5} className="mb-2 line-clamp-2">{item.title}</Title>
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            {item.duration && <div>⏱️ {item.duration} min</div>}
                            {item.readTime && <div>📖 {item.readTime} min read</div>}
                            {item.attempts && <div>👥 {item.attempts} attempts</div>}
                            {item.rating && (
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                {item.rating}
                              </div>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </TabPane>

                {/* Progress Tab */}
                <TabPane tab="Progress" key="progress">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Subject-wise Performance">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <Text>Physics</Text>
                            <Text>78%</Text>
                          </div>
                          <Progress percent={78} strokeColor="#52c41a" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <Text>Chemistry</Text>
                            <Text>65%</Text>
                          </div>
                          <Progress percent={65} strokeColor="#1890ff" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <Text>Mathematics</Text>
                            <Text>82%</Text>
                          </div>
                          <Progress percent={82} strokeColor="#722ed1" />
                        </div>
                      </div>
                    </Card>

                    <Card title="Monthly Progress">
                      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <Text className="text-gray-500">Progress chart will be displayed here</Text>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;