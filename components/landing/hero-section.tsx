"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, easeOut, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // REPLACE THESE WITH YOUR ACTUAL IMAGE FILES
  const heroImages = [
    "/hero1.jpg", 
    "/hero2.jpg", 
    "/hero3.jpg", 
    "/hero4.jpg", 
  ];

  const messages = [
    "Banga & Starch",
    "Correct Jollof",
    "Wicked Suya",
    "Sharp Shawarma",
    "Pepper Soup",
  ];

  // Cycle through background images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const leftVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const rightVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: easeOut } },
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center">
      
      {/* 1. BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image 
              src={heroImages[currentImageIndex]} 
              alt="Food Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        {/* UPDATED OVERLAY: 
            - bg-white/60 (More transparent so you see the image)
            - backdrop-blur-[3px] (Blurs the image slightly so text pops) 
        */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px]" />
      </div>

      <div className="container relative z-10 pt-24 pb-12 lg:pt-0 lg:pb-0 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
          
          {/* 2. Left Content */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            // CHANGED: "text-left" ensures strict left alignment
            className="text-center space-y-6 lg:space-y-8" 
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#7b1e3a]/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-[#7b1e3a] shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#7b1e3a] animate-pulse"></span>
              The #1 Food Delivery in Warri
            </div>

            {/* HEADER TEXT FIX: Question mark is now naturally inline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900 max-w-2xl">
              Craving 
              <span className="text-[#7b1e3a] inline-block ml-2 min-w-[200px]">
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
              <br className="mt-2"/>
              <span className="block text-2xl sm:text-3xl lg:text-5xl mt-2 font-bold text-gray-700">
                we deliver sharp sharp.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-900 max-w-lg leading-relaxed font-medium">
              Order from your favorite restaurants and get it delivered hot. No delay, no stories.
            </p>

            {/* Search Bar - ALIGNED LEFT */}
            <div className="relative max-w-md w-full mt-6 sm:mt-8">
              <div className="flex items-center w-full bg-white rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 focus-within:ring-2 focus-within:ring-[#7b1e3a]/20">
                <MapPin className="text-[#7b1e3a] w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
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
                  <Link href="/restaurants">Order Now</Link>
                </Button>
              </div>
            </div>

            {/* Trust Badges - ALIGNED LEFT */}
            <div className="pt-2 sm:pt-4 flex flex-wrap justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-gray-800">
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

          {/* 3. Right Content: Image Illustration */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="hidden lg:flex relative lg:h-[600px] items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7b1e3a]/10 to-orange-100/60 rounded-full animate-pulse-slow blur-3xl" />
              
              <div className="relative h-full w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-[2.5rem] shadow-2xl p-8 flex items-center justify-center">
                 <img
                  src="/order-food.svg"
                  alt="Delicious Food"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative"
                />

                {/* Floating Cards */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
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
                  className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
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