import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, MessageCircle, Clock,
  CheckCircle, HelpCircle, BookOpen,
  Users, Zap, Heart, Globe, ArrowRight
} from 'lucide-react';
import {
  Card, Button, Input, Select, Form, Row, Col,
  Typography, Divider, Avatar, Collapse,
  Alert, Steps
} from 'antd';
import Navigation from '../components/common/Navigation';
import { notifySuccess, notifyError } from '../utils/notifications';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Step } = Steps;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');

  const contactCategories = [
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Issues with mock tests, login, or platform functionality',
      icon: <Zap className="w-6 h-6" />,
      color: 'blue',
      responseTime: '2-4 hours'
    },
    {
      id: 'academic',
      title: 'Academic Support',
      description: 'Questions about study materials, exam patterns, or content',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'green',
      responseTime: '4-8 hours'
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Payment issues, refunds, or subscription queries',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'orange',
      responseTime: '1-2 hours'
    },
    {
      id: 'partnership',
      title: 'Partnerships',
      description: 'Collaboration opportunities, content partnerships',
      icon: <Users className="w-6 h-6" />,
      color: 'purple',
      responseTime: '1-3 days'
    },
    {
      id: 'feedback',
      title: 'Feedback & Suggestions',
      description: 'Feature requests, improvements, or general feedback',
      icon: <Heart className="w-6 h-6" />,
      color: 'red',
      responseTime: '2-5 days'
    },
    {
      id: 'general',
      title: 'General Inquiry',
      description: 'Any other questions or concerns',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'gray',
      responseTime: '1-2 days'
    }
  ];

  const faqData = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
    },
    {
      question: 'Can I access mock tests offline?',
      answer: 'Currently, mock tests require an internet connection. We\'re working on offline capabilities for future updates.'
    },
    {
      question: 'How accurate are the mock test scores?',
      answer: 'Our mock tests are designed by experts to closely match actual exam patterns and difficulty levels.'
    },
    {
      question: 'Do you provide certificates for completed courses?',
      answer: 'Yes, we provide completion certificates for all paid courses that can be downloaded from your dashboard.'
    },
    {
      question: 'How can I track my progress?',
      answer: 'Your detailed progress and analytics are available in the Dashboard section with subject-wise breakdowns.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Academic Director',
      specialty: 'Physics & JEE Expert',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Prof. Priya Sharma',
      role: 'Content Head',
      specialty: 'Chemistry & NEET Expert',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Rahul Gupta',
      role: 'Technical Lead',
      specialty: 'Platform Development',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Form submitted:', { ...values, category: selectedCategory });

      notifySuccess('Message sent successfully! We\'ll get back to you soon.');
      form.resetFields();
      setSelectedCategory('general');
    } catch (error) {
      notifyError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Title level={1} className="text-white mb-4 text-4xl md:text-5xl">
              Get in Touch
            </Title>
            <Paragraph className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Paragraph>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Quick Contact Info */}
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <Title level={4}>Email Us</Title>
              <Text className="text-gray-600">support@eduplatform.com</Text>
              <br />
              <Text className="text-gray-600">academic@eduplatform.com</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <Phone className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <Title level={4}>Call Us</Title>
              <Text className="text-gray-600">+91 98765 43210</Text>
              <br />
              <Text className="text-gray-600">Mon-Sat: 9AM-7PM</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="text-center h-full">
              <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <Title level={4}>Visit Us</Title>
              <Text className="text-gray-600">
                123 Education Street<br />
                Tech City, TC 560001
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[32, 32]}>

          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card title={
              <div className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Send us a Message
              </div>
            }>

              {/* Support Categories */}
              <div className="mb-8">
                <Title level={5} className="mb-4">What can we help you with?</Title>
                <Row gutter={[16, 16]}>
                  {contactCategories.map(category => (
                    <Col key={category.id} xs={24} sm={12} lg={8}>
                      <Card
                        size="small"
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === category.id
                          ? `border-${category.color}-500 bg-${category.color}-50`
                          : 'border-gray-200'
                          }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="text-center">
                          <div className={`text-${category.color}-600 mb-2`}>
                            {category.icon}
                          </div>
                          <Text className="font-medium text-sm">{category.title}</Text>
                          <div className="text-xs text-gray-500 mt-1">
                            {category.responseTime}
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Selected Category Info */}
              {selectedCategory && (
                <Alert
                  message={contactCategories.find(c => c.id === selectedCategory)?.title}
                  description={contactCategories.find(c => c.id === selectedCategory)?.description}
                  type="info"
                  showIcon
                  className="mb-6"
                />
              )}

              {/* Contact Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[
                        { required: true, message: 'Please enter your name' },
                        { min: 2, message: 'Name must be at least 2 characters' }
                      ]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input placeholder="john@example.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: 'Please enter a subject' },
                    { min: 5, message: 'Subject must be at least 5 characters' }
                  ]}
                >
                  <Input placeholder="Brief description of your inquiry" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    { required: true, message: 'Please enter your message' },
                    { min: 20, message: 'Message must be at least 20 characters' }
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                    block
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form.Item>
              </Form>

              {/* Response Time Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <Text className="font-medium">Expected Response Time</Text>
                </div>
                <Text className="text-gray-600">
                  {contactCategories.find(c => c.id === selectedCategory)?.responseTime || '1-2 days'}
                </Text>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={10}>

            {/* FAQ Section */}
            <Card title="Frequently Asked Questions" className="mb-6">
              <Collapse ghost>
                {faqData.map((faq, index) => (
                  <Panel
                    header={faq.question}
                    key={index}
                    extra={<HelpCircle className="w-4 h-4" />}
                  >
                    <Text className="text-gray-600">{faq.answer}</Text>
                  </Panel>
                ))}
              </Collapse>

              <Divider />

              <div className="text-center">
                <Text className="text-gray-600">Can't find what you're looking for?</Text>
                <br />
                <Button type="link" className="p-0">
                  View All FAQs <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Team Section */}
            <Card title="Meet Our Team">
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar src={member.avatar} size={50} />
                    <div>
                      <Text className="font-medium block">{member.name}</Text>
                      <Text className="text-blue-600 text-sm">{member.role}</Text>
                      <Text className="text-gray-500 text-xs">{member.specialty}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support Hours */}
            <Card title="Support Hours" className="mt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Monday - Friday</Text>
                  <Text className="font-medium">9:00 AM - 7:00 PM</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Saturday</Text>
                  <Text className="font-medium">10:00 AM - 4:00 PM</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Sunday</Text>
                  <Text className="text-red-500">Closed</Text>
                </div>
                <Divider />

              </div>
            </Card>
          </Col>
        </Row>
        <div className='mt-2'></div>
        {/* Alternative Contact Methods */}
        <Card title="Other Ways to Reach Us" className="mt-12">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <Title level={5}>Community Forum</Title>
                <Text className="text-gray-600">
                  Join our community forum for peer-to-peer discussions and support.
                </Text>
                <br />
                <Button type="link" className="mt-2">Visit Forum</Button>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <Title level={5}>Live Chat</Title>
                <Text className="text-gray-600">
                  Get instant help through our live chat during business hours.
                </Text>
                <br />
                <Button type="primary" className="mt-2">Start Chat</Button>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <Title level={5}>Help Center</Title>
                <Text className="text-gray-600">
                  Browse our comprehensive help center for detailed guides.
                </Text>
                <br />
                <Button type="link" className="mt-2">View Guides</Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;