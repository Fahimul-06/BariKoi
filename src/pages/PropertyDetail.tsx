import { useEffect, useState } from 'react';
import {
  ArrowLeft, Heart, Share2, CheckCircle, MapPin, BedDouble, Bath, Maximize2,
  Building2, Phone, Mail, Calendar, Star, Shield, Eye, ChevronLeft, ChevronRight,
  Home, Layers, Wifi, Car, Zap, Droplets, Trees, ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property, Inquiry, Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PropertyDetailProps {
  propertyId: string;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

function formatPrice(price: number, listingType: string) {
  if (listingType === 'rent') return `৳${price.toLocaleString()}/month`;
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `৳${(price / 100000).toFixed(1)} Lac`;
  return `৳${price.toLocaleString()}`;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Wifi': <Wifi className="w-4 h-4" />,
  'Parking': <Car className="w-4 h-4" />,
  'Generator': <Zap className="w-4 h-4" />,
  'Water': <Droplets className="w-4 h-4" />,
  'Garden': <Trees className="w-4 h-4" />,
  'Security': <ShieldCheck className="w-4 h-4" />,
};

const DEMO_PROPERTY: Property = {
  id: 'demo',
  user_id: '',
  developer_id: null,
  title: '3 Bed Luxury Apartment in Gulshan 2',
  description: `This beautifully designed 3-bedroom apartment is located in the prestigious Gulshan 2 area, one of the most sought-after neighborhoods in Dhaka. The apartment features high-end finishes, spacious rooms, and breathtaking city views from the balcony.

The kitchen is equipped with modern appliances and custom cabinets. The master bedroom has an en-suite bathroom with premium fixtures. The living area is bright and airy with floor-to-ceiling windows.

Building facilities include a rooftop terrace, gymnasium, covered parking, 24-hour security with CCTV, and dedicated maintenance staff.`,
  type: 'apartment',
  listing_type: 'sale',
  status: 'available',
  price: 18500000,
  area_sqft: 1850,
  bedrooms: 3,
  bathrooms: 3,
  floor: 7,
  total_floors: 12,
  address: 'House 15, Road 27',
  city: 'Dhaka',
  area_name: 'Gulshan 2',
  latitude: 23.7957,
  longitude: 90.4141,
  photos: [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  amenities: ['Gym', 'Parking', 'Security', 'Generator', 'Wifi', 'Elevator'],
  nearby: ['School 300m', 'Hospital 500m', 'Market 200m', 'Mosque 150m', 'Park 400m'],
  verified: true,
  featured: true,
  view_count: 342,
  created_at: '2024-01-15',
  updated_at: '2024-01-15',
};

export default function PropertyDetail({ propertyId, onBack, onNavigate }: PropertyDetailProps) {
  const { user, profile } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: 'I am interested in this property. Please contact me.' });
  const [inquirySent, setInquirySent] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '10:00' });
  const [bookingDone, setBookingDone] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    async function load() {
      if (propertyId.startsWith('demo')) {
        setProperty(DEMO_PROPERTY);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('properties')
        .select('*, developer:developers(*)')
        .eq('id', propertyId)
        .maybeSingle();
      setProperty((data as Property) || DEMO_PROPERTY);
      setLoading(false);

      if (user) {
        const { data: fav } = await supabase
          .from('favorites')
          .select('id')
          .eq('property_id', propertyId)
          .eq('user_id', user.id)
          .maybeSingle();
        setFavorited(!!fav);
        await supabase.from('properties').update({ view_count: (data?.view_count || 0) + 1 }).eq('id', propertyId);
      }
    }
    load();
  }, [propertyId, user]);

  async function toggleFavorite() {
    if (!user) { onNavigate('auth'); return; }
    if (favorited) {
      await supabase.from('favorites').delete().eq('property_id', propertyId).eq('user_id', user.id);
    } else {
      await supabase.from('favorites').insert({ property_id: propertyId });
    }
    setFavorited(!favorited);
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { onNavigate('auth'); return; }
    await supabase.from('inquiries').insert({
      property_id: propertyId,
      message: inquiryForm.message,
      phone: inquiryForm.phone,
      name: inquiryForm.name || profile?.full_name || '',
    });
    setInquirySent(true);
    setShowContactForm(false);
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { onNavigate('auth'); return; }
    await supabase.from('bookings').insert({
      property_id: propertyId,
      visit_date: bookingForm.date,
      visit_time: bookingForm.time,
    });
    setBookingDone(true);
    setShowBookingForm(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-80 bg-gray-200 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const photos = property.photos?.length ? property.photos : [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-4 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>

        {/* Photo Gallery */}
        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-6 shadow-md group">
          <img
            src={photos[currentPhoto]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={() => setCurrentPhoto(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentPhoto(i => (i + 1) % photos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? 'bg-white w-4' : 'bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                favorited ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 hover:text-teal-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-white text-xs">
              {currentPhoto + 1} / {photos.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentPhoto(i)}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  i === currentPhoto ? 'border-teal-500' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Basic Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      property.listing_type === 'sale' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 capitalize">
                      {property.type}
                    </span>
                    {property.verified && (
                      <span className="flex items-center gap-1 text-xs text-teal-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                  <p className="flex items-center gap-1.5 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.area_name}, {property.city}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-teal-700">{formatPrice(property.price, property.listing_type)}</p>
                  {property.listing_type === 'sale' && property.area_sqft > 0 && (
                    <p className="text-sm text-gray-500">৳{Math.round(property.price / property.area_sqft).toLocaleString()}/sqft</p>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                {[
                  { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms || 'N/A' },
                  { icon: Bath, label: 'Bathrooms', value: property.bathrooms || 'N/A' },
                  { icon: Maximize2, label: 'Area', value: `${property.area_sqft.toLocaleString()} sqft` },
                  { icon: Layers, label: 'Floor', value: property.floor ? `${property.floor} / ${property.total_floors}` : 'N/A' },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                    <stat.icon className="w-5 h-5 text-teal-600 mb-1" />
                    <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                {property.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-xl text-sm text-teal-700">
                      {AMENITY_ICONS[a] || <Home className="w-4 h-4" />}
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Facilities */}
            {property.nearby?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Nearby Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.nearby.map(n => (
                    <div key={n} className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-teal-500 shrink-0" /> {n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Developer Info */}
            {property.developer && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Developer</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{property.developer.company_name}</p>
                      {property.developer.verified && (
                        <Shield className="w-4 h-4 text-teal-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{property.developer.total_projects} Projects</p>
                    <p className="text-sm text-gray-500">{property.developer.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <Eye className="w-3.5 h-3.5" /> {property.view_count} views
              </div>

              {inquirySent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-teal-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Inquiry Sent!</p>
                  <p className="text-sm text-gray-500 mt-1">The seller will contact you shortly.</p>
                </div>
              ) : bookingDone ? (
                <div className="text-center py-4">
                  <Calendar className="w-10 h-10 text-teal-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Visit Booked!</p>
                  <p className="text-sm text-gray-500 mt-1">You'll receive confirmation soon.</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { if (!user) { onNavigate('auth'); return; } setShowContactForm(!showContactForm); setShowBookingForm(false); }}
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Contact Seller
                  </button>
                  <button
                    onClick={() => { if (!user) { onNavigate('auth'); return; } setShowBookingForm(!showBookingForm); setShowContactForm(false); }}
                    className="w-full py-3 border-2 border-teal-600 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Book Site Visit
                  </button>

                  {showContactForm && (
                    <form onSubmit={submitInquiry} className="mt-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <textarea
                        rows={3}
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                      />
                      <button type="submit" className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
                        Send Inquiry
                      </button>
                    </form>
                  )}

                  {showBookingForm && (
                    <form onSubmit={submitBooking} className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Preferred Visit Date</label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={bookingForm.date}
                          onChange={e => setBookingForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Preferred Time</label>
                        <select
                          value={bookingForm.time}
                          onChange={e => setBookingForm(f => ({ ...f, time: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">
                        Confirm Booking
                      </button>
                    </form>
                  )}
                </>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-teal-500" />
                  Safe & Secure Transaction
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-teal-500" />
                  Verified Listing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-teal-500" />
                  24/7 Support Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
