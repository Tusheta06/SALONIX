import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, MessageCircle, BookOpen, Store, CreditCard, HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: 'General',
    icon: HelpCircle,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    items: [
      {
        q: 'What is Salonix?',
        a: 'Salonix is a salon discovery and appointment booking platform that connects customers with top-rated salons across India. You can browse salons, view services and pricing, check stylist availability, and book appointments in real time — all from one place.'
      },
      {
        q: 'How do I find a salon?',
        a: 'Visit the Explore Salons page and use filters such as city, service category, or minimum rating to discover salons near you. You can also use the search bar to find a specific salon by name.'
      },
      {
        q: 'How do I create an account?',
        a: 'Click the "Book Appointment" or "Register" button in the top navigation. Fill in your name, email address, phone number, and a secure password. Once submitted, your account will be created instantly and you can start booking.'
      },
      {
        q: 'Is creating an account free?',
        a: 'Yes, creating a customer account on Salonix is completely free. There are no subscription fees or hidden charges for customers browsing or booking appointments through the platform.'
      },
    ]
  },
  {
    category: 'Bookings',
    icon: BookOpen,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    items: [
      {
        q: 'How do I book an appointment?',
        a: 'Navigate to your chosen salon\'s detail page, select a service, choose a stylist, pick an available date and time slot, and confirm your booking. You will see a real-time availability calendar showing only open slots.'
      },
      {
        q: 'How can I view my appointments?',
        a: 'Once logged in as a customer, click "My Bookings" in the top navigation. You will see a full list of your upcoming, completed, and cancelled appointments with all relevant details.'
      },
      {
        q: 'Can I reschedule an appointment?',
        a: 'Currently, rescheduling is done by cancelling your existing appointment and booking a new slot at your preferred time. We are working on a direct reschedule feature for a future update.'
      },
      {
        q: 'How do I cancel an appointment?',
        a: 'Go to "My Bookings", find the appointment you wish to cancel, and click the Cancel button. Please review the salon\'s cancellation policy before cancelling to understand any applicable conditions.'
      },
      {
        q: 'Will I receive a booking confirmation?',
        a: 'Yes. Once your appointment is confirmed, the booking details are immediately visible in your "My Bookings" section. The appointment is recorded with the date, time, stylist name, service, and price.'
      },
    ]
  },
  {
    category: 'Salon Owners',
    icon: Store,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    items: [
      {
        q: 'How can I register my salon?',
        a: 'Register as a Salon Owner using the "For Salon Owners" section. Once logged in with a Salon Owner account, you will see a "Create Your Salon" button on your dashboard. This opens a guided 7-step setup form where you can add all your salon details.'
      },
      {
        q: 'How does salon approval work?',
        a: 'After you submit your salon setup, our admin team will review your salon information, images, services, and staff details. Once reviewed and approved, your salon becomes publicly visible to customers. You can monitor your approval status from your Salon Dashboard.'
      },
      {
        q: 'How can I add services?',
        a: 'During the initial setup wizard or from your Salon Dashboard → Services section, you can add services with a name, category, description, price, and duration. Only services marked as active will be shown to customers.'
      },
      {
        q: 'How can I add staff members?',
        a: 'From your Salon Dashboard → Staff section, you can add staff members with their name, specialization, experience, contact details, and profile photo. Each staff member can be assigned to appointments by customers during booking.'
      },
      {
        q: 'How can I manage salon working hours?',
        a: 'Go to your Salon Dashboard → Working Hours section. You can set opening and closing times for each day of the week and mark days as Open or Closed. These hours directly control which booking slots are available to customers.'
      },
      {
        q: 'How can I manage appointments?',
        a: 'From your Salon Dashboard → Appointments section, you can view all upcoming and past customer bookings. You can confirm, complete, or cancel appointments as needed. Your assigned stylists can also update appointment status from the Staff Portal.'
      },
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    color: 'text-green-500',
    bg: 'bg-green-50',
    items: [
      {
        q: 'What payment methods are accepted?',
        a: 'Payment handling is managed directly between you and the salon at the time of your appointment. Salonix currently facilitates bookings and scheduling — please confirm with your salon about accepted payment methods (cash, UPI, card, etc.) before your visit.'
      },
      {
        q: 'When do I need to pay?',
        a: 'Payment is typically collected at the salon after your appointment is completed. Salonix does not currently process online advance payments. This may vary by individual salon policy.'
      },
      {
        q: 'How are refunds handled?',
        a: 'Since payments are made directly at the salon, any refund or cancellation compensation is subject to the individual salon\'s policy. If you have a dispute, please contact the salon directly or reach out to Salonix support at support@salonix.com.'
      },
    ]
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition group"
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{question}</span>
        <span className="flex-shrink-0 text-gray-400 group-hover:text-pink-500 transition">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
};

export const HelpCenter = () => {
  const [search, setSearch] = useState('');

  const filtered = faqData.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        search === '' ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => s.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-700 via-rose-700 to-purple-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Help Center & FAQ</h1>
        <p className="text-pink-100 text-lg max-w-xl mx-auto mb-8">Find answers to common questions about booking, salons, accounts, and more.</p>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl text-gray-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <HelpCircle className="w-12 h-12 mx-auto text-gray-300" />
            <p className="font-semibold text-gray-600">No results found for "{search}"</p>
            <p className="text-sm">Try a different keyword or browse the categories below.</p>
          </div>
        )}

        {filtered.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${section.bg}`}>
                  <Icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900">{section.category}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <FAQItem key={i} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Support CTA */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-10 text-center space-y-4">
          <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-900">Still need help?</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Our support team is ready to assist you. Whether you have a booking issue, an account problem, or a general question — reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-pink-200 transition"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@salonix.com"
              className="border border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600 font-semibold px-6 py-3 rounded-xl text-sm transition"
            >
              Email: support@salonix.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
