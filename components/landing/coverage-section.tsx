"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function RestaurantSection() {
  return (
    <section className="bg-white py-16 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Explore Top <span className="text-[#7b1e3a]">Restaurants</span> <br className="hidden md:block"/> 
              in Your City
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Why settle for less when you can have the best? We partner with the finest restaurants to bring you a diverse menu of local and international delicacies.
            </p>

            <ul className="space-y-4 mb-10 inline-block text-left">
              {["Curated selection of top-rated spots", "Menus updated in real-time", "Exclusive deals and discounts"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#7b1e3a] shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-center md:justify-start">
                <Button
                size="lg"
                className="bg-[#7b1e3a] hover:bg-[#66172e] text-white px-10 py-6 rounded-full shadow-xl shadow-[#7b1e3a]/20 text-lg font-semibold"
                asChild
                >
                <Link href="/restaurants">Explore Menu</Link>
                </Button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 relative mt-8 md:mt-0"
          >
            <div className="absolute inset-0 bg-[#7b1e3a] rounded-full opacity-5 blur-3xl scale-90"></div>
            <img
              src="/phone.svg" 
              alt="App Interface"
              className="relative z-10 w-3/4 md:w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}