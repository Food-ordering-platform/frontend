"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function SchedulingSection() {
  return (
    <section className="bg-white py-16 relative overflow-hidden">
      <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left: Floating Phone image */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <motion.img
            src="/delivery.svg"
            alt="Delivery App"
            className="w-full max-w-[280px] md:max-w-[380px] mx-auto object-contain"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-sm text-gray-500 mb-3 tracking-wide uppercase">
            Order Scheduling & Pickup
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Flexible{" "}
            <span className="text-[#7b1e3a]">Scheduling</span> & Pickup
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-prose mx-auto md:mx-0 leading-relaxed">
            Schedule your orders ahead of time and pick them up at your
            convenience. We make it easy and stress-free to get your meals
            exactly when you want them.
          </p>
          <Button
            size="lg"
            className="bg-[#7b1e3a] hover:bg-[#66172e] text-white px-8 py-3 rounded-full shadow-md font-semibold"
          >
            <Link href="/schedule">Order Schedule</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
