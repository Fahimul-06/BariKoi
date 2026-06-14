import { useState } from 'react';
import { ChevronDown, Search, MessageSquare, Building2, Home, Shield } from 'lucide-react';
import { Page } from '../types';

interface FAQProps {
  onNavigate: (page: Page) => void;
}

interface FAQItem {
  q: string;
  a: string;
}

const CATEGORIES = [
  {
    id: 'buying',
    label: 'Buying a Property',
    icon: Home,
    color: 'bg-teal-50 text-teal-600',
    items: [
      { q: 'How do I search for a property on BariKoi?', a: 'Use the search bar on the homepage or the Search page. You can filter by city, area, property type (apartment, house, commercial, land), listing type (sale or rent), price range, and number of bedrooms. Results update instantly based on your filters.' },
      { q: 'Are all listings on BariKoi verified?', a: 'We verify listings before they go live. Verified listings are marked with a blue checkmark on the property card. While we strive to keep all information accurate, we recommend visiting the property in person before making any financial commitment.' },
      { q: 'How do I contact a seller or developer?', a: 'Open any property listing and click "Contact Seller". You\'ll need to create a free account first. Fill in your name, phone number, and message, and the seller will be notified immediately.' },
      { q: 'Can I compare multiple properties?', a: 'Currently you can save properties to your Favorites list from your Customer Dashboard and review them side by side. A dedicated comparison tool is on our roadmap.' },
      { q: 'How do I book a site visit?', a: 'On any property detail page, click "Book Site Visit". Choose your preferred date and time, and the seller or developer will confirm the booking. You\'ll receive a notification in your dashboard.' },
      { q: 'Is BariKoi free to use for buyers?', a: 'Yes. Creating an account and browsing, saving, contacting sellers, and booking visits are all completely free for buyers and tenants.' },
    ] as FAQItem[],
  },
  {
    id: 'selling',
    label: 'Selling & Renting',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600',
    items: [
      { q: 'How do I list my property on BariKoi?', a: 'Register or log in, select the "Owner" role during signup, then go to your Owner Dashboard and click "List Property". Fill in the property details, upload up to 10 photos, select amenities and nearby facilities, and submit. Your listing goes live after admin verification.' },
      { q: 'How long does listing verification take?', a: 'Typically within 24–48 hours on business days. You\'ll be notified once your listing is verified and live. During this time your listing is visible only to you in your dashboard.' },
      { q: 'Can I edit my listing after it\'s live?', a: 'Yes. Go to your Owner or Developer Dashboard, find the property, and click the Edit (pencil) icon. You can update any details, add or remove photos, and change the listing status at any time.' },
      { q: 'How do I mark a property as sold or rented?', a: 'In your dashboard, find the property and use the status dropdown to change it to "Sold" or "Rented". The listing will remain visible but marked with the updated status.' },
      { q: 'What types of properties can I list?', a: 'You can list apartments, houses/duplexes, commercial spaces (office, shop, warehouse), and land/plots — for either sale or rent.' },
      { q: 'Can I upload videos or 3D views?', a: 'Currently we support up to 10 photos per listing. Video and 3D walkthrough support is coming soon.' },
    ] as FAQItem[],
  },
  {
    id: 'developers',
    label: 'For Developers',
    icon: Building2,
    color: 'bg-amber-50 text-amber-600',
    items: [
      { q: 'How do I register as a construction developer?', a: 'During signup, select the "Developer" role. Once registered, contact our admin team to submit your trade license and company documents. After verification, your company profile will be marked as a Verified Developer.' },
      { q: 'What does developer verification involve?', a: 'Our admin team reviews your company registration, trade license, and past project history. Once approved, all your listings will carry the Verified Developer badge, which greatly increases buyer trust.' },
      { q: 'Can I assign multiple sales agents?', a: 'Multi-agent management is on our roadmap. Currently, all listings and inquiries are managed under a single developer account.' },
      { q: 'How do I track inquiries and site visit requests?', a: 'Your Developer Dashboard has dedicated tabs for Leads (inquiries) and Visits (bookings). Each inquiry shows the buyer\'s name, phone, and message. You can confirm or manage visit requests directly from the dashboard.' },
      { q: 'Is there a limit on how many properties I can list?', a: 'There is no hard limit for verified developers. We encourage high-quality, accurate listings rather than quantity.' },
    ] as FAQItem[],
  },
  {
    id: 'account',
    label: 'Account & Safety',
    icon: Shield,
    color: 'bg-purple-50 text-purple-600',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign In" or "Post Property" in the top navigation. Choose "Create Account", enter your name and email, select your role (Buyer, Owner, or Developer), and set a password. No phone OTP required — you\'re ready to go immediately.' },
      { q: 'I forgot my password. What do I do?', a: 'On the Sign In page, click "Forgot password?" and enter your email. You\'ll receive a password reset link shortly. If you don\'t see it, check your spam folder.' },
      { q: 'How does BariKoi protect my personal information?', a: 'We take privacy seriously. Your contact details are only shared with sellers when you explicitly submit an inquiry. We never sell your data to third parties. See our Privacy Policy for full details.' },
      { q: 'How do I report a fake or misleading listing?', a: 'On any property detail page, use the Share button menu to find the report option. Our moderation team reviews reports within 24 hours. Listings that violate our policies are removed immediately.' },
      { q: 'Can I change my account role?', a: 'Role changes require admin assistance. Contact our support team at info@barikoi.com.bd with your request and reasoning.' },
    ] as FAQItem[],
  },
];

export default function FAQ({ onNavigate }: FAQProps) {
  const [activeCategory, setActiveCategory] = useState('buying');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const activeItems = CATEGORIES.find(c => c.id === activeCategory)?.items || [];

  const filtered = search.trim()
    ? CATEGORIES.flatMap(c => c.items.filter(item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
      ))
    : activeItems;

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-teal-400">Questions</span>
          </h1>
          <p className="text-gray-300 mb-8">
            Everything you need to know about using BariKoi.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!search.trim() && (
            /* Category Tabs */
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {search.trim() && (
            <p className="text-sm text-gray-500 mb-6 text-center">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : filtered.map((item, idx) => {
              const key = `${activeCategory}-${idx}`;
              const isOpen = openItem === key;
              return (
                <div
                  key={key}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isOpen ? 'border-teal-300 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-medium text-sm sm:text-base ${isOpen ? 'text-teal-700' : 'text-gray-900'}`}>
                      {item.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform text-gray-400 ${isOpen ? 'rotate-180 text-teal-500' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
              <MessageSquare className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-500 text-sm mb-5">
                Our support team is available 7 days a week to help you.
              </p>
              <a
                href="mailto:info@barikoi.com.bd"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
