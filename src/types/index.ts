export type UserRole = 'customer' | 'developer' | 'owner' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
}

export interface Developer {
  id: string;
  user_id: string;
  company_name: string;
  description: string;
  trade_license_url: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  established_year: number | null;
  total_projects: number;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  developer_id: string | null;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  listing_type: 'sale' | 'rent';
  status: 'available' | 'booked' | 'sold' | 'rented';
  price: number;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  total_floors: number;
  address: string;
  city: string;
  area_name: string;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  amenities: string[];
  nearby: string[];
  verified: boolean;
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  developer?: Developer;
  profile?: Profile;
}

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  visit_date: string;
  visit_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  created_at: string;
  property?: Property;
  profile?: Profile;
}

export interface Inquiry {
  id: string;
  property_id: string;
  user_id: string;
  message: string;
  phone: string;
  name: string;
  status: 'new' | 'replied' | 'closed';
  created_at: string;
  property?: Property;
  profile?: Profile;
}

export interface Favorite {
  id: string;
  property_id: string;
  user_id: string;
  created_at: string;
  property?: Property;
}

export type Page =
  | 'home'
  | 'search'
  | 'property-detail'
  | 'auth'
  | 'customer-dashboard'
  | 'developer-dashboard'
  | 'owner-dashboard'
  | 'admin-dashboard'
  | 'about'
  | 'privacy'
  | 'faq';
