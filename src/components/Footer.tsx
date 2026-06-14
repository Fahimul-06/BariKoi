import { Building2, Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Bari<span className="text-teal-400">Koi</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Bangladesh's trusted property marketplace. Find your dream home, list your property, and connect with verified developers.
            </p>
            <div className="flex gap-3">
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Browse</h3>
            <ul className="space-y-2">
              {['Apartments for Sale', 'Apartments for Rent', 'Houses for Sale', 'Commercial Properties', 'New Projects', 'Featured Listings'].map(link => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate('search')}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Popular Areas</h3>
            <ul className="space-y-2">
              {['Gulshan, Dhaka', 'Banani, Dhaka', 'Dhanmondi, Dhaka', 'Uttara, Dhaka', 'Chittagong', 'Sylhet'].map(area => (
                <li key={area}>
                  <button
                    onClick={() => onNavigate('search')}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">House 15, Road 27, Gulshan 1, Dhaka 1212</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-sm text-gray-400">+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-sm text-gray-400">info@barikoi.com.bd</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">For listing support:</p>
              <p className="text-sm text-white font-medium mt-0.5">+880 1800-000000</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BariKoi. All rights reserved.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button onClick={() => onNavigate('privacy')} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('faq')} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">FAQ</button>
            <button onClick={() => onNavigate('about')} className="text-xs text-gray-500 hover:text-teal-400 transition-colors">About Us</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
