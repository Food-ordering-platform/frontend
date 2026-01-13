"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Restaurants } from "@/components/restaurants/restaurant"
import { Search, MapPin, TrendingUp } from "lucide-react"

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 via-white to-gray-50 selection:bg-[#7b1e3a] selection:text-white">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7b1e3a]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main>
        {/* Modern Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 animate-fade-in">
              {[
                { icon: MapPin, label: "Port Harcourt", value: "Your Location" },
                { icon: TrendingUp, label: "50+ Restaurants", value: "Available Now" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-sm"
                >
                  <stat.icon className="h-4 w-4 text-[#7b1e3a]" />
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{stat.value}</span>
                    <span className="text-gray-500 ml-1">• {stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Hero Content */}
            <div className="text-center space-y-6 mb-10">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900">
                Discover Amazing
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b1e3a] via-[#a62b50] to-[#7b1e3a] animate-gradient">
                  Food Near You
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                Order from the best local restaurants. Fast delivery, fresh food, happy you.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center gap-4 bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-xl focus-within:shadow-2xl focus-within:border-[#7b1e3a]/30 transition-all duration-300">
                  <Search className="h-6 w-6 text-[#7b1e3a]" />
                  <input
                    type="text"
                    placeholder="Search for restaurants, cuisines, or dishes..."
                    className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                  <button className="px-6 py-2.5 bg-gradient-to-r from-[#7b1e3a] to-[#a62b50] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#7b1e3a]/30 transition-all duration-300 hover:scale-105 active:scale-95">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Grid Section */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <Restaurants />
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}