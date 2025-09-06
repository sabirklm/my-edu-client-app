import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, User, Eye, Bookmark, Share2, ArrowLeft } from 'lucide-react';
import { Button, Tag, Divider, Card, Typography } from 'antd';
import { motion } from 'framer-motion';
import articleDetails from '../data/ArticleDetailsData.js';

const { Title, Paragraph } = Typography;

// Content Block Components
const TextBlock = ({ block }) => {
  const getComponent = () => {
    const cleanContent = block.content.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags for Ant Design components
    
    switch (block.textType) {
      case 'h1':
        return <Title level={1}>{cleanContent}</Title>;
      case 'h2':
        return <Title level={2}>{cleanContent}</Title>;
      case 'h3':
        return <Title level={3}>{cleanContent}</Title>;
      case 'paragraph':
        return <Paragraph>{cleanContent}</Paragraph>;
      default:
        return <div dangerouslySetInnerHTML={{ __html: block.content }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      {getComponent()}
    </motion.div>
  );
};

const ImageBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className={`mb-8 ${block.alignment === 'center' ? 'text-center' : ''}`}
  >
    <img
      src={block.imageUrl}
      alt={block.altText}
      className="rounded-lg shadow-lg mx-auto max-w-full"
      style={{
        width: block.width ? `${block.width}px` : 'auto',
        height: block.height ? `${block.height}px` : 'auto',
        maxWidth: '100%'
      }}
    />
    {block.caption && (
      <p className="text-sm text-gray-600 mt-3 italic">{block.caption}</p>
    )}
  </motion.div>
);

const QuoteBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="mb-8"
  >
    <Card 
      className={`${
        block.quoteStyle === 'highlighted' 
          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
          : block.quoteStyle === 'modern'
          ? 'bg-gray-50 border-l-4 border-l-gray-400'
          : 'bg-yellow-50 border-l-4 border-l-yellow-500'
      }`}
    >
      <blockquote className="text-lg italic text-gray-700 mb-4">
        "{block.quoteText}"
      </blockquote>
      <div className="text-right">
        <p className="font-semibold text-gray-800">{block.author}</p>
        {block.authorTitle && (
          <p className="text-sm text-gray-600">{block.authorTitle}</p>
        )}
      </div>
    </Card>
  </motion.div>
);

const CodeBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <Card className="bg-gray-900 text-green-400">
      {block.filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm border-b border-gray-700">
          =� {block.filename}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${block.language}`}>
          {block.showLineNumbers 
            ? block.codeContent.split('\n').map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 mr-4 select-none w-8 text-right">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            : block.codeContent
          }
        </code>
      </pre>
    </Card>
  </motion.div>
);

const VideoBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="mb-8"
  >
    <Card>
      <div className="aspect-video">
        {block.videoType === 'youtube' ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${block.videoUrl.split('/').pop()}`}
            title={block.caption}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          />
        ) : block.videoType === 'vimeo' ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://player.vimeo.com/video/${block.videoUrl.split('/').pop()}`}
            title={block.caption}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          />
        ) : (
          <video
            width="100%"
            height="100%"
            controls={block.controls}
            autoPlay={block.autoplay}
            className="rounded-lg"
          >
            <source src={block.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {block.caption && (
        <p className="text-sm text-gray-600 mt-3 text-center">{block.caption}</p>
      )}
    </Card>
  </motion.div>
);

const MarkdownBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <Card className="prose max-w-none">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: block.markdownContent
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-4 text-gray-800">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-gray-800">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-800">$1</h1>')
            .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-bold text-gray-800">$1</strong>')
            .replace(/^\*(.*)\*/gim, '<em class="italic">$1</em>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2">$1</li>')
            .replace(/\n\n/g, '</p><p class="mb-4">')
            .replace(/\n/g, '<br/>')
        }} 
      />
    </Card>
  </motion.div>
);

const DividerBlock = ({ block }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className={`mb-${block.spacing === 'large' ? '12' : block.spacing === 'medium' ? '8' : '4'}`}
  >
    <Divider 
      className={
        block.dividerStyle === 'gradient' 
          ? 'border-gradient-to-r from-blue-400 via-purple-500 to-blue-400' 
          : block.dividerStyle === 'thick'
          ? 'border-t-4 border-gray-300'
          : 'border-gray-300'
      } 
    />
  </motion.div>
);

// Content Block Renderer
const ContentBlockRenderer = ({ block }) => {
  switch (block.blockType) {
    case 'textBlock':
      return <TextBlock block={block} />;
    case 'imageBlock':
      return <ImageBlock block={block} />;
    case 'quoteBlock':
      return <QuoteBlock block={block} />;
    case 'codeBlock':
      return <CodeBlock block={block} />;
    case 'videoBlock':
      return <VideoBlock block={block} />;
    case 'markdownBlock':
      return <MarkdownBlock block={block} />;
    case 'dividerBlock':
      return <DividerBlock block={block} />;
    default:
      return null;
  }
};

// Main Article Details Page Component
const ArticleDetailsPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // This is where you'll replace with API call
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        // TODO: Replace this with actual API call
        // const response = await fetch(`/api/articles/${slug}`);
        // const articleData = await response.json();
        
        // For now, using static data
        const articleData = articleDetails;
        setArticle(articleData);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You can add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
          <Button type="primary" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button 
              type="text" 
              icon={<ArrowLeft className="w-4 h-4" />}
              className="text-white hover:text-gray-200 mb-6"
              onClick={() => window.history.back()}
            >
              Back to Articles
            </Button>
            
            <Title level={1} className="text-white text-4xl md:text-5xl mb-6 leading-tight">
              {article.title}
            </Title>
            
            <p className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readingTime} min read
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Author ID: {article.author}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Actions */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {article.isFeatured && (
                <Tag color="gold">Featured Article</Tag>
              )}
              <Tag color="blue">{article.status}</Tag>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                type={isBookmarked ? "primary" : "default"}
                icon={<Bookmark className="w-4 h-4" />}
                onClick={handleBookmark}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button 
                icon={<Share2 className="w-4 h-4" />}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-8"
        >
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {article.contentBlocks?.map((block, index) => (
              <ContentBlockRenderer key={index} block={block} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Article Meta Info */}
      <div className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <Title level={4} className="mb-4">Article Information</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {article.category}
                </div>
                <div>
                  <strong>Tags:</strong> {article.tags?.join(', ')}
                </div>
                <div>
                  <strong>Reading Time:</strong> {article.readingTime} minutes
                </div>
                <div>
                  <strong>Status:</strong> {article.status}
                </div>
                {article.meta && (
                  <>
                    <div className="md:col-span-2">
                      <strong>Keywords:</strong> {article.meta.keywords}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailsPage;