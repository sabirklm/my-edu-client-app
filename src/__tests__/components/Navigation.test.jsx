import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../../components/common/Navigation';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  };
});

const renderNavigation = () => {
  return render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all navigation links', () => {
    renderNavigation();

    expect(screen.getByText('MockExam Pro')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Exams')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    // Mock useLocation to return dashboard path
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/dashboard' })
      };
    });

    renderNavigation();

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('text-blue-600');
  });

  it('should navigate when links are clicked', () => {
    renderNavigation();

    const examsLink = screen.getByText('Exams');
    fireEvent.click(examsLink);

    expect(mockNavigate).toHaveBeenCalledWith('/exams');
  });

  it('should toggle mobile menu', () => {
    renderNavigation();

    // Mobile menu should be hidden initially
    const mobileMenu = screen.getByRole('button', { name: /toggle navigation/i });
    expect(mobileMenu).toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(mobileMenu);

    // Mobile navigation should be visible
    const mobileNav = screen.getByRole('navigation');
    expect(mobileNav).toHaveClass('translate-x-0');
  });

  it('should close mobile menu when link is clicked', () => {
    renderNavigation();

    // Open mobile menu
    const menuToggle = screen.getByRole('button', { name: /toggle navigation/i });
    fireEvent.click(menuToggle);

    // Click a link in mobile menu
    const homeLink = screen.getAllByText('Home')[1]; // Second one is in mobile menu
    fireEvent.click(homeLink);

    // Mobile menu should close
    const mobileNav = screen.getByRole('navigation');
    expect(mobileNav).toHaveClass('-translate-x-full');
  });
});