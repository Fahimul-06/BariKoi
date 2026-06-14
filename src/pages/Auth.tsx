import { useState } from 'react';
import { Building2, Eye, EyeOff, ArrowLeft, User, Building, Home, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Page, UserRole } from '../types';

interface AuthProps {
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

type Mode = 'login' | 'signup';

const ROLES: { value: UserRole; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { value: 'customer', label: 'Buyer / Tenant', desc: 'Looking to buy or rent a property', icon: <User className="w-5 h-5" />, color: 'border-teal-500 bg-teal-50 text-teal-700' },
  { value: 'owner', label: 'Property Owner', desc: 'List your own property for sale or rent', icon: <Home className="w-5 h-5" />, color: 'border-blue-500 bg-blue-50 text-blue-700' },
  { value: 'developer', label: 'Developer', desc: 'Register your construction company', icon: <Building className="w-5 h-5" />, color: 'border-amber-500 bg-amber-50 text-amber-700' },
];

export default function Auth({ onNavigate, onBack }: AuthProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Invalid email or password. Please try again.');
      } else {
        onNavigate('home');
      }
    } else {
      if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName, role);
      if (error) {
        if (error.message?.includes('already registered')) {
          setError('This email is already registered. Please sign in.');
        } else {
          setError(error.message || 'Sign up failed. Please try again.');
        }
      } else {
        setSuccess('Account created! Please sign in to continue.');
        setMode('login');
        setPassword('');
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Bari<span className="text-teal-400">Koi</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm">Bangladesh's trusted property marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                mode === 'login' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                mode === 'signup' ? 'text-teal-700 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                    <div className="space-y-2">
                      {ROLES.map(r => (
                        <label key={r.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="role"
                            value={r.value}
                            checked={role === r.value}
                            onChange={() => setRole(r.value)}
                            className="sr-only"
                          />
                          <div className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl transition-all ${
                            role === r.value ? r.color : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={role === r.value ? '' : 'text-gray-400'}>{r.icon}</div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{r.label}</p>
                              <p className="text-xs text-gray-500">{r.desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {mode === 'login' && (
              <p className="text-center text-xs text-gray-500 mt-4">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-teal-600 font-medium hover:underline">
                  Sign up free
                </button>
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                Your data is safe and secure with us
              </div>
            </div>
          </div>
        </div>

        {/* Admin hint */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Admin access? Use admin@barikoi.com
        </p>
      </div>
    </div>
  );
}
