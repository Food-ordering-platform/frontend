"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, easeOut, easeInOut } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const DownloadAppSection: React.FC = () => {
  // Controls for container (card + most children) and for phone (separate sequence + float)
  const containerControls = useAnimation();
  const phoneControls = useAnimation();

  useEffect(() => {
    // sequence: run container animation (and child stagger), then animate phone entrance,
    // then start infinite floating for phone
    async function sequence() {
      // animate container -> "show" variant (this triggers itemVariants for children)
      await containerControls.start("show");

      // animate phone entrance to settle (opacity + y -> 0), then kick off float loop
      await phoneControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easeOut },
      });

      // start continuous floating (does NOT touch opacity)
      phoneControls.start({
        y: [0, -10, 0],
        transition: { duration: 4, repeat: Infinity, ease: easeInOut },
      });
    }
    sequence();
  }, [containerControls, phoneControls]);

  // Parent/card + children variants: card also uses same variant name so it animates in,
  // and children follow with stagger.
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <section className="relative bg-[#7b1e3a] overflow-hidden">
      {/* Top wave curve */}
      <div className="relative">
        <svg
          className="w-full h-20 text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="white"
        >
          <path d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,165.3C672,171,768,181,864,165.3C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,0L0,0Z" />
        </svg>
      </div>

      <div className="container mx-auto relative z-10 py-28">
        {/* Main white card animated as container */}
        <motion.div
          initial="hidden"
          animate={containerControls}
          variants={containerVariants}
          className="relative bg-white rounded-[2.5rem] shadow-2xl p-4 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden"
        >
          {/* Decorative blur spots (these are static visual elements but appear with itemVariants) */}
          <motion.div
            variants={itemVariants}
            className="absolute -top-12 -left-12 w-44 h-44 bg-[#7b1e3a]/10 rounded-full blur-3xl"
          />
          <motion.div
            variants={itemVariants}
            className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#7b1e3a]/20 rounded-full blur-3xl"
          />

          {/* Left text - part of the container stagger */}
          <motion.div
            variants={itemVariants}
            className="w-full lg:w-1/2 text-center lg:text-left relative z-10"
          >
            <p className="text-sm text-gray-500 mb-3 tracking-wide uppercase">
              Download App
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-black">
              Get Started With <span className="text-[#7b1e3a]">FoodOrder</span>{" "}
              Today!
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-prose mx-auto lg:mx-0 leading-relaxed">
              Discover food wherever and whenever. Get your favorite meals
              delivered quickly to your doorstep.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-black hover:bg-black/80 text-white px-8 py-3 rounded-full shadow-md font-semibold transition-transform hover:scale-105 flex items-center gap-2"
                onClick={() =>
                  window.open("https://www.apple.com/app-store/", "_blank")
                }
              >
                <FaApple size={20} />
                Download on the App Store
              </Button>

              <Button
                size="lg"
                className="bg-black hover:bg-black/80 text-white px-8 py-3 rounded-full shadow-md font-semibold transition-transform hover:scale-105 flex items-center gap-2"
                onClick={() => window.open("https://play.google.com", "_blank")}
              >
                <FaGooglePlay size={20} />
                Get it on Google Play
              </Button>
            </div>
          </motion.div>

          {/* Right phone + shadow cards.
              NOTE: phone uses its own animation controller (phoneControls) so we can:
               1) animate entrance after the container finishes, and
               2) start an infinite float loop that does not re-trigger the entrance
          */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center px-6 lg:px-0">
            {/* Shadow card 1 (staggered via containerVariants) */}
            <motion.div
              variants={itemVariants}
              className="absolute top-0 left-1/4 w-72 h-96 bg-black rounded-3xl shadow-2xl transform -rotate-6 z-0 hidden md:block"
            />

            {/* Shadow card 2 */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-0 right-1/4 w-72 h-96 bg-white rounded-3xl shadow-2xl transform rotate-6 z-0 hidden md:block"
            />

            {/* Phone image: controlled separately so it enters once and then floats */}
            <motion.img
              src="/Download-pana.svg"
              alt="FoodOrder App"
              className="relative h-80 md:h-[400px] object-contain z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={phoneControls} // controlled in useEffect sequence
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom wave curve */}
      <div className="relative -mt-1">
        <svg
          className="w-full h-20 text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="white"
        >
          <path d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,144C672,139,768,149,864,170.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L0,320Z" />
        </svg>
      </div>
    </section>
  );
};

export default DownloadAppSection;
