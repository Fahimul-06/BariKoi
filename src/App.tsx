import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import Auth from './pages/Auth';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import DeveloperDashboard from './pages/dashboards/DeveloperDashboard';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import { Page } from './types';
import { SearchFilters } from './components/SearchBar';

function AppContent() {
  const { profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>({});
  const [prevPage, setPrevPage] = useState<Page>('home');

  function navigate(newPage: Page) {
    setPrevPage(page);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSearch(filters: SearchFilters) {
    setSearchFilters(filters);
    navigate('search');
  }

  function viewProperty(id: string) {
    setSelectedPropertyId(id);
    navigate('property-detail');
  }

  function handleBack() {
    navigate(prevPage === 'property-detail' ? 'search' : prevPage);
  }

  // Auto-redirect to dashboard on login
  useEffect(() => {
    if (!loading && profile && page === 'auth') {
      const dashMap: Record<string, Page> = {
        developer: 'developer-dashboard',
        owner: 'owner-dashboard',
        admin: 'admin-dashboard',
        customer: 'customer-dashboard',
      };
      navigate(dashMap[profile.role] || 'home');
    }
  }, [profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading BariKoi...</p>
        </div>
      </div>
    );
  }

  const showNavbar = page !== 'auth';
  const showFooter = ['home', 'search', 'about', 'faq', 'privacy'].includes(page);

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <Navbar currentPage={page} onNavigate={navigate} />
      )}

      <main className="flex-1">
        {page === 'home' && (
          <Home
            onNavigate={navigate}
            onSearch={handleSearch}
            onViewProperty={viewProperty}
          />
        )}
        {page === 'search' && (
          <Search
            initialFilters={searchFilters}
            onNavigate={navigate}
            onViewProperty={viewProperty}
          />
        )}
        {page === 'property-detail' && (
          <PropertyDetail
            propertyId={selectedPropertyId}
            onBack={handleBack}
            onNavigate={navigate}
          />
        )}
        {page === 'auth' && (
          <Auth
            onNavigate={navigate}
            onBack={() => navigate('home')}
          />
        )}
        {page === 'about' && <About onNavigate={navigate} />}
        {page === 'faq' && <FAQ onNavigate={navigate} />}
        {page === 'privacy' && <Privacy onNavigate={navigate} />}
        {page === 'customer-dashboard' && (
          <CustomerDashboard
            onNavigate={navigate}
            onViewProperty={viewProperty}
          />
        )}
        {page === 'developer-dashboard' && (
          <DeveloperDashboard
            onNavigate={navigate}
            onViewProperty={viewProperty}
          />
        )}
        {page === 'owner-dashboard' && (
          <OwnerDashboard
            onNavigate={navigate}
            onViewProperty={viewProperty}
          />
        )}
        {page === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={navigate}
            onViewProperty={viewProperty}
          />
        )}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
