import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Restaurants } from "@/components/restaurants/restaurant"

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="section-padding bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-balance">
                Discover Amazing <span className="text-gradient-red">Restaurants</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Browse through our curated selection of top-rated restaurants and find your next favorite meal.
              </p>
            </div>
            <Restaurants />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


