"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Page Header */}
          <div className="bg-[#7b1e3a] text-white p-8 sm:p-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
              Please read these terms carefully before using ChowEazy. By using our platform, you agree to these rules which ensure a smooth experience for everyone.
            </p>
            <div className="mt-6 inline-block bg-white/10 px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border border-white/20">
              Last Updated: {currentDate}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-12 space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to <strong>ChowEazy</strong>, a service operated by <strong>NatureNest Global Company</strong> ("we," "our," or "us"). These Terms and Conditions govern your use of our website and mobile application (collectively, the "Platform"). By creating an account or placing an order, you agree to be bound by these terms. If you do not agree, please do not use our services.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 18 years old to create an account.</li>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your password and account details.</li>
                <li>We reserve the right to suspend or terminate accounts that violate our policies or engage in fraudulent activity.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Orders and Delivery</h2>
              <div className="space-y-4">
                <p>
                  <strong>3.1 Availability:</strong> All orders are subject to the availability of items at the partner restaurant. If an item is unavailable, we or the restaurant will contact you to offer a substitute or a refund.
                </p>
                <p>
                  <strong>3.2 Delivery Times:</strong> Estimated delivery times are provided for convenience only. While we strive to deliver "sharp sharp," external factors (traffic, weather in Warri, etc.) may cause delays.
                </p>
                <p>
                  <strong>3.3 Receipt of Goods:</strong> You must be available at the designated delivery address to receive your order. If you are unreachable for more than 10 minutes upon the rider's arrival, the order may be left at a secure location or returned, and you will be charged.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Pricing and Payment</h2>
              <p className="mb-2">
                All prices are listed in Nigerian Naira (NGN). Prices for food items are set by the restaurants.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Delivery Fees:</strong> Calculated based on distance and demand.</li>
                <li><strong>Service Fees:</strong> A small fee may apply to help run the platform.</li>
                <li><strong>Payment Methods:</strong> We accept debit cards, bank transfers, and other electronic payment methods via our secure payment partners. We generally do not encourage "Pay on Delivery" for safety reasons unless explicitly stated.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Cancellations and Refunds</h2>
              <p>
                You may cancel an order only <strong>before</strong> the restaurant has started preparing the food. Once preparation has begun, cancellations are not permitted, and you will be charged the full amount. Refunds are processed for missing items, wrong orders, or severe quality issues, subject to verification by our support team.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. User Conduct</h2>
              <p>
                We have zero tolerance for abuse. You agree to treat our riders and support staff with respect. Harassment, use of profanity, or physical violence will result in an immediate permanent ban and potential legal action.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p>
                ChowEazy connects you with third-party restaurants and independent logistics partners. NatureNest Global Company is not responsible for the quality of food prepared by restaurants, though we strive to partner only with the best. Our liability is limited to the total value of your order.
              </p>
            </section>

             <Separator />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms involving NatureNest Global Company or its service ChowEazy shall be resolved in the competent courts of Delta State, Nigeria.
              </p>
            </section>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
              <h3 className="font-bold text-gray-900 mb-2">Have questions?</h3>
              <p className="text-sm">
                If you have any concerns regarding these terms, please contact our legal team at <a href="mailto:legal@choweazy.com" className="text-[#7b1e3a] hover:underline font-medium">legal@choweazy.com</a>.
                <br /><span className="text-gray-500 text-xs mt-2 block">ChowEazy is a registered trademark of NatureNest Global Company.</span>
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}