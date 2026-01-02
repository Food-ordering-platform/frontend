"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export function VendorSection() {
  return (
    <section className="py-20 bg-[white] text-white overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7b1e3a]/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container px-6 mx-auto relative z-10">
        <div className="bg-[#1a1a1a] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/5 shadow-2xl">
          
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 text-[#7b1e3a] font-semibold bg-[#7b1e3a]/10 px-4 py-1.5 rounded-full text-sm">
              <TrendingUp size={16} />
              <span>For Restaurants & Chefs</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Grow Your Business with <span className="text-white">ChowEazy.</span>
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              Partner with us to reach more customers in Warri. We handle the delivery, you handle the cooking. 
              <span className="block mt-2 text-white font-medium">15% commission. 100% support.</span>
            </p>
            
            <div className="pt-2">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-12 rounded-full"
                asChild
              >
                <Link href="/partner">
                  Become a Vendor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative Stat Card / Visual */}
          <div className="relative hidden md:block w-[350px]">
             {/* Simulating a dashboard card or growth chart */}
             <div className="bg-[#252525] p-6 rounded-2xl border border-white/10 shadow-inner transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-10 bg-[#7b1e3a] rounded-full flex items-center justify-center">
                        <TrendingUp className="text-white h-5 w-5" />
                    </div>
                    <span className="text-green-500 font-bold text-sm">+24% Sales</span>
                </div>
                <div className="space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-[#7b1e3a]" />
                    </div>
                    <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                </div>
                <div className="mt-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Weekly Revenue</p>
                    <p className="text-2xl font-bold text-white">₦ 450,000</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}