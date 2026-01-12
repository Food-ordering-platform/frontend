import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Restaurants } from "@/components/restaurants/restaurant"

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero / Header Section */}
        <section className="pt-24 pb-12 px-4 bg-gray-50/50">
          <div className="container mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Discover Amazing <span className="text-[#7b1e3a]">Restaurants</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Browse through our curated selection of top-rated spots and find your next favorite meal.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-24 pt-8 px-4">
          <div className="container mx-auto">
            <Restaurants />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}