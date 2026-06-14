import { useState } from 'react';
import { Building2, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'About Us', page: 'about' },
  { label: 'FAQ', page: 'faq' },
  { label: 'Privacy Policy', page: 'privacy' },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function getDashboardPage(): Page {
    switch (profile?.role) {
      case 'developer': return 'developer-dashboard';
      case 'owner': return 'owner-dashboard';
      case 'admin': return 'admin-dashboard';
      default: return 'customer-dashboard';
    }
  }

  async function handleSignOut() {
    await signOut();
    onNavigate('home');
    setUserMenuOpen(false);
  }

  const isScrolled = currentPage !== 'home';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || mobileOpen ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${
              isScrolled || mobileOpen ? 'text-gray-900' : 'text-white'
            }`}>
              Bari<span className="text-teal-400">Koi</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === link.page
                    ? isScrolled ? 'text-teal-600 bg-teal-50' : 'text-teal-300 bg-white/10'
                    : isScrolled ? 'text-gray-600 hover:text-teal-600 hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-teal-50"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                    {profile.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                    {profile.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${isScrolled ? 'text-gray-500' : 'text-white/70'}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate(getDashboardPage()); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <button
                      onClick={() => { onNavigate('customer-dashboard'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('auth')}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Post Property
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${isScrolled || mobileOpen ? 'text-gray-700' : 'text-white'}`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === link.page
                    ? 'text-teal-700 bg-teal-50 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <hr className="border-gray-100 my-2" />
            {user && profile ? (
              <>
                <button
                  onClick={() => { onNavigate(getDashboardPage()); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { onNavigate('auth'); setMobileOpen(false); }}
                className="w-full px-3 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
