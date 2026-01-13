"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Restaurants } from "@/components/restaurants/restaurant"
import { Search } from "lucide-react"

export default function RestaurantsPage() {
  return (
    // Changed main bg to a very light warm gray (off-white) for better contrast
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION: 
           - Uses a warm "Appetizing" gradient (Cream to faint Orange/Red)
           - Adds a subtle 'dot pattern' to give it texture without clutter
        */}
        <section className="relative pt-16 pb-16 px-4 md:pt-24 md:pb-20 overflow-hidden">
          
          {/* Background Styling */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBF2] to-[#FFF0F0] -z-20" />
          {/* Subtle Dot Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#d4c4b0_1px,transparent_1px)] [background-size:20px_20px] -z-10" />

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            
            {/* Typography */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Delicious Food, 
              <span className="text-[#7b1e3a]">Delivered to You.</span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
              Cravings met in minutes. Explore top-rated restaurants and cafes in Warri
            </p>

            {/* Enhanced Search Bar - "Floating" Style */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                {/* A warmer, softer shadow for the 'food' feel */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-red-200 rounded-full blur opacity-40 transition duration-500 group-hover:opacity-60"></div>
                
                <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl shadow-orange-900/5 ring-1 ring-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
                  <div className="flex-shrink-0 pl-5 pr-3">
                    <Search className="h-6 w-6 text-[#7b1e3a]" />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="What are you craving? (e.g., Jollof, Burger)"
                    className="flex-1 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none text-base md:text-lg"
                  />
                  
                  <button className="hidden sm:block flex-shrink-0 bg-[#7b1e3a] hover:bg-[#60172d] text-white font-bold px-8 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
                    Find Food
                  </button>
                  
                  {/* Mobile Search Icon Button (visible only on small screens) */}
                  <button className="sm:hidden flex-shrink-0 bg-[#7b1e3a] text-white p-3 rounded-full">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Quick suggestions text below search (Very common in food apps) */}
              <p className="mt-4 text-sm text-gray-500">
                Popular: <span className="underline decoration-orange-300 cursor-pointer hover:text-[#7b1e3a]">Chicken Republic</span>, <span className="underline decoration-orange-300 cursor-pointer hover:text-[#7b1e3a]">Kilimanjaro</span>, <span className="underline decoration-orange-300 cursor-pointer hover:text-[#7b1e3a]">Pizza</span>
              </p>
            </div>

          </div>
        </section>

        {/* Restaurant Grid Section */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-gray-900">Nearby Favorites</h2>
               {/* Optional filter button could go here */}
            </div>
            <Restaurants />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}