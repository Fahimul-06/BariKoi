import { useEffect, useState, useRef } from 'react';
import { SlidersHorizontal, X, Grid3X3, List, ChevronDown, MapPin, Database } from 'lucide-react';
import SearchBar, { SearchFilters } from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';
import { Property, Page } from '../types';

interface SearchPageProps {
  initialFilters?: Partial<SearchFilters>;
  onNavigate: (page: Page) => void;
  onViewProperty: (id: string) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'area_asc', label: 'Area: Small to Large' },
];

// ── Demo fallback data (shown only when DB has no properties at all) ──────────
const ALL_DEMO: Property[] = [
  { id: 'd1',  user_id: '', developer_id: null, title: '3 Bed Apartment in Gulshan 2',      description: 'Spacious apartment with modern amenities in prime Gulshan location.',     type: 'apartment',  listing_type: 'sale', status: 'available', price: 18500000, area_sqft: 1850, bedrooms: 3, bathrooms: 3, floor: 7,  total_floors: 12, address: 'Road 27',       city: 'Dhaka',      area_name: 'Gulshan 2',      latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: ['Gym','Parking','Security'], nearby: ['School','Hospital'], verified: true,  featured: true,  view_count: 142, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: 'd2',  user_id: '', developer_id: null, title: '2 Bed Apartment for Rent in Banani', description: 'Well-maintained apartment in the heart of Banani.',                         type: 'apartment',  listing_type: 'rent', status: 'available', price: 45000,    area_sqft: 1200, bedrooms: 2, bathrooms: 2, floor: 4,  total_floors: 8,  address: 'Road 11',       city: 'Dhaka',      area_name: 'Banani',         latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: ['Parking','Generator'],     nearby: ['Market','School'],  verified: true,  featured: false, view_count: 87,  created_at: '2024-01-02', updated_at: '2024-01-02' },
  { id: 'd3',  user_id: '', developer_id: null, title: '4 Bed Duplex in Bashundhara R/A',   description: 'Luxurious duplex with private garden in Bashundhara.',                     type: 'house',      listing_type: 'sale', status: 'available', price: 32000000, area_sqft: 3200, bedrooms: 4, bathrooms: 4, floor: 1,  total_floors: 2,  address: 'Block D',       city: 'Dhaka',      area_name: 'Bashundhara R/A',latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: false, featured: false, view_count: 63,  created_at: '2024-01-03', updated_at: '2024-01-03' },
  { id: 'd4',  user_id: '', developer_id: null, title: 'Commercial Office Space in Motijheel',description: 'Prime commercial office space in Dilkusha commercial area.',             type: 'commercial', listing_type: 'rent', status: 'available', price: 120000,   area_sqft: 2400, bedrooms: 0, bathrooms: 2, floor: 9,  total_floors: 15, address: 'Dilkusha C/A',  city: 'Dhaka',      area_name: 'Motijheel',      latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: true,  featured: false, view_count: 31,  created_at: '2024-01-04', updated_at: '2024-01-04' },
  { id: 'd5',  user_id: '', developer_id: null, title: '1 Bed Studio Apartment in Dhanmondi',description: 'Cozy studio apartment ideal for singles or couples in Dhanmondi.',        type: 'apartment',  listing_type: 'rent', status: 'available', price: 22000,    area_sqft: 650,  bedrooms: 1, bathrooms: 1, floor: 3,  total_floors: 6,  address: 'Road 8A',       city: 'Dhaka',      area_name: 'Dhanmondi',      latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600'],   amenities: [],                          nearby: [],                   verified: false, featured: false, view_count: 55,  created_at: '2024-01-05', updated_at: '2024-01-05' },
  { id: 'd6',  user_id: '', developer_id: null, title: '5 Bed Villa in DOHS Mirpur',         description: 'Exclusive villa with garden in DOHS Mirpur.',                              type: 'house',      listing_type: 'sale', status: 'available', price: 55000000, area_sqft: 4800, bedrooms: 5, bathrooms: 5, floor: 1,  total_floors: 3,  address: 'DOHS',          city: 'Dhaka',      area_name: 'Mirpur DOHS',    latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: true,  featured: true,  view_count: 210, created_at: '2024-01-06', updated_at: '2024-01-06' },
  { id: 'd7',  user_id: '', developer_id: null, title: '3 Bed Apartment for Sale in Chittagong GEC', description: 'Modern apartment near GEC Circle in Chittagong.',                  type: 'apartment',  listing_type: 'sale', status: 'available', price: 8500000,  area_sqft: 1450, bedrooms: 3, bathrooms: 2, floor: 5,  total_floors: 10, address: 'GEC Circle',    city: 'Chittagong', area_name: 'GEC',            latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: true,  featured: false, view_count: 75,  created_at: '2024-01-07', updated_at: '2024-01-07' },
  { id: 'd8',  user_id: '', developer_id: null, title: 'Land Plot for Sale in Purbachal',    description: 'Ready-to-build residential plot in Purbachal New Town.',                   type: 'land',       listing_type: 'sale', status: 'available', price: 7200000,  area_sqft: 2400, bedrooms: 0, bathrooms: 0, floor: 0,  total_floors: 0,  address: 'Sector 9',      city: 'Dhaka',      area_name: 'Purbachal',      latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: false, featured: false, view_count: 44,  created_at: '2024-01-08', updated_at: '2024-01-08' },
  { id: 'd9',  user_id: '', developer_id: null, title: '2 Bed Flat for Rent in Uttara',      description: 'Modern flat in Uttara Sector 7 with easy access to airport.',              type: 'apartment',  listing_type: 'rent', status: 'available', price: 28000,    area_sqft: 950,  bedrooms: 2, bathrooms: 2, floor: 5,  total_floors: 8,  address: 'Sector 7',      city: 'Dhaka',      area_name: 'Uttara',         latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: ['Parking'],                 nearby: ['School'],           verified: true,  featured: false, view_count: 38,  created_at: '2024-01-09', updated_at: '2024-01-09' },
  { id: 'd10', user_id: '', developer_id: null, title: '4 Bed Apartment for Sale in Sylhet', description: 'Spacious apartment near Sylhet city centre.',                              type: 'apartment',  listing_type: 'sale', status: 'available', price: 9800000,  area_sqft: 1750, bedrooms: 4, bathrooms: 3, floor: 3,  total_floors: 6,  address: 'Zindabazar',    city: 'Sylhet',     area_name: 'Zindabazar',     latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: [],                   verified: false, featured: false, view_count: 22,  created_at: '2024-01-10', updated_at: '2024-01-10' },
  { id: 'd11', user_id: '', developer_id: null, title: '3 Bed House for Sale in Rajshahi',   description: 'Single-family house with garden in Rajshahi.',                              type: 'house',      listing_type: 'sale', status: 'available', price: 6500000,  area_sqft: 2100, bedrooms: 3, bathrooms: 2, floor: 1,  total_floors: 2,  address: 'Uposhohor',     city: 'Rajshahi',   area_name: 'Uposhohor',      latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: ['Garden'],                  nearby: ['School','Market'],  verified: false, featured: false, view_count: 18,  created_at: '2024-01-11', updated_at: '2024-01-11' },
  { id: 'd12', user_id: '', developer_id: null, title: 'Shop Space for Rent in Khulna',      description: 'Ground-floor commercial shop space in busy Khulna market area.',           type: 'commercial', listing_type: 'rent', status: 'available', price: 35000,    area_sqft: 800,  bedrooms: 0, bathrooms: 1, floor: 0,  total_floors: 4,  address: 'KDA Avenue',    city: 'Khulna',     area_name: 'KDA',            latitude: null, longitude: null, photos: ['https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=600'], amenities: [],                          nearby: ['Market'],           verified: false, featured: false, view_count: 14,  created_at: '2024-01-12', updated_at: '2024-01-12' },
];

// ── Local filter applied to demo data ─────────────────────────────────────────
function applyFilters(list: Property[], f: SearchFilters): Property[] {
  const kw = f.keyword?.trim().toLowerCase() || '';

  return list.filter(p => {
    // Keyword: match title, area_name, city, address, description, type
    if (kw) {
      const searchable = [
        p.title,
        p.area_name,
        p.city,
        p.address,
        p.description,
        p.type,
      ].map(s => (s || '').toLowerCase()).join(' ');

      // All words in the keyword must appear somewhere in the searchable text
      const words = kw.split(/\s+/).filter(Boolean);
      const matches = words.every(word => searchable.includes(word));
      if (!matches) return false;
    }

    if (f.city && !p.city.toLowerCase().includes(f.city.toLowerCase())) return false;
    if (f.listingType && f.listingType !== 'all' && p.listing_type !== f.listingType) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.minPrice && p.price < Number(f.minPrice)) return false;
    if (f.maxPrice && p.price > Number(f.maxPrice)) return false;
    if (f.bedrooms && p.bedrooms < Number(f.bedrooms)) return false;
    return true;
  });
}

function applySort(list: Property[], sort: string): Property[] {
  return [...list].sort((a, b) => {
    if (sort === 'price_asc')  return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'area_asc')   return a.area_sqft - b.area_sqft;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function hasAnyFilter(f: SearchFilters) {
  return !!(f.keyword || f.city || (f.listingType && f.listingType !== 'all') || f.type || f.minPrice || f.maxPrice || f.bedrooms);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Search({ initialFilters, onNavigate, onViewProperty }: SearchPageProps) {
  const [dbProperties, setDbProperties] = useState<Property[]>([]);
  const [dbIsEmpty, setDbIsEmpty] = useState<boolean | null>(null); // null = not yet checked
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword:     initialFilters?.keyword     || '',
    city:        initialFilters?.city        || '',
    listingType: initialFilters?.listingType || 'all',
    type:        initialFilters?.type        || '',
    minPrice:    initialFilters?.minPrice    || '',
    maxPrice:    initialFilters?.maxPrice    || '',
    bedrooms:    initialFilters?.bedrooms    || '',
  });
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Use a ref so fetchProperties always reads the latest sort without needing
  // to be recreated (avoids the stale-closure / double-fetch problem).
  const sortRef = useRef(sort);
  sortRef.current = sort;

  async function fetchProperties(f: SearchFilters) {
    setLoading(true);

    const currentSort = sortRef.current;

    // ── Build Supabase query ────────────────────────────────────────────────
    let query = supabase
      .from('properties')
      .select('*, developer:developers(*)')
      .eq('status', 'available');

    // Keyword: search across title, area_name, city, address using OR
    // Split into words so "Gulshan 2" matches "area_name=Gulshan 2" exactly
    if (f.keyword?.trim()) {
      const kw = f.keyword.trim();
      // Build OR clause covering all relevant text columns
      const orParts = [
        `title.ilike.%${kw}%`,
        `area_name.ilike.%${kw}%`,
        `city.ilike.%${kw}%`,
        `address.ilike.%${kw}%`,
        `description.ilike.%${kw}%`,
      ].join(',');
      query = query.or(orParts);
    }

    if (f.city && f.city.toLowerCase() !== 'all cities') {
      query = query.ilike('city', `%${f.city.trim()}%`);
    }
    if (f.listingType && f.listingType !== 'all') {
      query = query.eq('listing_type', f.listingType);
    }
    if (f.type) {
      query = query.eq('type', f.type);
    }
    if (f.minPrice) {
      query = query.gte('price', Number(f.minPrice));
    }
    if (f.maxPrice) {
      query = query.lte('price', Number(f.maxPrice));
    }
    if (f.bedrooms) {
      query = query.gte('bedrooms', Number(f.bedrooms));
    }

    // Sort
    if (currentSort === 'price_asc')  query = query.order('price',      { ascending: true  });
    else if (currentSort === 'price_desc') query = query.order('price', { ascending: false });
    else if (currentSort === 'area_asc')   query = query.order('area_sqft', { ascending: true });
    else                                   query = query.order('created_at', { ascending: false });

    const { data, error } = await query.limit(100);
    const results = error ? [] : (data as Property[]) || [];
    setDbProperties(results);

    // On first load also check whether the DB has ANY properties at all,
    // so we know whether to fall back to demo data.
    if (dbIsEmpty === null) {
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true });
      setDbIsEmpty((count ?? 0) === 0);
    }

    setLoading(false);
  }

  // Initial fetch
  useEffect(() => {
    fetchProperties(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(newFilters: SearchFilters) {
    setFilters(newFilters);
    fetchProperties(newFilters);
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    sortRef.current = newSort;
    fetchProperties(filters);
  }

  // ── Decide what to display ──────────────────────────────────────────────────
  // Use demo data only when we know the DB is completely empty.
  // If DB has data, show real results (even if 0 for current filters).
  const useDemo = dbIsEmpty === true;
  const displayProperties = useDemo
    ? applySort(applyFilters(ALL_DEMO, filters), sort)
    : dbProperties;

  const filtersActive = hasAnyFilter(filters);

  function clearAll() {
    const blank: SearchFilters = { keyword: '', city: '', listingType: 'all', type: '', minPrice: '', maxPrice: '', bedrooms: '' };
    setFilters(blank);
    fetchProperties(blank);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Sticky Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <SearchBar onSearch={handleSearch} initialValues={filters} variant="inline" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {loading
                ? 'Searching...'
                : `${displayProperties.length} Propert${displayProperties.length !== 1 ? 'ies' : 'y'} Found`}
            </h1>
            {filters.keyword && !loading && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                Results for "{filters.keyword}"
                {filters.city ? ` in ${filters.city}` : ''}
              </p>
            )}
            {useDemo && !loading && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                <Database className="w-3 h-3" /> Showing sample listings
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => handleSortChange(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {filtersActive && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.keyword && (
              <Chip label={`"${filters.keyword}"`} onRemove={() => handleSearch({ ...filters, keyword: '' })} />
            )}
            {filters.city && (
              <Chip label={filters.city} onRemove={() => handleSearch({ ...filters, city: '' })} />
            )}
            {filters.listingType && filters.listingType !== 'all' && (
              <Chip label={`For ${filters.listingType === 'sale' ? 'Sale' : 'Rent'}`} onRemove={() => handleSearch({ ...filters, listingType: 'all' })} />
            )}
            {filters.type && (
              <Chip label={filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} onRemove={() => handleSearch({ ...filters, type: '' })} />
            )}
            {filters.bedrooms && (
              <Chip label={`${filters.bedrooms}+ Beds`} onRemove={() => handleSearch({ ...filters, bedrooms: '' })} />
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Chip
                label={`৳${filters.minPrice ? Number(filters.minPrice).toLocaleString() : '0'} – ${filters.maxPrice ? '৳' + Number(filters.maxPrice).toLocaleString() : '∞'}`}
                onRemove={() => handleSearch({ ...filters, minPrice: '', maxPrice: '' })}
              />
            )}
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 underline transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProperties.length === 0 ? (
          <EmptyState filtersActive={filtersActive} onClear={clearAll} onNavigate={onNavigate} />
        ) : (
          <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {displayProperties.map(p => (
              <PropertyCard key={p.id} property={p} onView={onViewProperty} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-200">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function EmptyState({ filtersActive, onClear, onNavigate }: { filtersActive: boolean; onClear: () => void; onNavigate: (p: Page) => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <SlidersHorizontal className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
      {filtersActive ? (
        <>
          <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
            No properties match your current search. Try removing some filters or broadening your search area.
          </p>
          <button
            onClick={onClear}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Clear All Filters
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
            No listings are available right now. Be the first to post a property!
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Post a Property
          </button>
        </>
      )}
    </div>
  );
}
