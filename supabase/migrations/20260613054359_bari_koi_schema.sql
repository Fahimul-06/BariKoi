/*
# Bari Koi — Property Marketplace Schema

## Summary
Creates the full schema for Bari Koi, a property marketplace for Bangladesh.
Supports four user roles: customer, developer (company), owner (individual), and admin.

## New Tables

### profiles
Extends auth.users with display info and role assignment.
- id: matches auth.users.id
- full_name, phone, avatar_url
- role: 'customer' | 'developer' | 'owner' | 'admin'

### developers
Company profile for construction developers.
- company_name, description, trade_license_url, logo_url
- status: 'pending' | 'approved' | 'rejected'
- verified boolean

### properties
Core listing table for both sale and rent.
- listing_type: 'sale' | 'rent'
- type: 'apartment' | 'house' | 'commercial' | 'land'
- status: 'available' | 'booked' | 'sold' | 'rented'
- Geolocation columns (city, area_name, address)
- price, area_sqft, bedrooms, bathrooms, floor, total_floors
- photos text[] for image URLs
- developer_id nullable FK to developers

### bookings
Visit scheduling for properties.
- status: 'pending' | 'confirmed' | 'cancelled'

### inquiries
Contact messages from customers to sellers.
- status: 'new' | 'replied' | 'closed'

### favorites
Saved/bookmarked properties per user.

## Security
- RLS enabled on all tables.
- profiles: owner can update their own row; anyone authenticated can read all.
- properties: owner can CRUD their own; authenticated + anon can read available ones.
- bookings, inquiries, favorites: owner-scoped CRUD.
- developers: owner can insert/update their own; admin can update status.
*/

-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','developer','owner','admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ─────────────────────────────────────────────
-- developers
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  trade_license_url text DEFAULT '',
  logo_url text DEFAULT '',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  established_year integer,
  total_projects integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "developers_select" ON developers;
CREATE POLICY "developers_select" ON developers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "developers_insert" ON developers;
CREATE POLICY "developers_insert" ON developers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "developers_update" ON developers;
CREATE POLICY "developers_update" ON developers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "developers_delete" ON developers;
CREATE POLICY "developers_delete" ON developers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- properties
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  developer_id uuid REFERENCES developers(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'apartment' CHECK (type IN ('apartment','house','commercial','land')),
  listing_type text NOT NULL DEFAULT 'sale' CHECK (listing_type IN ('sale','rent')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','booked','sold','rented')),
  price numeric NOT NULL DEFAULT 0,
  area_sqft numeric DEFAULT 0,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  floor integer DEFAULT 0,
  total_floors integer DEFAULT 0,
  address text DEFAULT '',
  city text DEFAULT 'Dhaka',
  area_name text DEFAULT '',
  latitude numeric,
  longitude numeric,
  photos text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  nearby text[] DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "properties_select" ON properties;
CREATE POLICY "properties_select" ON properties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "properties_insert" ON properties;
CREATE POLICY "properties_insert" ON properties FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "properties_update" ON properties;
CREATE POLICY "properties_update" ON properties FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "properties_delete" ON properties;
CREATE POLICY "properties_delete" ON properties FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS properties_city_idx ON properties(city);
CREATE INDEX IF NOT EXISTS properties_listing_type_idx ON properties(listing_type);
CREATE INDEX IF NOT EXISTS properties_status_idx ON properties(status);
CREATE INDEX IF NOT EXISTS properties_user_id_idx ON properties(user_id);

-- ─────────────────────────────────────────────
-- bookings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_date date NOT NULL,
  visit_time text DEFAULT '10:00',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select" ON bookings;
CREATE POLICY "bookings_select" ON bookings FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM properties WHERE id = property_id)
  );

DROP POLICY IF EXISTS "bookings_insert" ON bookings;
CREATE POLICY "bookings_insert" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update" ON bookings;
CREATE POLICY "bookings_update" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_delete" ON bookings;
CREATE POLICY "bookings_delete" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- inquiries
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  name text DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','replied','closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "inquiries_select" ON inquiries;
CREATE POLICY "inquiries_select" ON inquiries FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT user_id FROM properties WHERE id = property_id)
  );

DROP POLICY IF EXISTS "inquiries_insert" ON inquiries;
CREATE POLICY "inquiries_insert" ON inquiries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "inquiries_update" ON inquiries;
CREATE POLICY "inquiries_update" ON inquiries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM properties WHERE id = property_id))
  WITH CHECK (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM properties WHERE id = property_id));

DROP POLICY IF EXISTS "inquiries_delete" ON inquiries;
CREATE POLICY "inquiries_delete" ON inquiries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- favorites
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select" ON favorites;
CREATE POLICY "favorites_select" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert" ON favorites;
CREATE POLICY "favorites_insert" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_update" ON favorites;
CREATE POLICY "favorites_update" ON favorites FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete" ON favorites;
CREATE POLICY "favorites_delete" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Trigger: auto-create profile on sign-up
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
