import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import PhotoUploader from './PhotoUploader';
import { Property } from '../types';

export interface PropertyFormData {
  title: string;
  listing_type: string;
  type: string;
  status: string;
  price: string;
  area_sqft: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  total_floors: string;
  address: string;
  city: string;
  area_name: string;
  description: string;
  amenities: string[];
  nearby: string[];
  photos: string[];
}

export function blankForm(): PropertyFormData {
  return {
    title: '', listing_type: 'sale', type: 'apartment', status: 'available',
    price: '', area_sqft: '', bedrooms: '', bathrooms: '',
    floor: '', total_floors: '', address: '', city: 'Dhaka',
    area_name: '', description: '', amenities: [], nearby: [], photos: [],
  };
}

export function propertyToForm(p: Property): PropertyFormData {
  return {
    title: p.title, listing_type: p.listing_type, type: p.type, status: p.status,
    price: String(p.price), area_sqft: String(p.area_sqft),
    bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms),
    floor: String(p.floor), total_floors: String(p.total_floors),
    address: p.address, city: p.city, area_name: p.area_name,
    description: p.description, amenities: [...(p.amenities || [])],
    nearby: [...(p.nearby || [])], photos: [...(p.photos || [])],
  };
}

const AMENITY_OPTIONS = ['Gym', 'Swimming Pool', 'Parking', 'Generator', 'Elevator', 'Security', 'Wifi', 'Garden', 'Rooftop', 'CCTV', 'Water Reservoir', 'Intercom'];
const NEARBY_PRESETS = ['School', 'Hospital', 'Market', 'Mosque', 'Park', 'Bank', 'Restaurant', 'Bus Stop', 'Metro Station'];

interface PropertyFormProps {
  initial?: PropertyFormData;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  accentColor?: string;
}

export default function PropertyForm({ initial, onSubmit, onCancel, submitLabel = 'Save', isSubmitting = false, accentColor = 'teal' }: PropertyFormProps) {
  const [form, setForm] = useState<PropertyFormData>(initial || blankForm());
  const [newNearby, setNewNearby] = useState('');
  const [activeSection, setActiveSection] = useState<'basic' | 'details' | 'amenities' | 'photos'>('basic');

  function set(key: keyof PropertyFormData, value: string | string[]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleAmenity(a: string) {
    set('amenities', form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a]);
  }

  function addNearby(val?: string) {
    const item = (val || newNearby).trim();
    if (item && !form.nearby.includes(item)) {
      set('nearby', [...form.nearby, item]);
      setNewNearby('');
    }
  }

  function removeNearby(item: string) {
    set('nearby', form.nearby.filter(x => x !== item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const ring = accentColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-teal-500';
  const activeBg = accentColor === 'blue' ? 'bg-blue-600 text-white' : 'bg-teal-600 text-white';
  const btnBg = accentColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700';

  const SECTIONS = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'photos', label: 'Photos' },
  ] as const;

  const inputClass = `w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${ring} focus:border-transparent`;
  const selectClass = `w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${ring} appearance-none bg-white`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 shrink-0">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSection === s.id ? activeBg : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {/* ── Basic Info ── */}
        {activeSection === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Title *</label>
              <input required type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputClass} placeholder="e.g. 3 Bed Luxury Apartment in Gulshan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Listing Type</label>
                <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)} className={selectClass}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={selectClass}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House/Duplex</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land/Plot</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price (৳) *</label>
                <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} className={inputClass} placeholder={form.listing_type === 'rent' ? 'Monthly rent' : 'Sale price'} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={selectClass}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                <select value={form.city} onChange={e => set('city', e.target.value)} className={selectClass}>
                  {['Dhaka','Chittagong','Sylhet','Rajshahi','Khulna','Barishal','Comilla','Mymensingh'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Area / Neighbourhood</label>
                <input type="text" value={form.area_name} onChange={e => set('area_name', e.target.value)} className={inputClass} placeholder="e.g. Gulshan 1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} className={inputClass} placeholder="House no, Road, Block..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe the property in detail..." />
            </div>
          </div>
        )}

        {/* ── Details ── */}
        {activeSection === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Area (sqft)</label>
                <input type="number" min="0" value={form.area_sqft} onChange={e => set('area_sqft', e.target.value)} className={inputClass} placeholder="Total area" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bedrooms</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => set('bedrooms', String(Math.max(0, Number(form.bedrooms) - 1)))} className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="number" min="0" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} className="flex-1 text-center py-2.5 text-sm focus:outline-none" />
                  <button type="button" onClick={() => set('bedrooms', String(Number(form.bedrooms) + 1))} className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bathrooms</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => set('bathrooms', String(Math.max(0, Number(form.bathrooms) - 1)))} className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-r border-gray-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input type="number" min="0" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} className="flex-1 text-center py-2.5 text-sm focus:outline-none" />
                  <button type="button" onClick={() => set('bathrooms', String(Number(form.bathrooms) + 1))} className="px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border-l border-gray-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Floor Number</label>
                <input type="number" min="0" value={form.floor} onChange={e => set('floor', e.target.value)} className={inputClass} placeholder="e.g. 7" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Total Floors in Building</label>
                <input type="number" min="0" value={form.total_floors} onChange={e => set('total_floors', e.target.value)} className={inputClass} placeholder="e.g. 12" />
              </div>
            </div>

            {/* Nearby Facilities */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Nearby Facilities</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {NEARBY_PRESETS.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => addNearby(n)}
                    disabled={form.nearby.includes(n)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                      form.nearby.includes(n)
                        ? 'bg-teal-100 border-teal-300 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    + {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNearby}
                  onChange={e => setNewNearby(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNearby(); } }}
                  placeholder="Custom facility (e.g. Hospital 200m)"
                  className={`${inputClass} flex-1`}
                />
                <button type="button" onClick={() => addNearby()} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm">Add</button>
              </div>
              {form.nearby.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.nearby.map(n => (
                    <span key={n} className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                      {n}
                      <button type="button" onClick={() => removeNearby(n)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Amenities ── */}
        {activeSection === 'amenities' && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Select all amenities available in this property:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_OPTIONS.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                    form.amenities.includes(a)
                      ? `border-teal-500 bg-teal-50 text-teal-700`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    form.amenities.includes(a) ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {form.amenities.includes(a) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {a}
                </button>
              ))}
            </div>
            {form.amenities.length > 0 && (
              <p className="text-xs text-teal-600 mt-3">{form.amenities.length} amenities selected</p>
            )}
          </div>
        )}

        {/* ── Photos ── */}
        {activeSection === 'photos' && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Upload up to 10 photos. First photo will be the cover image.</p>
            <PhotoUploader
              existingPhotos={form.photos}
              onChange={urls => set('photos', urls)}
              maxPhotos={10}
            />
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100 shrink-0">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-2.5 ${btnBg} text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors`}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
