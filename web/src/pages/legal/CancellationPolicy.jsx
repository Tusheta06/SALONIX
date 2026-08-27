import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, AlertTriangle, Mail, MessageCircle } from 'lucide-react';

const PolicyBlock = ({ title, icon: Icon, color, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-xl bg-gray-50`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
    </div>
    <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

export const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-700 via-rose-700 to-purple-800 text-white py-16 px-4 text-center">
        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Cancellation Policy</h1>
        <p className="text-pink-100 text-sm max-w-lg mx-auto">Understand your rights and responsibilities when cancelling or rescheduling appointments on Salonix.</p>
        <p className="text-pink-200 text-xs mt-3">Last Updated: August 2026</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">

        {/* Customer Cancellations */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center text-sm font-extrabold">C</span>
            <span>Customer Cancellations</span>
          </h2>
          <div className="space-y-4">
            <PolicyBlock title="How to Cancel an Appointment" icon={XCircle} color="text-pink-500">
              <p>You can cancel an appointment directly through the Salonix platform:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Log in to your account.</li>
                <li>Go to <strong>My Bookings</strong> from the top navigation.</li>
                <li>Find the appointment you wish to cancel.</li>
                <li>Click the <strong>Cancel</strong> button and confirm.</li>
              </ol>
              <p>Your appointment status will update immediately to "Cancelled".</p>
            </PolicyBlock>

            <PolicyBlock title="Cancellation Time Limits" icon={AlertTriangle} color="text-amber-500">
              <p>We recommend cancelling appointments <strong>at least 24 hours in advance</strong> to allow the salon to reallocate the time slot to another customer. Cancellation policies may vary by individual salon — please check with your salon if you are unsure.</p>
            </PolicyBlock>

            <PolicyBlock title="Late Cancellations" icon={AlertTriangle} color="text-orange-500">
              <p>A late cancellation is one made less than the salon's required notice period before your scheduled appointment. Late cancellations may be subject to the salon's individual late cancellation policy.</p>
              <p>Salonix encourages customers to cancel as early as possible as a courtesy to salons and other customers waiting for available slots.</p>
            </PolicyBlock>

            <PolicyBlock title="No-Show Policy" icon={XCircle} color="text-red-500">
              <p>A no-show occurs when a customer fails to attend a confirmed appointment without cancelling it beforehand.</p>
              <p>Repeated no-shows on the platform may result in restrictions on future bookings. Individual salons may also enforce their own no-show policies, which may include refusing future bookings from customers who habitually fail to attend.</p>
            </PolicyBlock>
          </div>
        </div>

        {/* Salon Cancellations */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-sm font-extrabold">S</span>
            <span>Salon Cancellations</span>
          </h2>
          <div className="space-y-4">
            <PolicyBlock title="When Salons Cancel Appointments" icon={AlertTriangle} color="text-purple-500">
              <p>In some circumstances, a salon may need to cancel a confirmed appointment — for example, due to unexpected staff unavailability, emergency closures, or other operational reasons.</p>
              <p>When a salon cancels an appointment, the status in your <strong>My Bookings</strong> section will reflect the cancellation. We encourage salons to notify affected customers as early as possible.</p>
            </PolicyBlock>

            <PolicyBlock title="Customer Rights on Salon Cancellation" icon={RefreshCw} color="text-blue-500">
              <p>If a salon cancels your appointment, you are entitled to rebook at another available time without any penalty. If you experience issues with a salon cancellation, please contact Salonix support for assistance.</p>
            </PolicyBlock>
          </div>
        </div>

        {/* Rescheduling */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-sm font-extrabold">R</span>
            <span>Rescheduling</span>
          </h2>
          <PolicyBlock title="How to Reschedule" icon={RefreshCw} color="text-blue-500">
            <p>Salonix currently does not have a direct one-step reschedule feature. To reschedule an appointment:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Cancel your existing appointment from <strong>My Bookings</strong>.</li>
              <li>Return to the salon's booking page.</li>
              <li>Select a new available date and time slot and confirm your booking.</li>
            </ol>
            <p>We are working on a direct reschedule feature for a future platform update. Please cancel as early as possible when rescheduling to release the original slot for other customers.</p>
          </PolicyBlock>
        </div>

        {/* Refunds */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-sm font-extrabold">₹</span>
            <span>Refunds</span>
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900 space-y-2">
            <p className="font-bold text-base">Important Note on Refunds</p>
            <p>Salonix currently operates as a booking facilitation platform. <strong>Payments for salon services are made directly to the salon at the time of the appointment</strong> — Salonix does not process online advance payments or hold customer funds.</p>
            <p>Therefore, refund eligibility and processing depend entirely on the <strong>individual salon's own refund policy</strong> and the payment method used. If you paid directly at the salon and believe you are entitled to a refund due to a cancellation or service issue, please discuss this directly with the salon.</p>
            <p>If you cannot resolve the matter with the salon, you may contact Salonix support for guidance at <strong>support@salonix.com</strong>.</p>
          </div>
        </div>

        {/* Disputes */}
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-sm font-extrabold">!</span>
            <span>Disputes</span>
          </h2>
          <PolicyBlock title="How to Report a Cancellation Issue" icon={MessageCircle} color="text-pink-500">
            <p>If you experience a problem related to a cancellation — such as a salon not honouring your appointment, a refund dispute, or a no-show by a salon — please contact Salonix support:</p>
            <ul className="list-disc ml-4 space-y-1 mt-2">
              <li>Email: <strong>support@salonix.com</strong></li>
              <li>Phone: <strong>+91 1800-SALONIX (7256649)</strong></li>
              <li>Use the <Link to="/contact" className="text-pink-600 hover:underline font-semibold">Contact Us</Link> form on our website.</li>
            </ul>
            <p className="mt-2">Our team will review the case and assist in resolving the dispute in a fair and timely manner.</p>
          </PolicyBlock>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-10 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-gray-900">Need further help?</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Our support team is here to help with any cancellation queries or booking issues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-pink-200 transition"
            >
              Contact Support
            </Link>
            <Link
              to="/help"
              className="border border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600 font-semibold px-6 py-3 rounded-xl text-sm transition"
            >
              Visit Help Center
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
