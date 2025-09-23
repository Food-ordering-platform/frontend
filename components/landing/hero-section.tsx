"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { motion, easeOut } from "framer-motion";

export function HeroSection() {
  const messages = [
    "Order your favorite pizza 🍕",
    "Get meals delivered fast 🚀",
    "Fresh drinks at your doorstep 🥤",
    "Hot & delicious chicken 🍗",
  ];

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const rightVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: easeOut } },
  };

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-br from-[#fffdfd] via-[#faf7f8] to-[#fffafc]">
      {/* Gradient blobs */}
      <div className="absolute top-[-5rem] left-[-5rem] w-72 h-72 rounded-full bg-[#7b1e3a]/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-6rem] w-80 h-80 rounded-full bg-[#f59e0b]/10 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-12">
          
          {/* Left copy (text) */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="order-2 md:order-1 text-center md:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium shadow-sm mx-auto md:mx-0">
              <Star className="h-4 w-4 text-[#7b1e3a]" />
              <span>Fast • Reliable • Delicious</span>
            </div>

            <h1 className="mb-4 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Why stay <span className="text-[#7b1e3a]">hungry</span>
              <br className="hidden sm:block" /> when you can order?
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#7b1e3a] mb-4 min-h-[2.5rem] sm:min-h-[3rem]">
              <Typewriter
                words={messages}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-prose mx-auto md:mx-0">
              Premium food delivery from the finest restaurants. Sit back and relax — we’ll take care of it.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="px-8 rounded-full bg-[#7b1e3a] hover:bg-[#66172e] text-white font-semibold"
                asChild
              >
                <Link href="/restaurants">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 rounded-full"
                asChild
              >
                <Link href="/restaurants">Browse Menus</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-bold">2,291+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">4.8/5</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">150+</p>
                <p className="text-sm text-gray-500">Couriers</p>
              </div>
            </div>
          </motion.div>

          {/* Right illustration (image + floating icons) */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative order-1 md:order-2 hidden md:block"
          >
            <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-lg mx-auto">
              <div className="relative h-full w-full rounded-2xl sm:rounded-3xl bg-white shadow-lg flex items-center justify-center overflow-hidden p-4 sm:p-6">
                <img
                  src="/order-food.svg"
                  alt="Food delivery illustration"
                  className="object-contain h-full w-full"
                />
                {/* Floating icons */}
                <img
                  src="/pizza.svg"
                  alt="pizza"
                  className="absolute top-6 left-6 w-10 sm:w-14 h-10 sm:h-14 animate-float"
                />
                <img
                  src="/soda.svg"
                  alt="drink"
                  className="absolute bottom-8 right-6 w-12 sm:w-16 h-12 sm:h-16 animate-float-slow"
                />
                <img
                  src="/chicken.svg"
                  alt="chicken"
                  className="absolute top-16 right-16 w-10 sm:w-12 h-10 sm:h-12 animate-float"
                />
                <img
                  src="/Group-8.svg"
                  alt="star"
                  className="absolute bottom-16 left-16 w-8 sm:w-10 h-8 sm:h-10 animate-float-slower"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
