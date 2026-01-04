"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function DownloadAppSectionFormatted() {
  return (
    // 1. OUTER WINE BACKGROUND
    <section className="bg-[#7b1e3a] py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background pattern overlay for texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        
        {/* 2. INNER WHITE "PADDING" CONTAINER */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-2xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* --- LEFT SIDE: TEXT CONTENT --- */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-800 font-bold text-sm uppercase tracking-wider mb-2 mx-auto lg:mx-0">
               🔥 Warri's No.1 Food App
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Aren't you hungry? <br />
              <span className="text-[#7b1e3a]">We move sharp.</span>
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Experience the soft life. Get your favorite local delicacies and continental dishes delivered straight to your door in minutes. No stress, just chow.
            </p>

            {/* Feature List (Optional but adds value) */}
            <ul className="flex flex-col gap-3 items-center lg:items-start text-gray-700 font-medium pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="text-[#7b1e3a] h-5 w-5"/> Super fast delivery</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-[#7b1e3a] h-5 w-5"/> Real-time order tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="text-[#7b1e3a] h-5 w-5"/> Secure payment options</li>
            </ul>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Button className="h-14 bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-3 transition-all hover:-translate-y-1 shadow-lg flex items-center gap-3">
                <FaApple className="h-7 w-7" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase font-medium text-gray-400">Download on the</span>
                  <span className="text-lg font-bold">App Store</span>
                </div>
              </Button>

              <Button className="h-14 bg-[#7b1e3a] hover:bg-[#5a152a] text-white rounded-xl px-6 py-3 transition-all hover:-translate-y-1 shadow-lg flex items-center gap-3">
                <FaGooglePlay className="h-6 w-6" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] uppercase font-medium text-white/80">Get it on</span>
                  <span className="text-lg font-bold">Google Play</span>
                </div>
              </Button>
            </div>
          </div>

          {/* --- RIGHT SIDE: NEW VISUAL REPLACEMENT --- */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
             {/* Decorative Blob behind the illustration */}
            <div className="absolute bg-orange-100/50 w-[80%] h-[80%] rounded-full blur-3xl -z-10"></div>
            
            {/* REPLACE THIS IMAGE SOURCE:
                Create a nice illustration of a ChowEazy rider delivering food
                and save it as e.g., "/delivery-illustration.png" in your public folder.
            */}
            <div className="relative w-full max-w-md lg:max-w-full h-[400px] lg:h-[500px]">
                {/* Placeholder for the new illustration */}
                 <Image
                    src="/delivery.svg" // <-- REPLACE THIS URL with your local image path like "/delivery-illustration.png"
                    alt="ChowEazy Fast Delivery Illustration"
                    fill
                    className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  
                  {/* Floating Tag */}
                  <div className="absolute bottom-10 left-0 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-bounce hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#7b1e3a] rounded-full flex items-center justify-center">
                            <span className="text-xl">🛵</span>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Order on the way!</p>
                            <p className="text-xs text-gray-500">Arriving in 5 mins</p>
                        </div>
                    </div>
                  </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}