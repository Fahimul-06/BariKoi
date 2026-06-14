import { useEffect, useState } from 'react';
import { Heart, Calendar, MessageSquare, User, Search, Star, Clock, CheckCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Favorite, Booking, Inquiry, Page } from '../../types';

interface CustomerDashboardProps {
  onNavigate: (page: Page) => void;
  onViewProperty: (id: string) => void;
}

type Tab = 'favorites' | 'bookings' | 'inquiries' | 'profile';

export default function CustomerDashboard({ onNavigate, onViewProperty }: CustomerDashboardProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [favRes, bookRes, inqRes] = await Promise.all([
        supabase.from('favorites').select('*, property:properties(*)').eq('user_id', user!.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, property:properties(*)').eq('user_id', user!.id).order('created_at', { ascending: false }),
        supabase.from('inquiries').select('*, property:properties(*)').eq('user_id', user!.id).order('created_at', { ascending: false }),
      ]);
      setFavorites((favRes.data as Favorite[]) || []);
      setBookings((bookRes.data as Booking[]) || []);
      setInquiries((inqRes.data as Inquiry[]) || []);
      setLoading(false);
    }
    load();
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: editProfile.full_name, phone: editProfile.phone }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function removeFavorite(id: string) {
    await supabase.from('favorites').delete().eq('id', id);
    setFavorites(f => f.filter(x => x.id !== id));
  }

  async function cancelBooking(id: string) {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    setBookings(b => b.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
  }

  const TABS = [
    { id: 'favorites', label: 'Saved', icon: Heart, count: favorites.length },
    { id: 'bookings', label: 'Visits', icon: Calendar, count: bookings.length },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: inquiries.length },
    { id: 'profile', label: 'Profile', icon: User, count: 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{profile?.full_name || 'Welcome!'}</h1>
              <p className="text-teal-200 text-sm capitalize">{profile?.role} Account</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-xs text-teal-200">Saved</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{bookings.filter(b => b.status !== 'cancelled').length}</p>
              <p className="text-xs text-teal-200">Visits</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{inquiries.length}</p>
              <p className="text-xs text-teal-200">Inquiries</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === t.id ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  tab === t.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {tab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No saved properties yet</p>
                    <button onClick={() => onNavigate('search')} className="mt-3 text-teal-600 text-sm hover:underline flex items-center gap-1 mx-auto">
                      <Search className="w-3.5 h-3.5" /> Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map(fav => (
                      <div key={fav.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
                        <div
                          className="w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => fav.property && onViewProperty(fav.property.id)}
                        >
                          <img
                            src={fav.property?.photos?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{fav.property?.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{fav.property?.area_name}, {fav.property?.city}</p>
                          <p className="text-sm font-bold text-teal-700 mt-1">
                            ৳{fav.property?.price?.toLocaleString()}
                          </p>
                        </div>
                        <button onClick={() => removeFavorite(fav.id)} className="text-gray-300 hover:text-red-500 transition-colors self-start">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'bookings' && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No visit bookings yet</p>
                  </div>
                ) : bookings.map(b => (
                  <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{b.property?.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.property?.address}, {b.property?.city}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-500" /> {b.visit_date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-500" /> {b.visit_time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          b.status === 'confirmed' ? 'bg-teal-100 text-teal-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                        {b.status === 'pending' && (
                          <button onClick={() => cancelBooking(b.id)} className="text-xs text-red-500 hover:underline">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'inquiries' && (
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl">
                    <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No inquiries sent yet</p>
                  </div>
                ) : inquiries.map(inq => (
                  <div key={inq.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{inq.property?.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{inq.property?.area_name}, {inq.property?.city}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{inq.message}</p>
                      </div>
                      <span className={`shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                        inq.status === 'replied' ? 'bg-teal-100 text-teal-700' :
                        inq.status === 'closed' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{new Date(inq.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Edit Profile</h2>
                <form onSubmit={saveProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={editProfile.full_name}
                      onChange={e => setEditProfile(f => ({ ...f, full_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={editProfile.phone}
                      onChange={e => setEditProfile(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+880..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-60"
                  >
                    {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
