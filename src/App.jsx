import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MockExamPage from './pages/MockExamPage';


function MocksPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/mocks/1')}>Go to Mock 1</button>
    </div>
  );
}


function AboutPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/contact')}>Go to Contact</button>
    </div>
  );
}

function ContactPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mocks" element={<MocksPage />} />
        <Route path="/mocks/:id" element={<MockExamPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;