import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import UnifiedHomePage from './pages/UnifiedHomePage';
import ArticlesHomePage from './pages/ArticlesHomePage';
import ExamListingPage from './pages/ExamListingPage';
import MockExamPageImproved from './pages/MockExamPageImproved';
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnifiedHomePage />} />
        <Route path="/exams" element={<ExamListingPage />} />
        <Route path="/mocks/:id" element={<MockExamPageImproved />} />
        <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
        <Route path="/articles" element={<ArticlesHomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Legacy routes for backward compatibility */}
        <Route path="/mocks" element={<ExamListingPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
