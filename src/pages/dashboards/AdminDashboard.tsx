import { useEffect, useState } from 'react';
import {
  Shield, Users, Home, Building2, CheckCircle, XCircle, Clock,
  TrendingUp, Eye, Star, AlertTriangle, BarChart2, MessageSquare,
  Calendar, Filter, ChevronDown
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile, Property, Developer, Page } from '../../types';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
  onViewProperty: (id: string) => void;
}

type Tab = 'overview' | 'listings' | 'developers' | 'users';

export default function AdminDashboard({ onNavigate, onViewProperty }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingFilter, setListingFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const [propsRes, devsRes, usersRes] = await Promise.all([
        supabase.from('properties').select('*, developer:developers(*), profile:profiles(*)').order('created_at', { ascending: false }).limit(100),
        supabase.from('developers').select('*, profile:profiles(*)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);
      setProperties((propsRes.data as Property[]) || []);
      setDevelopers((devsRes.data as Developer[]) || []);
      setUsers((usersRes.data as Profile[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function verifyProperty(id: string, verified: boolean) {
    await supabase.from('properties').update({ verified }).eq('id', id);
    setProperties(p => p.map(x => x.id === id ? { ...x, verified } : x));
  }

  async function setFeatured(id: string, featured: boolean) {
    await supabase.from('properties').update({ featured }).eq('id', id);
    setProperties(p => p.map(x => x.id === id ? { ...x, featured } : x));
  }

  async function updateDevStatus(id: string, status: 'approved' | 'rejected') {
    await supabase.from('developers').update({ status, verified: status === 'approved' }).eq('id', id);
    setDevelopers(d => d.map(x => x.id === id ? { ...x, status, verified: status === 'approved' } : x));
  }

  const stats = {
    totalListings: properties.length,
    verifiedListings: properties.filter(p => p.verified).length,
    pendingListings: properties.filter(p => !p.verified).length,
    featuredListings: properties.filter(p => p.featured).length,
    totalDevelopers: developers.length,
    approvedDevelopers: developers.filter(d => d.status === 'approved').length,
    pendingDevelopers: developers.filter(d => d.status === 'pending').length,
    totalUsers: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    owners: users.filter(u => u.role === 'owner').length,
    forSale: properties.filter(p => p.listing_type === 'sale').length,
    forRent: properties.filter(p => p.listing_type === 'rent').length,
    totalViews: properties.reduce((s, p) => s + (p.view_count || 0), 0),
  };

  const filteredProperties = properties.filter(p => {
    if (listingFilter === 'unverified') return !p.verified;
    if (listingFilter === 'featured') return p.featured;
    if (listingFilter === 'sale') return p.listing_type === 'sale';
    if (listingFilter === 'rent') return p.listing_type === 'rent';
    return true;
  });

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'listings', label: 'Listings', icon: Home },
    { id: 'developers', label: 'Developers', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/30 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">BariKoi Platform Management</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Listings', value: stats.totalListings, color: 'bg-teal-500/20 text-teal-300' },
              { label: 'Total Developers', value: stats.totalDevelopers, color: 'bg-blue-500/20 text-blue-300' },
              { label: 'Total Users', value: stats.totalUsers, color: 'bg-purple-500/20 text-purple-300' },
              { label: 'Total Views', value: stats.totalViews, color: 'bg-amber-500/20 text-amber-300' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
                <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === t.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Verified', value: stats.verifiedListings, color: 'text-teal-700 bg-teal-50', border: 'border-teal-200' },
                { label: 'Unverified', value: stats.pendingListings, color: 'text-amber-700 bg-amber-50', border: 'border-amber-200' },
                { label: 'For Sale', value: stats.forSale, color: 'text-blue-700 bg-blue-50', border: 'border-blue-200' },
                { label: 'For Rent', value: stats.forRent, color: 'text-purple-700 bg-purple-50', border: 'border-purple-200' },
                { label: 'Approved Devs', value: stats.approvedDevelopers, color: 'text-green-700 bg-green-50', border: 'border-green-200' },
                { label: 'Pending Devs', value: stats.pendingDevelopers, color: 'text-red-700 bg-red-50', border: 'border-red-200' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-4 border ${s.color} ${s.border}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pending Developers */}
            {developers.filter(d => d.status === 'pending').length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-gray-900">Pending Developer Approvals</h3>
                  <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                    {developers.filter(d => d.status === 'pending').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {developers.filter(d => d.status === 'pending').map(dev => (
                    <div key={dev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{dev.company_name}</p>
                        <p className="text-xs text-gray-500">{dev.phone} • {dev.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateDevStatus(dev.id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => updateDevStatus(dev.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Listings */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Listings Needing Verification</h3>
              <div className="space-y-3">
                {properties.filter(p => !p.verified).slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.area_name}, {p.city}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => onViewProperty(p.id)} className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => verifyProperty(p.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Verify
                      </button>
                    </div>
                  </div>
                ))}
                {properties.filter(p => !p.verified).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">All listings are verified!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Listings */}
        {tab === 'listings' && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative">
                <select
                  value={listingFilter}
                  onChange={e => setListingFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
                >
                  <option value="all">All Listings</option>
                  <option value="unverified">Unverified</option>
                  <option value="featured">Featured</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-sm text-gray-500">{filteredProperties.length} listings</span>
            </div>
            <div className="space-y-2">
              {filteredProperties.map(p => (
                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => onViewProperty(p.id)}>
                    <img src={p.photos?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{p.title}</p>
                      {p.verified && <span className="text-teal-500"><CheckCircle className="w-3.5 h-3.5" /></span>}
                      {p.featured && <span className="text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /></span>}
                    </div>
                    <p className="text-xs text-gray-500">{p.area_name}, {p.city} · ৳{p.price?.toLocaleString()} · {p.listing_type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.view_count} views</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => verifyProperty(p.id, !p.verified)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${p.verified ? 'bg-teal-50 text-teal-600 hover:bg-red-50 hover:text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-teal-50 hover:text-teal-600'}`}
                      title={p.verified ? 'Unverify' : 'Verify'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFeatured(p.id, !p.featured)}
                      className={`p-1.5 rounded-lg transition-colors ${p.featured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600'}`}
                      title={p.featured ? 'Unfeature' : 'Feature'}
                    >
                      <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredProperties.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-500">No listings found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Developers */}
        {tab === 'developers' && (
          <div className="space-y-3">
            {developers.map(dev => (
              <div key={dev.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{dev.company_name}</p>
                        {dev.verified && <CheckCircle className="w-4 h-4 text-teal-500" />}
                      </div>
                      <p className="text-xs text-gray-500">{dev.phone}</p>
                      <p className="text-xs text-gray-500">{dev.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      dev.status === 'approved' ? 'bg-teal-100 text-teal-700' :
                      dev.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {dev.status}
                    </span>
                    {dev.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateDevStatus(dev.id, 'approved')} className="px-2.5 py-1 bg-teal-600 text-white rounded-lg text-xs hover:bg-teal-700">
                          Approve
                        </button>
                        <button onClick={() => updateDevStatus(dev.id, 'rejected')} className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {developers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl">
                <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No developers registered yet</p>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Total Users', value: users.length, color: 'bg-gray-100' },
                { label: 'Customers', value: stats.customers, color: 'bg-teal-50' },
                { label: 'Owners', value: stats.owners, color: 'bg-blue-50' },
                { label: 'Developers', value: users.filter(u => u.role === 'developer').length, color: 'bg-amber-50' },
              ].map(s => (
                <div key={s.label} className={`${s.color} rounded-xl p-4`}>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {u.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{u.full_name || 'No Name'}</p>
                    <p className="text-xs text-gray-500">{u.phone || 'No phone'}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'developer' ? 'bg-amber-100 text-amber-700' :
                    u.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                  <p className="text-xs text-gray-400 shrink-0">{new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
