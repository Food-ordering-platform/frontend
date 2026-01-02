"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowRight, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

export function HeroSection() {
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
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      
      {/* 1. Food Background Image with Heavy Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
            src="/pizza-restaurant-storefront.jpg" // Using a real food image from your files
            alt="Food Background"
            fill
            className="object-cover"
            priority
        />
        {/* Heavy White Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 pt-24 pb-16 lg:pt-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          
          {/* 2. Left Content: Search & Typewriter */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center lg:text-left space-y-8 px-4 lg:px-0"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#7b1e3a]/10 px-4 py-1.5 text-sm font-medium text-[#7b1e3a] shadow-sm mx-auto lg:mx-0 backdrop-blur-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#7b1e3a] animate-pulse"></span>
              The #1 Food Delivery in Warri
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              Craving <br className="hidden lg:block"/>
              <span className="text-[#7b1e3a]">
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
              <br />
              we deliver sharp sharp.
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Order from your favorite restaurants and get it delivered hot. No delay, no stories.
            </p>

            {/* High Conversion Search Bar */}
            <div className="relative max-w-md w-full mx-auto lg:mx-0 mt-6">
              <div className="flex items-center w-full bg-white rounded-full p-2 pl-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 focus-within:ring-2 focus-within:ring-[#7b1e3a]/20">
                <MapPin className="text-[#7b1e3a] w-5 h-5 mr-3 flex-shrink-0" />
                <Input 
                  type="text" 
                  placeholder="Enter your delivery address..." 
                  className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-base placeholder:text-gray-400 h-auto w-full truncate"
                />
                <Button 
                  size="lg" 
                  className="rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white px-8 h-12 ml-2 shadow-md shrink-0 font-bold"
                  asChild
                >
                  <Link href="/restaurants">Order Now</Link>
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-8 text-sm font-semibold text-gray-500">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full"><Star className="h-4 w-4 text-[#f59e0b] fill-current" /></div>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="bg-green-100 p-1.5 rounded-full"><Zap className="h-4 w-4 text-green-600 fill-current" /></div>
                <span>25 Min Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Right Content: Original Illustration (Restored) */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="hidden lg:flex relative lg:h-[600px] items-center justify-center"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Animated Blob Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7b1e3a]/10 to-orange-100/60 rounded-full animate-pulse-slow blur-3xl" />
              
              {/* Glass Card Container */}
              <div className="relative h-full w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-[2.5rem] shadow-2xl p-8 flex items-center justify-center">
                 <img
                  src="/order-food.svg"
                  alt="Delicious Food"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative"
                />

                {/* Floating 3D Card: Order Placed */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🍲</div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Order Placed</p>
                    <p className="text-sm font-bold text-gray-900">Banga Soup</p>
                  </div>
                </motion.div>

                {/* Floating 3D Card: Rating */}
                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-orange-500 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rating</p>
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