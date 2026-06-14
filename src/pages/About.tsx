import { Building2, Users, ShieldCheck, TrendingUp, MapPin, Phone, Mail, Star, Award, Heart } from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const TEAM = [
  { name: 'Rahman Al-Faruk', role: 'CEO & Co-Founder', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Nusrat Jahan', role: 'Head of Operations', img: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Karim Hossain', role: 'CTO', img: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Sabrina Akter', role: 'Head of Marketing', img: 'https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const MILESTONES = [
  { year: '2019', title: 'BariKoi Founded', desc: 'Started as a small property listing service in Dhaka.' },
  { year: '2020', title: '1,000 Listings', desc: 'Reached our first milestone of 1,000 verified property listings.' },
  { year: '2022', title: 'Nationwide Expansion', desc: 'Expanded to all 8 divisions of Bangladesh.' },
  { year: '2024', title: '10,000+ Properties', desc: 'Became Bangladesh\'s largest verified property marketplace.' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Trust & Transparency', desc: 'Every listing is manually reviewed to ensure accuracy and authenticity for all our users.' },
  { icon: Heart, title: 'Customer First', desc: 'We put buyers, renters, and sellers at the heart of every decision we make.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in service quality and user experience.' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We continuously invest in technology to make property search easier and faster.' },
];

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm mb-6">
            <Building2 className="w-4 h-4" /> Bangladesh's #1 Property Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            About <span className="text-teal-400">BariKoi</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make finding and listing properties in Bangladesh simple, transparent, and trustworthy for everyone.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-teal-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '12,400+', label: 'Properties Listed' },
              { value: '8,200+', label: 'Happy Customers' },
              { value: '340+', label: 'Verified Developers' },
              { value: '6', label: 'Cities Covered' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
                <p className="text-teal-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BariKoi was founded with one goal in mind: to bring trust and transparency to the property market in Bangladesh. For too long, property seekers have faced fake listings, misleading information, and lack of reliable data.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We verify every listing before it goes live, background-check developers, and provide tools that make it easy for anyone — whether you're a first-time buyer, a seasoned investor, or a developer — to do business confidently.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From Dhaka to Chittagong, Sylhet to Rajshahi, we're building the platform that connects Bangladesh's property market.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Modern building"
                className="rounded-2xl shadow-xl w-full object-cover h-72 sm:h-96"
              />
              <div className="absolute -bottom-4 -left-4 bg-teal-600 text-white p-5 rounded-2xl shadow-lg">
                <p className="text-3xl font-bold">5+</p>
                <p className="text-sm text-teal-200">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto">The principles that guide every decision we make at BariKoi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Journey</h2>
            <p className="text-gray-500">Key milestones in building Bangladesh's property marketplace.</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0 relative z-10">
                    {m.year.slice(2)}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{m.year}</span>
                      <h3 className="font-bold text-gray-900">{m.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-500">The people behind BariKoi's mission.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-3 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-10 md:p-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-teal-100 mb-8 max-w-lg mx-auto">
              Have questions or want to partner with us? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="tel:+8801700000000" className="flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors justify-center">
                <Phone className="w-4 h-4" /> +880 1700-000000
              </a>
              <a href="mailto:info@barikoi.com.bd" className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-900 transition-colors border border-teal-500 justify-center">
                <Mail className="w-4 h-4" /> info@barikoi.com.bd
              </a>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-teal-200 text-sm mt-6">
              <MapPin className="w-4 h-4" /> House 15, Road 27, Gulshan 1, Dhaka 1212
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
