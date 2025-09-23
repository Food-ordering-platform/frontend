"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, Variants, easeOut } from "framer-motion";

// Container variant to stagger children
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Item variant for text and image
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function PaymentSection() {
  return (
    <section className="bg-black py-0 relative overflow-hidden">
      {/* Wave top cut-out */}
      <div className="relative">
        <svg
          className="w-full h-20 text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="white"
        >
          <path d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,165.3C672,171,768,181,864,165.3C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,0L0,0Z"></path>
        </svg>
      </div>

      <motion.div
        className="container relative z-10 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Main white card */}
        <motion.div
          className="relative bg-gradient-to-br from-white via-[#fdfdfd] to-[#f7f7f7] rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12"
          variants={itemVariants}
        >
          {/* Decorative blur spots */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-[#7b1e3a]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#7b1e3a]/20 rounded-full blur-3xl"></div>

          {/* Left text */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left text-gray-900 relative z-10"
            variants={itemVariants}
          >
            <p className="text-sm text-gray-500 mb-3 tracking-wide uppercase">
              Easy Payment Options
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Easy and Reliable <span className="text-[#7b1e3a]">Payment</span> Options
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-prose mx-auto md:mx-0 leading-relaxed">
              Manage your orders with secure and flexible payment methods designed
              to make your experience seamless and stress-free.
            </p>
            <Button
              size="lg"
              className="bg-[#7b1e3a] hover:bg-[#66172e] text-white px-8 py-3 rounded-full shadow-md font-semibold transition-transform hover:scale-105"
            >
              <Link href="/payment">Check Now</Link>
            </Button>
          </motion.div>

          {/* Right SVG */}
          <motion.div
            className="w-full md:w-1/2 flex justify-center relative z-10"
            variants={itemVariants}
            whileHover={{ rotate: 2, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="absolute top-0 left-1/4 w-72 h-96 bg-[#7b1e3a]  rounded-3xl shadow-2xl transform -rotate-6 z-0 hidden md:block"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="absolute bottom-0 right-1/4 w-72 h-96 bg-white rounded-3xl shadow-2xl transform rotate-6 z-0 hidden md:block"
            ></motion.div>
            <img
              src="/Mobile-payment.svg"
              alt="Mobile Payment"
              className="w-full max-w-[300px] md:max-w-[400px] object-contain drop-shadow-xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Wave bottom cut-out */}
      <div className="relative -mt-1">
        <svg
          className="w-full h-20 text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="white"
        >
          <path d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,144C672,139,768,149,864,170.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
