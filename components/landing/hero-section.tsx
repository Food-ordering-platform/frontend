import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Clock, Truck } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-red section-padding">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/hero-pattern.jpg')] opacity-10" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center text-white">
          {/* Hero Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Star className="h-4 w-4 fill-current" />
            <span>Rated #1 Food Delivery Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
            Elevate Your
            <br />
            <span className="bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Dining Experience
            </span>
          </h1>

          {/* Subheading */}
          <p className="mb-8 text-xl leading-relaxed text-white/90 text-pretty md:text-2xl">
            Order from the finest restaurants and get premium meals delivered to your door in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-4 text-lg"
              asChild
            >
              <Link href="#restaurants">
                Order Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold px-8 py-4 text-lg"
            >
              Browse Restaurants
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Clock className="h-6 w-6" />
                <span>25 min</span>
              </div>
              <p className="text-white/80">Average delivery time</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Star className="h-6 w-6 fill-current" />
                <span>4.8/5</span>
              </div>
              <p className="text-white/80">Customer satisfaction</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Truck className="h-6 w-6" />
                <span>500+</span>
              </div>
              <p className="text-white/80">Partner restaurants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="hsl(var(--background))"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  )
}
