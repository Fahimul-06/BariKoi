import { Shield, Lock, Eye, Bell, Trash2, Mail, RefreshCw } from 'lucide-react';
import { Page } from '../types';

interface PrivacyProps {
  onNavigate: (page: Page) => void;
}

const SECTIONS = [
  {
    icon: Eye,
    title: '1. Information We Collect',
    content: [
      {
        subtitle: '1.1 Information You Provide',
        text: 'When you create an account, we collect your full name, email address, phone number, and role (buyer, owner, or developer). When you list a property, we collect property details including address, price, photos, and description. When you submit an inquiry or book a visit, we collect your message content and contact preferences.',
      },
      {
        subtitle: '1.2 Automatically Collected Information',
        text: 'We automatically collect certain technical data when you use our platform, including IP address, browser type and version, pages visited and time spent, device information, and referring website. This data is used solely for analytics and security purposes.',
      },
      {
        subtitle: '1.3 Property Listing Data',
        text: 'When you upload photos or documents for a property listing, these files are stored securely on our servers. You retain full ownership of all content you upload.',
      },
    ],
  },
  {
    icon: Shield,
    title: '2. How We Use Your Information',
    content: [
      {
        subtitle: '2.1 To Provide Our Services',
        text: 'We use your information to create and manage your account, display your property listings, facilitate communication between buyers and sellers, process visit booking requests, and send you notifications about your listings and inquiries.',
      },
      {
        subtitle: '2.2 To Improve Our Platform',
        text: 'We analyse usage patterns to improve search functionality, personalise property recommendations, identify and fix technical issues, and develop new features based on user behaviour.',
      },
      {
        subtitle: '2.3 For Security & Compliance',
        text: 'We use your information to detect and prevent fraudulent listings, verify developer credentials, comply with applicable Bangladesh laws and regulations, and respond to legal requests from government authorities.',
      },
    ],
  },
  {
    icon: Lock,
    title: '3. Information Sharing',
    content: [
      {
        subtitle: '3.1 With Other Users',
        text: 'Your contact information (phone, email) is shared with another party only when you explicitly initiate contact — for example, when you submit an inquiry or request a site visit. We never publicly display your email or phone number on your profile page.',
      },
      {
        subtitle: '3.2 With Service Providers',
        text: 'We work with trusted third-party providers for cloud storage, email delivery, and analytics. These providers are contractually bound to protect your data and may not use it for their own purposes.',
      },
      {
        subtitle: '3.3 We Do Not Sell Your Data',
        text: 'BariKoi does not sell, rent, or trade your personal information to any third party for marketing or commercial purposes. This is a firm commitment.',
      },
      {
        subtitle: '3.4 Legal Requirements',
        text: 'We may disclose your information when required by law, court order, or government authority, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.',
      },
    ],
  },
  {
    icon: Lock,
    title: '4. Data Security',
    content: [
      {
        subtitle: '4.1 Security Measures',
        text: 'We implement industry-standard security measures including SSL/TLS encryption for all data in transit, encrypted storage for sensitive information, row-level security (RLS) on our database, regular security audits, and access controls limiting who can access user data internally.',
      },
      {
        subtitle: '4.2 Password Security',
        text: 'Passwords are hashed using bcrypt and are never stored in plain text. We recommend using a strong, unique password for your BariKoi account.',
      },
      {
        subtitle: '4.3 Breach Notification',
        text: 'In the unlikely event of a data breach affecting your personal information, we will notify you promptly by email and take immediate steps to secure the platform.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: '5. Data Retention',
    content: [
      {
        subtitle: '5.1 Account Data',
        text: 'We retain your account information for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.',
      },
      {
        subtitle: '5.2 Property Listings',
        text: 'Property listings you create remain on our platform until you delete them or they are removed by admin. Deleted listings are permanently removed from our databases within 30 days.',
      },
      {
        subtitle: '5.3 Inquiry and Booking Records',
        text: 'Inquiry and booking records are retained for 12 months after the transaction for dispute resolution purposes, then permanently deleted.',
      },
    ],
  },
  {
    icon: Bell,
    title: '6. Your Rights',
    content: [
      {
        subtitle: '6.1 Access and Correction',
        text: 'You have the right to access the personal information we hold about you at any time. You can update most of your information directly in your account settings. For data you cannot update yourself, contact us at privacy@barikoi.com.bd.',
      },
      {
        subtitle: '6.2 Data Portability',
        text: 'You may request a copy of your personal data in a machine-readable format. We will provide this within 30 days of your request.',
      },
      {
        subtitle: '6.3 Deletion',
        text: 'You have the right to request deletion of your account and personal data. Submit a deletion request through your account settings or by emailing privacy@barikoi.com.bd. We will process your request within 30 days.',
      },
      {
        subtitle: '6.4 Marketing Communications',
        text: 'You can opt out of marketing emails at any time by clicking the unsubscribe link in any email or updating your notification preferences in your account settings.',
      },
    ],
  },
  {
    icon: Bell,
    title: '7. Cookies',
    content: [
      {
        subtitle: '7.1 What We Use',
        text: 'We use essential session cookies to keep you logged in, and analytics cookies (via privacy-respecting analytics tools) to understand how users interact with our platform.',
      },
      {
        subtitle: '7.2 Cookie Control',
        text: 'You can control cookies through your browser settings. Disabling essential cookies will affect your ability to stay logged in. Analytics cookies can be disabled without affecting core functionality.',
      },
    ],
  },
  {
    icon: Mail,
    title: '8. Contact Us',
    content: [
      {
        subtitle: 'Privacy Inquiries',
        text: 'If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact our Privacy Officer:\n\nEmail: privacy@barikoi.com.bd\nPhone: +880 1700-000000\nAddress: House 15, Road 27, Gulshan 1, Dhaka 1212, Bangladesh\n\nWe aim to respond to all privacy inquiries within 5 business days.',
      },
    ],
  },
];

export default function Privacy({ onNavigate }: PrivacyProps) {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-teal-950 to-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-teal-500/20 border border-teal-400/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy <span className="text-teal-400">Policy</span>
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            We are committed to protecting your privacy and personal information. This policy explains what data we collect, how we use it, and your rights.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-400">
            <span>Last updated: June 2026</span>
            <span>·</span>
            <span>Effective: June 2026</span>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-10 bg-teal-50 border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Quick Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Lock, text: 'We never sell your personal data to third parties.' },
              { icon: Eye, text: 'Your contact info is only shared when you choose to contact a seller.' },
              { icon: Trash2, text: 'You can delete your account and data at any time.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-teal-100">
                <item.icon className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar TOC */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contents</p>
                <nav className="space-y-1">
                  {SECTIONS.map(s => (
                    <a
                      key={s.title}
                      href={`#section-${s.title.split('.')[0]}`}
                      className="block text-sm text-gray-600 hover:text-teal-600 py-1 transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Sections */}
            <div className="lg:col-span-3 space-y-10">
              {SECTIONS.map(section => (
                <div key={section.title} id={`section-${section.title.split('.')[0]}`}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                      <section.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="space-y-5 pl-12">
                    {section.content.map(item => (
                      <div key={item.subtitle}>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.subtitle}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            This Privacy Policy may be updated periodically. We will notify registered users of significant changes by email.
            Continued use of BariKoi after changes constitutes acceptance of the updated policy.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Questions? Email us at{' '}
            <a href="mailto:privacy@barikoi.com.bd" className="text-teal-600 hover:underline">privacy@barikoi.com.bd</a>
          </p>
        </div>
      </section>
    </div>
  );
}
