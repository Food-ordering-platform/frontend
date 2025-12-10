"use client"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, MousePointerClick, Truck, Utensils } from "lucide-react"

const steps = [
  {
    icon: MapPin,
    title: "Set Location",
    description: "Select your location to see restaurants near you.",
  },
  {
    icon: MousePointerClick,
    title: "Choose Order",
    description: "Browse menus and select your favorite tasty meals.",
  },
  {
    icon: Utensils,
    title: "Pay Easily",
    description: "Pay securely online or choose payment on delivery.",
  },
  {
    icon: Truck,
    title: "Receive Meal",
    description: "Wait for the knock! Your food is delivered instantly.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-[#faf9f8] relative overflow-hidden">
      <div className="container px-6">
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <span className="text-[#7b1e3a] font-semibold tracking-wider text-xs md:text-sm uppercase">Work Flow</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">How It Works</h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 border-t-2 border-dashed border-gray-300 -z-10" />

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10">
                  <div className="h-16 w-16 md:h-20 md:w-20 bg-[#7b1e3a]/5 rounded-full flex items-center justify-center text-[#7b1e3a]">
                    <s.icon className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 h-7 w-7 md:h-8 md:w-8 bg-[#7b1e3a] text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 border-white shadow-sm">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}