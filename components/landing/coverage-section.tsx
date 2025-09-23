"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, easeOut } from "framer-motion";

export function RestaurantSection() {
  // Variants for container to stagger children
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  // Variants for items (image/text)
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <section className="bg-[#faf7f8] text-gray-800 relative overflow-hidden py-16 md:py-24">
      <motion.div
        className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Left image */}
        <motion.div
          className="relative w-full md:w-1/2 flex justify-center"
          variants={itemVariants}
        >
          {/* SVG ellipse rings */}
          <svg
            className="absolute w-[140%] md:w-[120%] h-[140%] md:h-[120%] -z-10 opacity-30"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="250"
              cy="250"
              rx="200"
              ry="200"
              stroke="#7b1e3a"
              strokeWidth="0.6"
            />
            <ellipse
              cx="250"
              cy="250"
              rx="150"
              ry="150"
              stroke="#7b1e3a"
              strokeWidth="0.6"
            />
            <ellipse
              cx="250"
              cy="250"
              rx="100"
              ry="100"
              stroke="#7b1e3a"
              strokeWidth="0.6"
            />
          </svg>

          <img
            src="/phone.svg"
            alt="Mobile App"
            className="w-3/4 sm:w-2/3 md:max-w-md mx-auto object-contain relative z-10"
          />
        </motion.div>

        {/* Right text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          variants={itemVariants}
        >
          <p className="text-xs sm:text-sm text-gray-500 mb-3 tracking-wide uppercase">
            Explore Varieties of Restaurants & Food
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-snug">
            Choose your <span className="text-[#7b1e3a]">restaurant</span> and
            order your meal
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-prose mx-auto md:mx-0 leading-relaxed">
            Shop for your favorite meals or drinks with different varieties and
            enjoy every moment of it.
          </p>
          <Button
            size="lg"
            className="bg-[#7b1e3a] hover:bg-[#66172e] text-white px-8 sm:px-10 py-3 rounded-full shadow-lg"
          >
            <Link href="/restaurants">Order Now</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
