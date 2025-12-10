"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Zap } from "lucide-react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { motion, easeOut } from "framer-motion";
import { Star } from "lucide-react";

export function HeroSection() {
  const messages = [
    "Banga & Starch 🥘",
    "Correct Jollof 🍛",
    "Wicked Suya 🍖",
    "Sharp Shawarma 🌯",
    "Pepper Soup 🥣",
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
    <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#faf9f8]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>
      
      {/* Gradient Blobs - Adjusted for Mobile */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] rounded-full bg-[#7b1e3a]/5 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] rounded-full bg-orange-100/40 blur-3xl" />

      <div className="container relative z-10 pt-24 pb-16 lg:pt-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center lg:text-left space-y-6 lg:space-y-2 px-4 lg:px-0"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#7b1e3a]/10 px-3 py-1 lg:px-4 lg:py-1.5 text-xs lg:text-sm font-medium text-[#7b1e3a] shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#7b1e3a] animate-pulse"></span>
              The #1 Food Delivery platform in Warri
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
              Craving <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b1e3a] to-[#ff5722]">
                <Typewriter
                  words={messages}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
              <br />
              we deliver sharp sharp.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From Mama Put to 5-star restaurants, we bring the best of Warri straight to your doorstep. No long talk.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white text-base font-semibold shadow-lg shadow-[#7b1e3a]/25 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/restaurants">
                  Oya Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-gray-200 hover:border-[#7b1e3a] hover:bg-[#7b1e3a]/5 text-gray-700 font-semibold"
                asChild
              >
                <Link href="/restaurants">See Menu</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-[#7b1e3a]" />
                <span>500+ Spots</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#f59e0b]" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Illustration - HIDDEN ON MOBILE (lg:flex) */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="hidden lg:flex relative lg:h-[600px] items-center justify-center"
          >
            {/* Main Image Container with Abstract Blob */}
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7b1e3a]/5 to-orange-100/50 rounded-full animate-pulse-slow blur-2xl" />
              
              <div className="relative h-full w-full bg-white/40 backdrop-blur-sm border border-white/50 rounded-[2.5rem] shadow-2xl p-8 flex items-center justify-center">
                 <img
                  src="/order-food.svg"
                  alt="Delicious Food"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative"
                />

                {/* Floating 3D Cards */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-4 top-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-2xl">🍲</div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Order Placed</p>
                    <p className="text-sm font-bold text-gray-900">Banga Soup</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-orange-500 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Rating</p>
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