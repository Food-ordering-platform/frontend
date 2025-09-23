import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/layout/footer"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { RestaurantSection } from "@/components/landing/coverage-section"
import { PaymentSection } from "@/components/landing/paymentSection"
import { SchedulingSection } from "@/components/landing/scheduleSection"
import Banner from "@/components/landing/download"





export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />

        <FeaturesSection />

        <RestaurantSection />

        <PaymentSection />

        <SchedulingSection />

        <Banner />


        
      </main>

      <Footer />
    </div>
  )
}