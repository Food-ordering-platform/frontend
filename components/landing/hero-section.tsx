"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export function HeroSection() {
  
  // 1. SINGLE IMAGE CONFIGURATION
  // Change this path to your specific background image
  const backgroundImage = "/hero1.jpg";

  const messages = [
    "Banga & Starch",
    "Correct Jollof",
    "Wicked Suya",
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
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px]" />
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
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#7b1e3a]/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#7b1e3a] shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#7b1e3a] animate-pulse"></span>
              The #1 Food Delivery in Warri
            </div>

            {/* Header Text */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 max-w-2xl">
              Craving 
              <span className="text-[#7b1e3a] inline-block ml-2 min-w-[180px] sm:min-w-[240px] text-left">
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
              <br className="hidden sm:block mt-2"/>
              <span className="block text-2xl sm:text-3xl lg:text-5xl mt-2 font-bold text-gray-700">
                we deliver sharp sharp.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-900 max-w-lg leading-relaxed font-medium">
              Order from your favorite restaurants and get it delivered hot. No delay, no stories.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mt-6 sm:mt-8 mx-auto lg:mx-0">
              <div className="flex items-center w-full bg-white rounded-full p-1.5 sm:p-2 pl-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 focus-within:ring-2 focus-within:ring-[#7b1e3a]/20">
                <MapPin className="text-[#7b1e3a] w-5 h-5 mr-2 flex-shrink-0" />
                <Input 
                  type="text" 
                  placeholder="Enter address..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm sm:text-base placeholder:text-gray-400 h-auto w-full truncate"
                />
                <Button 
                  size="lg" 
                  className="rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white px-5 sm:px-8 h-10 sm:h-12 ml-2 shadow-md shrink-0 font-bold text-sm sm:text-base"
                  asChild
                >
                  <Link href="/restaurants">Order</Link>
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 sm:pt-4 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full"><Star className="h-3 w-3 sm:h-4 sm:w-4 text-[#f59e0b] fill-current" /></div>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="bg-green-100 p-1.5 rounded-full"><Zap className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 fill-current" /></div>
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
            className="hidden lg:flex relative h-[500px] lg:h-[600px] items-center justify-center"
          >
            <div className="relative w-full max-w-[450px] lg:max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7b1e3a]/10 to-orange-100/60 rounded-full animate-pulse-slow blur-3xl" />
              
              <div className="relative h-full w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-[2.5rem] shadow-2xl p-6 lg:p-8 flex items-center justify-center">
                 <img
                  src="/order-food.svg"
                  alt="Delicious Food"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative"
                />

                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-4 lg:-left-8 top-1/4 bg-white p-3 lg:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">🍲</div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Order Placed</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">Banga Soup</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-4 lg:-right-8 bottom-1/4 bg-white p-3 lg:p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rating</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">4.9 / 5.0</p>
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