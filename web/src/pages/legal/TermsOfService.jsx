import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Service' },
  { id: 'user-accounts', title: '3. User Accounts' },
  { id: 'customer-responsibilities', title: '4. Customer Responsibilities' },
  { id: 'salon-owner-responsibilities', title: '5. Salon Owner Responsibilities' },
  { id: 'salon-approval', title: '6. Salon Approval & Verification' },
  { id: 'bookings', title: '7. Appointment Bookings' },
  { id: 'cancellations', title: '8. Cancellations' },
  { id: 'payments', title: '9. Payments' },
  { id: 'conduct', title: '10. User Conduct' },
  { id: 'content', title: '11. Content and Information' },
  { id: 'termination', title: '12. Suspension or Termination' },
  { id: 'liability', title: '13. Limitation of Liability' },
  { id: 'changes', title: '14. Changes to Terms' },
  { id: 'contact', title: '15. Contact Information' },
];

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white py-16 px-4 text-center">
        <div className="w-14 h-14 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Terms of Service</h1>
        <p className="text-slate-400 text-sm">Last Updated: August 2026</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sticky Sidebar TOC */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2 max-h-[80vh] overflow-y-auto">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Contents</h4>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="block text-xs text-gray-500 hover:text-pink-600 hover:font-semibold transition py-0.5">
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 text-sm text-gray-700 leading-relaxed">

            <section id="acceptance">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the Salonix platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms constitute a legally binding agreement between you and Salonix.</p>
              <p className="mt-3">These Terms apply to all users of the platform including customers, salon owners, salon managers, staff members, and administrators.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="description">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">2. Description of Service</h2>
              <p>Salonix is an online salon discovery and appointment booking platform that connects customers with salon businesses across India. The Service allows customers to browse approved salons, view services and pricing, and book appointments with stylists.</p>
              <p className="mt-3">Salonix provides the technological platform but is not itself a salon service provider. The salons listed are independent businesses responsible for the services they provide.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="user-accounts">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">3. User Accounts</h2>
              <p>To access certain features of the Service, you must create an account. You agree to:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>Provide accurate, complete, and current information during registration.</li>
                <li>Keep your password secure and not share it with others.</li>
                <li>Notify us immediately of any unauthorised use of your account.</li>
                <li>Be responsible for all activity that occurs under your account.</li>
              </ul>
              <p className="mt-3">Salonix reserves the right to suspend or terminate accounts that violate these Terms or are found to contain false information.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="customer-responsibilities">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">4. Customer Responsibilities</h2>
              <p>As a customer using the Salonix booking platform, you agree to:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>Provide accurate personal information when registering and booking appointments.</li>
                <li>Arrive on time for your scheduled appointments.</li>
                <li>Cancel appointments within a reasonable timeframe if you cannot attend.</li>
                <li>Treat salon staff with respect.</li>
                <li>Provide honest and factual reviews if submitting feedback.</li>
                <li>Not misuse the booking system by creating fraudulent or false bookings.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section id="salon-owner-responsibilities">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">5. Salon Owner Responsibilities</h2>
              <p>Salon Owners registering and operating on Salonix agree to:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>Provide accurate, truthful, and up-to-date information about their salon, services, staff, and pricing.</li>
                <li>Maintain the accuracy of salon working hours and service availability.</li>
                <li>Honour confirmed appointments made through the platform.</li>
                <li>Not misrepresent services, qualifications, or pricing.</li>
                <li>Comply with all applicable local laws and regulations related to operating a salon business.</li>
                <li>Manage customer data obtained through the platform responsibly and in compliance with applicable privacy laws.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section id="salon-approval">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">6. Salon Approval and Verification</h2>
              <p>New salon registrations on Salonix are subject to an administrative review and approval process. Salons that have been submitted but not yet approved will have a <strong>PENDING</strong> status and will not be publicly displayed to customers.</p>
              <p className="mt-3">Salonix reserves the right to approve or reject salon registrations at its discretion. Salons may be rejected if they provide incomplete, inaccurate, or inappropriate information. Salonix may also suspend or remove previously approved salons that are found to be in violation of these Terms.</p>
              <p className="mt-3">Only approved salons with <strong>is_approved = True</strong> status are visible on the public salon discovery pages.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="bookings">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">7. Appointment Bookings</h2>
              <p>Salonix facilitates appointment bookings between customers and salons. When you book an appointment:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>The booking is subject to the salon's real-time availability.</li>
                <li>A booking slot is locked to prevent double-booking using atomic database transactions.</li>
                <li>You will receive a booking confirmation with all relevant appointment details.</li>
                <li>The salon may confirm, complete, or cancel appointments from their dashboard.</li>
              </ul>
              <p className="mt-3">Salonix does not guarantee that a salon will be able to fulfil every booking in all circumstances (e.g., emergency closures, staff availability changes).</p>
            </section>

            <hr className="border-gray-100" />

            <section id="cancellations">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">8. Cancellations</h2>
              <p>Customers may cancel confirmed appointments through the platform. Please review our full <Link to="/cancellation-policy" className="text-pink-600 hover:underline font-semibold">Cancellation Policy</Link> for details on timing, late cancellations, no-shows, and refunds.</p>
              <p className="mt-3">Salon Owners may also cancel appointments when operationally necessary. Customers should be notified promptly in such cases.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="payments">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">9. Payments</h2>
              <p>Salonix currently operates as a booking facilitation platform. Payments for salon services are made directly to the salon at the time of the appointment (in person). Salonix does not currently process online advance payments or hold funds on behalf of salons or customers.</p>
              <p className="mt-3">Any payment terms, discounts, or refund arrangements are between the customer and the individual salon.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="conduct">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">10. User Conduct</h2>
              <p>All users of Salonix agree not to:</p>
              <ul className="list-disc ml-5 space-y-2 mt-3">
                <li>Use the platform for any unlawful purpose.</li>
                <li>Attempt to gain unauthorised access to any part of the platform or its data.</li>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Harass, abuse, or harm other users or salon staff.</li>
                <li>Post defamatory, offensive, or inappropriate reviews or content.</li>
                <li>Use automated scripts, bots, or scraping tools against the platform without prior consent.</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section id="content">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">11. Content and Information</h2>
              <p>Users who submit content (including reviews, salon descriptions, images, and service information) represent that such content is accurate and does not infringe on any third-party rights. Salonix reserves the right to remove any content that violates these Terms or that is otherwise deemed inappropriate at its sole discretion.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="termination">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">12. Suspension or Termination</h2>
              <p>Salonix reserves the right to suspend or permanently terminate any user account, at its sole discretion and without prior notice, if it determines that the user has violated these Terms, engaged in fraudulent activity, or otherwise acted in a manner harmful to the platform or other users.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="liability">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">13. Limitation of Liability</h2>
              <p>Salonix provides the platform on an "as is" and "as available" basis. To the fullest extent permitted by applicable law, Salonix shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to missed appointments, service dissatisfaction, or data loss.</p>
              <p className="mt-3">Salonix is not responsible for the quality, safety, or legality of salon services provided by independent salon businesses listed on the platform.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="changes">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">14. Changes to Terms</h2>
              <p>Salonix may revise these Terms of Service at any time. Changes will be reflected on this page with an updated date. Continued use of the platform after changes are posted constitutes acceptance of the revised Terms. We encourage you to review these Terms periodically.</p>
            </section>

            <hr className="border-gray-100" />

            <section id="contact">
              <h2 className="text-xl font-extrabold text-gray-900 mb-3">15. Contact Information</h2>
              <p>If you have questions about these Terms of Service, please contact us:</p>
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
