import { useEffect, useState } from 'react';
import {
  ArrowRight, Building2, Users, CheckCircle, TrendingUp,
  ShieldCheck, Headphones, Star, ChevronRight, MapPin
} from 'lucide-react';
import SearchBar, { SearchFilters } from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';
import { Property, Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
  onSearch: (filters: SearchFilters) => void;
  onViewProperty: (id: string) => void;
}

const HERO_AREAS = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara', 'Mirpur'];

const STATS = [
  { label: 'Properties Listed', value: '12,400+', icon: Building2 },
  { label: 'Happy Customers', value: '8,200+', icon: Users },
  { label: 'Verified Listings', value: '6,800+', icon: CheckCircle },
  { label: 'Developers', value: '340+', icon: TrendingUp },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property is manually verified by our team for authenticity and accuracy.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: Building2,
    title: 'Trusted Developers',
    desc: 'Top construction companies with verified trade licenses and project history.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our dedicated support team is always ready to help you find your perfect home.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Star,
    title: 'Best Deals',
    desc: 'Exclusive deals and featured listings to give you the best value for money.',
    color: 'bg-purple-50 text-purple-600',
  },
];

const POPULAR_AREAS = [
  { name: 'Gulshan', city: 'Dhaka', count: 284, img: 'https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Banani', city: 'Dhaka', count: 196, img: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Dhanmondi', city: 'Dhaka', count: 231, img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Uttara', city: 'Dhaka', count: 178, img: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Chittagong', city: 'Chittagong', count: 312, img: 'https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Sylhet', city: 'Sylhet', count: 143, img: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export default function Home({ onNavigate, onSearch, onViewProperty }: HomeProps) {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recent, setRecent] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    async function load() {
      const [featuredRes, recentRes] = await Promise.all([
        supabase.from('properties').select('*, developer:developers(*)').eq('featured', true).eq('status', 'available').limit(4),
        supabase.from('properties').select('*, developer:developers(*)').eq('status', 'available').order('created_at', { ascending: false }).limit(6),
      ]);
      setFeatured((featuredRes.data as Property[]) || []);
      setRecent((recentRes.data as Property[]) || []);
      setLoadingFeatured(false);
    }
    load();
  }, []);

  const DEMO_PROPERTIES: Property[] = [
    {
      id: 'demo-1',
      user_id: '',
      developer_id: null,
      title: '3 Bed Luxury Apartment in Gulshan',
      description: '',
      type: 'apartment',
      listing_type: 'sale',
      status: 'available',
      price: 18500000,
      area_sqft: 1850,
      bedrooms: 3,
      bathrooms: 3,
      floor: 7,
      total_floors: 12,
      address: 'Road 27',
      city: 'Dhaka',
      area_name: 'Gulshan 2',
      latitude: null,
      longitude: null,
      photos: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'],
      amenities: [],
      nearby: [],
      verified: true,
      featured: true,
      view_count: 142,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'demo-2',
      user_id: '',
      developer_id: null,
      title: '2 Bed Apartment for Rent in Banani',
      description: '',
      type: 'apartment',
      listing_type: 'rent',
      status: 'available',
      price: 45000,
      area_sqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
      floor: 4,
      total_floors: 8,
      address: 'Road 11',
      city: 'Dhaka',
      area_name: 'Banani',
      latitude: null,
      longitude: null,
      photos: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600'],
      amenities: [],
      nearby: [],
      verified: true,
      featured: false,
      view_count: 87,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'demo-3',
      user_id: '',
      developer_id: null,
      title: '4 Bed Duplex in Bashundhara R/A',
      description: '',
      type: 'house',
      listing_type: 'sale',
      status: 'available',
      price: 32000000,
      area_sqft: 3200,
      bedrooms: 4,
      bathrooms: 4,
      floor: 1,
      total_floors: 2,
      address: 'Block D',
      city: 'Dhaka',
      area_name: 'Bashundhara R/A',
      latitude: null,
      longitude: null,
      photos: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600'],
      amenities: [],
      nearby: [],
      verified: false,
      featured: false,
      view_count: 63,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'demo-4',
      user_id: '',
      developer_id: null,
      title: 'Commercial Office Space in Motijheel',
      description: '',
      type: 'commercial',
      listing_type: 'rent',
      status: 'available',
      price: 120000,
      area_sqft: 2400,
      bedrooms: 0,
      bathrooms: 2,
      floor: 9,
      total_floors: 15,
      address: 'Dilkusha C/A',
      city: 'Dhaka',
      area_name: 'Motijheel',
      latitude: null,
      longitude: null,
      photos: ['https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600'],
      amenities: [],
      nearby: [],
      verified: true,
      featured: false,
      view_count: 31,
      created_at: '',
      updated_at: '',
    },
  ];

  const displayProperties = recent.length > 0 ? recent : DEMO_PROPERTIES;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Bangladesh's #1 Property Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Find Your Perfect
              <span className="text-teal-400 block">Home in BD</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Browse thousands of verified apartments, houses, and commercial spaces for sale and rent across Bangladesh.
            </p>

            {/* Popular Areas */}
            <div className="flex flex-wrap gap-2 mb-8">
              {HERO_AREAS.map(area => (
                <button
                  key={area}
                  onClick={() => onSearch({ keyword: area, city: 'Dhaka', listingType: 'all', type: '', minPrice: '', maxPrice: '', bedrooms: '' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-teal-500/20 border border-white/20 rounded-full text-sm text-white/80 hover:text-white transition-all"
                >
                  <MapPin className="w-3 h-3" /> {area}
                </button>
              ))}
            </div>

            <SearchBar onSearch={onSearch} variant="hero" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Recent Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {featured.length > 0 ? 'Featured Properties' : 'Latest Properties'}
              </h2>
              <p className="text-gray-500 mt-1">Handpicked properties across Bangladesh</p>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700 transition-colors text-sm"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayProperties.map(p => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onView={onViewProperty}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Locations</h2>
              <p className="text-gray-500 mt-1">Explore properties in top areas</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_AREAS.map(area => (
              <button
                key={area.name}
                onClick={() => onSearch({ keyword: area.name, city: area.city, listingType: 'all', type: '', minPrice: '', maxPrice: '', bedrooms: '' })}
                className="group relative rounded-2xl overflow-hidden aspect-square hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={area.img}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-left">
                  <p className="text-white font-bold text-sm">{area.name}</p>
                  <p className="text-gray-300 text-xs">{area.count} Properties</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Why Choose BariKoi?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We make finding and listing properties simple, transparent, and trustworthy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to List Your Property?
              </h2>
              <p className="text-teal-100 mb-8 max-w-lg mx-auto text-lg">
                Reach thousands of verified buyers and tenants. List your property free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-3.5 bg-white text-teal-700 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg"
                >
                  Post Property Free
                </button>
                <button
                  onClick={() => onNavigate('search')}
                  className="px-8 py-3.5 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-900 transition-colors border border-teal-500 flex items-center gap-2 justify-center"
                >
                  Browse Properties <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
