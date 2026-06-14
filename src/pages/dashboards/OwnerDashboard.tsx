import { useEffect, useState } from 'react';
import { Home, Plus, MessageSquare, Calendar, Eye, Trash2, X, Clock, Edit3, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Property, Inquiry, Booking, Page } from '../../types';
import PropertyForm, { PropertyFormData, blankForm, propertyToForm } from '../../components/PropertyForm';

interface OwnerDashboardProps {
  onNavigate: (page: Page) => void;
  onViewProperty: (id: string) => void;
}

type Tab = 'properties' | 'inquiries' | 'bookings';

export default function OwnerDashboard({ onNavigate, onViewProperty }: OwnerDashboardProps) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit'; property?: Property }>({ open: false, mode: 'add' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data: props } = await supabase.from('properties').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      const p = (props as Property[]) || [];
      setProperties(p);
      if (p.length > 0) {
        const ids = p.map(x => x.id);
        const [inqRes, bookRes] = await Promise.all([
          supabase.from('inquiries').select('*, property:properties(*), profile:profiles(*)').in('property_id', ids).order('created_at', { ascending: false }),
          supabase.from('bookings').select('*, property:properties(*), profile:profiles(*)').in('property_id', ids).order('created_at', { ascending: false }),
        ]);
        setInquiries((inqRes.data as Inquiry[]) || []);
        setBookings((bookRes.data as Booking[]) || []);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  async function handleFormSubmit(data: PropertyFormData) {
    if (!user) return;
    setSubmitting(true);
    const payload = {
      title: data.title,
      listing_type: data.listing_type,
      type: data.type,
      status: data.status,
      price: Number(data.price) || 0,
      area_sqft: Number(data.area_sqft) || 0,
      bedrooms: Number(data.bedrooms) || 0,
      bathrooms: Number(data.bathrooms) || 0,
      floor: Number(data.floor) || 0,
      total_floors: Number(data.total_floors) || 0,
      address: data.address,
      city: data.city,
      area_name: data.area_name,
      description: data.description,
      amenities: data.amenities,
      nearby: data.nearby,
      photos: data.photos,
    };

    if (modal.mode === 'add') {
      const { data: inserted } = await supabase.from('properties').insert(payload).select().single();
      if (inserted) setProperties(p => [inserted as Property, ...p]);
    } else if (modal.property) {
      const { data: updated } = await supabase.from('properties').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', modal.property.id).select().single();
      if (updated) setProperties(p => p.map(x => x.id === modal.property!.id ? updated as Property : x));
    }
    setSubmitting(false);
    setModal({ open: false, mode: 'add' });
  }

  async function deleteProperty(id: string) {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    await supabase.from('properties').delete().eq('id', id);
    setProperties(p => p.filter(x => x.id !== id));
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('properties').update({ status }).eq('id', id);
    setProperties(p => p.map(x => x.id === id ? { ...x, status: status as Property['status'] } : x));
  }

  async function confirmBooking(id: string) {
    await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id);
    setBookings(b => b.map(x => x.id === id ? { ...x, status: 'confirmed' } : x));
  }

  const TABS = [
    { id: 'properties', label: `My Properties (${properties.length})`, icon: Home },
    { id: 'inquiries', label: `Inquiries (${inquiries.filter(i => i.status === 'new').length})`, icon: MessageSquare },
    { id: 'bookings', label: `Visits (${bookings.filter(b => b.status === 'pending').length})`, icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile?.full_name || 'Property Owner'}</h1>
                <p className="text-blue-200 text-sm">Property Owner Account</p>
              </div>
            </div>
            <button
              onClick={() => setModal({ open: true, mode: 'add' })}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> List Property
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{properties.length}</p>
              <p className="text-xs text-blue-200">Total Listed</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{inquiries.length}</p>
              <p className="text-xs text-blue-200">Inquiries</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{properties.filter(p => p.status === 'sold' || p.status === 'rented').length}</p>
              <p className="text-xs text-blue-200">Closed Deals</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Properties ── */}
        {tab === 'properties' && (
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)
            ) : properties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Home className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No properties listed yet</p>
                <button onClick={() => setModal({ open: true, mode: 'add' })} className="mt-3 text-sm text-blue-600 hover:underline">List your first property</button>
              </div>
            ) : properties.map(p => (
              <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                <div
                  className="w-24 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => onViewProperty(p.id)}
                >
                  <img
                    src={p.photos?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.area_name}{p.area_name ? ', ' : ''}{p.city}</p>
                      <p className="text-sm font-bold text-blue-700 mt-1">৳{p.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={p.status}
                        onChange={e => updateStatus(p.id, e.target.value)}
                        className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none bg-white"
                      >
                        {['available', 'booked', 'sold', 'rented'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button
                        onClick={() => setModal({ open: true, mode: 'edit', property: p })}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.view_count} views</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-medium ${p.listing_type === 'sale' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.listing_type}
                    </span>
                    {p.photos?.length > 0 && <span>{p.photos.length} photo{p.photos.length !== 1 ? 's' : ''}</span>}
                    {!p.verified && <span className="text-amber-600 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> Pending</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Inquiries ── */}
        {tab === 'inquiries' && (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No inquiries received yet</p>
              </div>
            ) : inquiries.map(inq => (
              <div key={inq.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-gray-900">{inq.name || inq.profile?.full_name || 'Anonymous'}</p>
                      {inq.phone && <span className="text-xs text-gray-500">{inq.phone}</span>}
                    </div>
                    <p className="text-xs text-blue-600 mb-1 truncate">{inq.property?.title}</p>
                    <p className="text-sm text-gray-600">{inq.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(inq.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                    inq.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{inq.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No visit requests yet</p>
              </div>
            ) : bookings.map(b => (
              <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{b.profile?.full_name || 'Customer'}</p>
                    <p className="text-xs text-blue-600 mt-0.5 truncate">{b.property?.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {b.visit_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {b.visit_time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      b.status === 'confirmed' ? 'bg-teal-100 text-teal-700' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                    }`}>{b.status}</span>
                    {b.status === 'pending' && (
                      <button onClick={() => confirmBooking(b.id)} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Confirm
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                {modal.mode === 'add' ? 'List New Property' : 'Edit Property'}
              </h2>
              <button onClick={() => setModal({ open: false, mode: 'add' })} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 flex-1 overflow-hidden flex flex-col">
              <PropertyForm
                initial={modal.property ? propertyToForm(modal.property) : blankForm()}
                onSubmit={handleFormSubmit}
                onCancel={() => setModal({ open: false, mode: 'add' })}
                submitLabel={modal.mode === 'add' ? 'List Property' : 'Save Changes'}
                isSubmitting={submitting}
                accentColor="blue"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
