"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, easeOut } from "framer-motion";

const features = [
  {
    icon: "/order-1.svg",
    title: "Easy To Order",
    description: "You only order through the app",
  },
  {
    icon: "/delivery-1.svg",
    title: "Fastest Delivery",
    description: "Delivery will be on time",
  },
  {
    icon: "/courier-1.svg",
    title: "Best Quality",
    description: "The best quality of food for you",
  },
];

// Container for staggering children
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Card/heading animation
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function FeaturesSection() {
  return (
    <section className="section-padding bg-muted/30 text-center">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            variants={itemVariants}
          >
            Your Favorite Meals, <span className="text-[#7b1e3a]">Delivered Seamlessly</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-10"
            variants={itemVariants}
          >
            Fast delivery, secure payments, and quality meals from Warri’s best
            restaurants and beyond.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group hover:shadow-md transition-all duration-300 border-border/40 hover:border-primary/30 bg-card p-4 rounded-lg">
                  <CardContent className="p-4 text-center">
                    <div className="mb-4 flex justify-center">
                      <img
                        src={feature.icon}
                        alt={`${feature.title} icon`}
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
