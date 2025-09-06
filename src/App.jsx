import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePageEnhanced from './pages/HomePageEnhanced';
import ExamListingPage from './pages/ExamListingPage';
import MockExamPageEnhanced from './pages/MockExamPageEnhanced';
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageEnhanced />} />
        <Route path="/exams" element={<ExamListingPage />} />
        <Route path="/mocks/:id" element={<MockExamPageEnhanced />} />
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
