"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Smartphone, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
    title: "Easy To Order",
    description: "Order food with just a few clicks anytime, anywhere via our app.",
  },
  {
    icon: Clock,
    color: "bg-orange-100 text-orange-600",
    title: "Fastest Delivery",
    description: "Our delivery partners ensure your food arrives hot and on time.",
  },
  {
    icon: Award,
    color: "bg-green-100 text-green-600",
    title: "Best Quality",
    description: "We partner with top-rated restaurants to ensure premium quality.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose <span className="text-[#7b1e3a]">Choweazy?</span>
          </h2>
          <p className="text-base md:text-lg text-gray-500">
            We don't just deliver food; we deliver happiness. Here is why thousands of users trust us.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-none shadow-none hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-[#fcfcfc] rounded-3xl overflow-hidden group">
                <CardContent className="p-6 md:p-8 text-center flex flex-col items-center h-full">
                  <div className={`mb-6 h-16 w-16 md:h-20 md:w-20 rounded-full ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}