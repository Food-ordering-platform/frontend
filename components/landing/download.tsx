"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function DownloadAppSection() {
  return (
    <section className="bg-[#7b1e3a] py-12 md:py-16 overflow-hidden relative">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left text-white z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Warri's hunger stopper.
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-lg mx-auto md:mx-0">
              Get the best food delivered to your doorstep. Download ChowEazy now.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button className="h-12 bg-black text-white hover:bg-gray-900 rounded-xl px-5 flex items-center gap-2 border border-white/10">
                <FaApple size={20} />
                <div className="text-left">
                  <div className="text-[9px] uppercase font-semibold opacity-80">Download on the</div>
                  <div className="text-xs font-bold leading-none">App Store</div>
                </div>
              </Button>
              <Button className="h-12 bg-black text-white hover:bg-gray-900 rounded-xl px-5 flex items-center gap-2 border border-white/10">
                <FaGooglePlay size={18} />
                <div className="text-left">
                  <div className="text-[9px] uppercase font-semibold opacity-80">Get it on</div>
                  <div className="text-xs font-bold leading-none">Google Play</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Phone Image - Reduced Size */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-[300px] md:h-[400px]">
             {/* Gradient glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-white/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative h-full w-full flex items-end justify-center md:justify-end">
                <Image
                src="/Mockup.svg"
                alt="ChowEazy App"
                width={350} // Reduced width
                height={500}
                className="object-contain max-h-full drop-shadow-2xl"
                />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}