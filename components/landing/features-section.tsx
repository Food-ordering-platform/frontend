"use client";

import { motion } from "framer-motion";
import { Clock, Star, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Sharp Sharp Delivery",
    description: "We don't do 'I dey come'. Delivery is fast, furious, and tracked in real-time.",
    icon: Clock,
    colSpan: "md:col-span-2",
    bg: "bg-gray-100",
  },
  {
    title: "Mama Put to 5-Star",
    description: "From roadside banga to premium grills. All inside one app.",
    icon: Star,
    colSpan: "md:col-span-1",
    bg: "bg-white border border-gray-200",
  },
  {
    title: "No Long Talk",
    description: "Verified vendors. Secure payments. Zero stress.",
    icon: ShieldCheck,
    colSpan: "md:col-span-3",
    bg: "bg-gray-50",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-6 mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Why Warri uses <span className="text-[#7b1e3a]">Choweazy</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${feature.colSpan} ${feature.bg} rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[250px] relative overflow-hidden group hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-full bg-[#7b1e3a]/10 flex items-center justify-center mb-6 text-[#7b1e3a]">
                  <feature.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative Circle on Hover */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#7b1e3a]/5 rounded-full transition-transform duration-500 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}