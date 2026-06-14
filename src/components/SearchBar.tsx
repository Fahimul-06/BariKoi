import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialValues?: Partial<SearchFilters>;
  variant?: 'hero' | 'inline';
}

export interface SearchFilters {
  keyword: string;
  city: string;
  listingType: 'all' | 'sale' | 'rent';
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

const CITIES = ['All Cities', 'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Comilla'];
const PROPERTY_TYPES = ['All Types', 'Apartment', 'House', 'Commercial', 'Land'];

export default function SearchBar({ onSearch, initialValues, variant = 'hero' }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: initialValues?.keyword || '',
    city: initialValues?.city || '',
    listingType: initialValues?.listingType || 'all',
    type: initialValues?.type || '',
    minPrice: initialValues?.minPrice || '',
    maxPrice: initialValues?.maxPrice || '',
    bedrooms: initialValues?.bedrooms || '',
  });

  function set(key: keyof SearchFilters, value: string) {
    setFilters(f => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(filters);
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search area, address..."
              value={filters.keyword}
              onChange={e => set('keyword', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filters.city}
              onChange={e => set('city', e.target.value === 'All Cities' ? '' : e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filters.listingType}
              onChange={e => set('listingType', e.target.value as SearchFilters['listingType'])}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
            >
              <option value="all">Buy & Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filters.type}
              onChange={e => set('type', e.target.value === 'All Types' ? '' : e.target.value.toLowerCase())}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
            >
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Min Price (৳)"
            value={filters.minPrice}
            onChange={e => set('minPrice', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="number"
            placeholder="Max Price (৳)"
            value={filters.maxPrice}
            onChange={e => set('maxPrice', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Search Properties
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-3xl">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
        {(['all', 'sale', 'rent'] as const).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => set('listingType', type)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              filters.listingType === type
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type === 'all' ? 'All' : type === 'sale' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by area, city, or address..."
            value={filters.keyword}
            onChange={e => set('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="relative sm:w-44">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filters.city}
            onChange={e => set('city', e.target.value === 'All Cities' ? '' : e.target.value)}
            className="w-full pl-9 pr-8 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 appearance-none bg-white"
          >
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-md flex items-center gap-2 justify-center"
        >
          <Search className="w-4 h-4" /> Search
        </button>
      </div>
    </form>
  );
}
