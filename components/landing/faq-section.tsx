"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much is delivery in Warri?",
    answer: "Delivery fees depend on the distance from the restaurant to your location, but we generally keep it very affordable, starting from ₦500.",
  },
  {
    question: "Can I pay with cash?",
    answer: "We primarily support card and bank transfers to ensure rider safety and speed, but some vendors may support pay-on-delivery.",
  },
  {
    question: "What areas do you cover?",
    answer: "We currently cover Effurun, DSC, Enerhen, and major parts of Warri metropolis. We are expanding every day!",
  },
  {
    question: "How do I become a vendor?",
    answer: "It's easy! Click on 'Contact Us' or download the app and sign up as a partner. We charge a standard 15% commission.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-[#faf9f8]">
      <div className="container px-6 mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Frequently <span className="text-[#7b1e3a]">Asked</span> Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-white border border-gray-200 rounded-2xl px-6 data-[state=open]:border-[#7b1e3a]/30 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}