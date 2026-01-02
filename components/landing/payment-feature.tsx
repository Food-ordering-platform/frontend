"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, CalendarClock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PaymentFeatureSection() {
  return (
    <section className="py-12 md:py-24 bg-black overflow-hidden">
      {/* Added responsive padding to the container */}
      <div className="container px-4 md:px-6 mx-auto">
        
        {/* White Card Container */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
            
            {/* Left: Image */}
            {/* Centered on mobile with restricted width */}
            <div className="w-full lg:w-1/2 relative flex justify-center">
              <div className="relative w-full max-w-[280px] md:max-w-[400px]">
                <div className="absolute inset-0 bg-[#7b1e3a]/5 rounded-full blur-3xl transform scale-90" />
                <Image 
                  src="/Mobile-payment.svg" 
                  alt="App Interface" 
                  width={400} 
                  height={800} 
                  className="relative z-10 drop-shadow-2xl w-full h-auto"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Payment Made Eazy <br />
                <span className="text-[#7b1e3a]">once and for all.</span>
              </h2>
              
              <p className="text-base md:text-lg text-gray-600">
                We've made paying for food as easy as eating it. Secure, fast, and flexible.
              </p>

              <div className="space-y-6 text-left">
                {/* Feature 1 */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-gray-100 p-2 rounded-lg h-fit shrink-0">
                      <CreditCard className="text-[#7b1e3a] h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-gray-900">Cards & Transfers</h3>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed">Accepts Verve, Mastercard, Visa, and direct bank transfers.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-gray-100 p-2 rounded-lg h-fit shrink-0">
                      <CalendarClock className="text-[#7b1e3a] h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-gray-900">Schedule & Pickup</h3>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed">Order now, chop later. Schedule your delivery for a specific time.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                  <Button size="lg" className="bg-[#7b1e3a] hover:bg-[#66172e] text-white rounded-full w-full md:w-auto px-8 h-12" asChild>
                      <Link href="/signup">Get Started</Link>
                  </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}