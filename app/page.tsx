import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { RestaurantGrid } from "@/components/restaurants/restaurant-grid"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />

        <FeaturesSection />

        <section className="section-padding bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                Discover Amazing <span className="text-gradient-red">Restaurants</span>
              </h2>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Browse through our curated selection of top-rated restaurants and find your next favorite meal.
              </p>
            </div>
            <RestaurantGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
