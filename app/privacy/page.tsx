"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Lock, Eye, Share2, ShieldCheck, Database } from "lucide-react";

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Header />

      {/* Hero Header */}
      <div className="bg-[#7b1e3a] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container  mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your privacy is a big deal to us. This policy explains how ChowEazy collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation (Sticky) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-2 border-l-2 border-gray-100 pl-6">
              <p className="font-bold text-gray-900 mb-4">Contents</p>
              <a href="#collection" className="block text-sm text-gray-600 hover:text-[#7b1e3a] transition-colors py-1">Information We Collect</a>
              <a href="#usage" className="block text-sm text-gray-600 hover:text-[#7b1e3a] transition-colors py-1">How We Use Your Data</a>
              <a href="#sharing" className="block text-sm text-gray-600 hover:text-[#7b1e3a] transition-colors py-1">Information Sharing</a>
              <a href="#security" className="block text-sm text-gray-600 hover:text-[#7b1e3a] transition-colors py-1">Data Security</a>
              <a href="#rights" className="block text-sm text-gray-600 hover:text-[#7b1e3a] transition-colors py-1">Your Rights</a>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            <section id="collection" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7b1e3a]/10 rounded-lg text-[#7b1e3a]">
                  <Database className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
                <p>We collect information to provide you with a seamless delivery experience ("sharp sharp" delivery).</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and delivery addresses.</li>
                  <li><strong>Payment Information:</strong> We do not store your full card details. Payments are processed by secure third-party gateways (e.g., Paystack/Flutterwave).</li>
                  <li><strong>Location Data:</strong> We collect precise location data from your device to facilitate delivery tracking and address selection.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our app, your order history, and device information.</li>
                </ul>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7b1e3a]/10 rounded-lg text-[#7b1e3a]">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Service Delivery</h3>
                  <p className="text-sm text-gray-600">To process your orders, manage payments, and deliver food to your door.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Communication</h3>
                  <p className="text-sm text-gray-600">To send you order updates, riders' details, and important service alerts.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Improvement</h3>
                  <p className="text-sm text-gray-600">To analyze trends, fix bugs, and improve the ChowEazy platform.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Safety</h3>
                  <p className="text-sm text-gray-600">To detect and prevent fraud, abuse, and security incidents.</p>
                </div>
              </div>
            </section>

            <section id="sharing" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7b1e3a]/10 rounded-lg text-[#7b1e3a]">
                  <Share2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">3. Information Sharing</h2>
              </div>
              <p className="text-gray-600 mb-4">We do not sell your personal data. However, we share necessary data with:</p>
              <ul className="list-disc pl-5 space-y-3 text-gray-600">
                <li><strong>Restaurants:</strong> To prepare your specific order.</li>
                <li><strong>Logistics Partners (Riders):</strong> Your name, phone number, and delivery address are shared with riders to fulfill the delivery.</li>
                <li><strong>Legal Authorities:</strong> If required by Nigerian law or to protect our rights and safety.</li>
              </ul>
            </section>

            <section id="security" className="scroll-mt-24">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7b1e3a]/10 rounded-lg text-[#7b1e3a]">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">4. Data Security</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We implement robust security measures including encryption and secure socket layer (SSL) technology to protect your data. While we work hard to protect your information, no internet transmission is 100% secure, so we urge you to keep your password safe.
              </p>
            </section>

            <section id="rights" className="scroll-mt-24">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7b1e3a]/10 rounded-lg text-[#7b1e3a]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">5. Your Rights</h2>
              </div>
              <p className="text-gray-600 mb-4">Under Nigerian Data Protection laws, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your account and data (subject to legal retention periods).</li>
                <li>Opt-out of marketing communications.</li>
              </ul>
            </section>

            <div className="border-t pt-8 mt-12">
               <p className="text-gray-500 text-sm">
                 If you have any privacy-related questions, please reach out to our Data Protection Officer at <a href="mailto:privacy@choweazy.com" className="text-[#7b1e3a] font-semibold">privacy@choweazy.com</a>.
               </p>
               <p className="text-gray-400 text-xs mt-2">
                 © {currentYear} ChowEazy (A Naturenest Global Company). Warri, Delta State, Nigeria.
               </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}