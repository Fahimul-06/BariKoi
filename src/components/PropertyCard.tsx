import { useState } from 'react';
import { Heart, MapPin, BedDouble, Bath, Maximize2, Building2, CheckCircle, Star } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  isFavorited?: boolean;
  onFavoriteChange?: () => void;
}

function formatPrice(price: number, listingType: string) {
  if (listingType === 'rent') {
    return `৳${(price / 1000).toFixed(0)}k/mo`;
  }
  if (price >= 10000000) return `৳${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `৳${(price / 100000).toFixed(1)} Lac`;
  return `৳${price.toLocaleString()}`;
}

export default function PropertyCard({ property, onView, isFavorited = false, onFavoriteChange }: PropertyCardProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [imgError, setImgError] = useState(false);

  const photo = !imgError && property.photos?.[0]
    ? property.photos[0]
    : `https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600`;

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) return;
    if (favorited) {
      await supabase.from('favorites').delete().eq('property_id', property.id).eq('user_id', user.id);
    } else {
      await supabase.from('favorites').insert({ property_id: property.id });
    }
    setFavorited(!favorited);
    onFavoriteChange?.();
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
      onClick={() => onView(property.id)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={photo}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            property.listing_type === 'sale'
              ? 'bg-teal-600 text-white'
              : 'bg-amber-500 text-white'
          }`}>
            For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-yellow-900 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
        </div>
        {property.status !== 'available' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-bold capitalize">
              {property.status}
            </span>
          </div>
        )}
        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            favorited
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
            {property.title}
          </h3>
          {property.verified && (
            <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{property.area_name}{property.area_name && property.city ? ', ' : ''}{property.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-gray-400" />
              {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              {property.bathrooms} Bath
            </span>
          )}
          {property.area_sqft > 0 && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              {property.area_sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-teal-700">
              {formatPrice(property.price, property.listing_type)}
            </p>
            {property.listing_type === 'sale' && property.area_sqft > 0 && (
              <p className="text-xs text-gray-400">
                ৳{Math.round(property.price / property.area_sqft).toLocaleString()}/sqft
              </p>
            )}
          </div>
          {property.developer && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Building2 className="w-3 h-3" />
              <span className="line-clamp-1 max-w-24">{property.developer.company_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
