"use client";

import { Button } from "@/components/ui/button";
import { Star, Zap, ArrowRight, Smartphone } from "lucide-react"; // Added new icons
import Link from "next/link";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export function HeroSection() {
  
  // 1. SINGLE IMAGE CONFIGURATION
  const backgroundImage = "/hero1.jpg";

  const messages = [
    "Banga & Starch",
    "Correct Jollof",
    "Sharp Shawarma",
    "Pepper Soup",
  ];

  const leftVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const rightVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: easeOut } },
  };

  return (
    <section className="relative overflow-hidden w-full min-h-[85vh] lg:min-h-screen flex items-center py-20 lg:py-0">
      
      {/* 2. STATIC BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImage} 
          alt="Food Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#7b1e3a]/10 px-4 py-1.5 text-sm font-bold text-[#7b1e3a] shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7b1e3a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7b1e3a]"></span>
              </span>
              The #1 Food Delivery in Warri
            </div>

            {/* Header Text */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900 max-w-3xl">
              Craving 
              <span className="text-[#7b1e3a] inline-block ml-3 min-w-[200px] text-left">
                <Typewriter
                  words={messages}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>?
              <br className="hidden sm:block"/>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-4 font-bold text-gray-600">
                we deliver sharp sharp.
              </span>
            </h1>

            <p className="text-lg text-gray-700 max-w-xl leading-relaxed font-medium">
              Order from your favorite local spots and get it delivered hot to your doorstep. No delays, just enjoyment.
            </p>

            {/* --- REPLACED SEARCH BAR WITH ACTION BUTTONS --- */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
              {/* Primary Action */}
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto rounded-full bg-[#7b1e3a] hover:bg-[#60172d] text-white px-8 h-14 text-lg font-bold shadow-lg shadow-[#7b1e3a]/20 transition-all hover:scale-105"
              >
                <Link href="/restaurants">
                   Order Food Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {/* Secondary Action (App Download / Learn More) */}
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-8 h-14 text-lg font-bold transition-all hover:border-[#7b1e3a]/30"
              >
                <Link href="/app">
                   <Smartphone className="mr-2 h-5 w-5 text-[#7b1e3a]" /> Get the App
                </Link>
              </Button>
            </div>
            {/* ------------------------------------------------ */}

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 text-sm font-bold text-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="bg-orange-100 p-2 rounded-full"><Star className="h-4 w-4 text-[#f59e0b] fill-current" /></div>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2.5">
                  <div className="bg-green-100 p-2 rounded-full"><Zap className="h-4 w-4 text-green-600 fill-current" /></div>
                <span>25 Min Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content: Image Illustration */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="hidden lg:flex relative h-[600px] items-center justify-center"
          >
            <div className="relative w-full max-w-[550px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7b1e3a]/10 to-orange-100/60 rounded-full animate-pulse-slow blur-3xl" />
              
              <div className="relative h-full w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-[3rem] shadow-2xl p-8 flex items-center justify-center">
                 <img
                  src="/order-food.svg"
                  alt="Delicious Food"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative transform hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Cards - Kept these as they are nice details */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white flex items-center gap-4 z-20"
                >
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🍲</div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Order Placed</p>
                    <p className="text-sm font-bold text-gray-900">Banga Soup</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 bottom-1/4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white flex items-center gap-4 z-20"
                >
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-orange-500 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">Rating</p>
                    <p className="text-sm font-bold text-gray-900">4.9 / 5.0</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}