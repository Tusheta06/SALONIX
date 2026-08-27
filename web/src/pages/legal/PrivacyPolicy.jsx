import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-we-collect', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'account-information', title: '4. Account Information' },
  { id: 'booking-information', title: '5. Booking Information' },
  { id: 'salon-owner-information', title: '6. Salon Owner Information' },
  { id: 'cookies', title: '7. Cookies and Local Storage' },
  { id: 'data-security', title: '8. Data Security' },
  { id: 'third-party', title: '9. Third-Party Services' },
  { id: 'data-retention', title: '10. Data Retention' },
  { id: 'your-rights', title: '11. Your Rights' },
  { id: 'changes', title: '12. Changes to This Policy' },
  { id: 'contact', title: '13. Contact Us' },
];

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white py-16 px-4 text-center">
        <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-slate-400 text-sm">Last Updated: August 2026</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Table of Contents — Sticky Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Contents</h4>
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-gray-500 hover:text-pink-600 hover:font-semibold transition py-0.5"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 text-sm text-gray-700 leading-relaxed">

            <section id="introduction">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">1. Introduction</h2>
              <p>Salonix ("we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and protect information obtained through our platform, available at salonix.com and related applications.</p>
              <p className="mt-3">By using Salonix, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please discontinue use of our services.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="information-we-collect">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">2. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li><strong>Personal Identification Information:</strong> Name, email address, and phone number provided during account registration.</li>
                <li><strong>Booking Data:</strong> Appointment dates, times, selected services, stylists, and salons.</li>
                <li><strong>Salon Owner Data:</strong> Salon name, address, business email, phone, service catalog, staff details, and operating hours submitted during salon registration.</li>
                <li><strong>Technical Data:</strong> Browser type, IP address, device type, and pages visited, collected automatically when you use the platform.</li>
                <li><strong>User-Submitted Content:</strong> Reviews, ratings, and comments you post about salons or services.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section id="how-we-use">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p>We use the information collected to:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>Create and manage your Salonix account.</li>
                <li>Process and confirm salon appointment bookings.</li>
                <li>Enable salon owners to manage their business on the platform.</li>
                <li>Improve and personalise the Salonix platform experience.</li>
                <li>Communicate important service updates, booking confirmations, or changes.</li>
                <li>Enforce our Terms of Service and prevent misuse of the platform.</li>
                <li>Analyse usage trends to improve platform performance and features.</li>
              </ul>
              <p className="mt-3">We do not sell your personal information to third parties.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="account-information">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">4. Account Information</h2>
              <p>When you register for a Salonix account, we collect your name, email address, phone number, and password (stored in encrypted form). This information is used to authenticate you, provide access to account features, and communicate relevant service information.</p>
              <p className="mt-3">You may update your account information at any time through your profile settings. You may also request deletion of your account by contacting our support team.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="booking-information">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">5. Booking Information</h2>
              <p>When you book an appointment, we collect and store the booking details including the selected salon, service, stylist, date, time, and price. This information is shared with the relevant salon to fulfil your appointment and is visible to you in your "My Bookings" section.</p>
              <p className="mt-3">Booking records are retained to provide appointment history, support dispute resolution, and allow salons to manage their schedules.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="salon-owner-information">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">6. Salon Owner Information</h2>
              <p>Salon owners who register on Salonix provide additional business information including salon name, address, contact details, service descriptions, pricing, staff information, and operating hours. This information is reviewed by our admin team during the approval process and, upon approval, is displayed publicly on the platform.</p>
              <p className="mt-3">Salon owners are responsible for ensuring their submitted information is accurate, current, and compliant with applicable laws.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="cookies">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">7. Cookies and Local Storage</h2>
              <p>Salonix uses browser local storage and session cookies to maintain your authentication session (JWT tokens), remember your preferences, and improve the performance of the platform.</p>
              <p className="mt-3">These tokens are stored securely in your browser and are used only to authenticate your requests to our servers. You can clear stored data through your browser settings, which will log you out of your session.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="data-security">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">8. Data Security</h2>
              <p>We implement reasonable technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or loss. Passwords are hashed and stored securely. Authentication uses industry-standard JWT (JSON Web Token) mechanisms.</p>
              <p className="mt-3">However, no method of data transmission or storage over the internet is completely secure. We cannot guarantee absolute security and encourage you to use strong, unique passwords and to log out after using shared devices.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="third-party">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">9. Third-Party Services</h2>
              <p>Salonix may integrate with or link to third-party services for purposes such as maps, hosting, or analytics. These third-party services have their own privacy policies, and we are not responsible for their practices. We encourage you to review the privacy policies of any third-party services you interact with through our platform.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="data-retention">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">10. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide services. Booking records are retained to support appointment history and potential disputes. If you request account deletion, we will delete or anonymise your personal data within a reasonable timeframe, subject to any legal obligations to retain certain records.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="your-rights">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">11. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have rights including:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>The right to access the personal information we hold about you.</li>
                <li>The right to request correction of inaccurate information.</li>
                <li>The right to request deletion of your personal information.</li>
                <li>The right to withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, please contact us at <strong>support@salonix.com</strong>.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="changes">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">12. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will indicate the date of the most recent update at the top of this page. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="contact">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">13. Contact Us</h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
              <div className="mt-4 bg-gray-50 rounded-2xl p-5 space-y-2 text-sm">
                <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-pink-500" /><span><strong>Email:</strong> support@salonix.com</span></div>
                <div><strong>Phone:</strong> +91 1800-SALONIX (7256649)</div>
                <div><strong>Address:</strong> Bandra West, Mumbai, Maharashtra 400050, India</div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
