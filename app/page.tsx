import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/layout/footer"
import { TopPicksSection } from "@/components/landing/top-picks"
import { PaymentFeatureSection } from "@/components/landing/payment-feature"
import { FAQSection } from "../components/landing/faq-section"
import { VendorSection } from "@/components/landing/vendor-section" // Import New Component
import DownloadAppSection from "@/components/landing/download"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col gap-0">
        
        <HeroSection />

        <FeaturesSection />

        <TopPicksSection />

        <PaymentFeatureSection />

        {/* New Vendor Section */}
        <VendorSection />

        <DownloadAppSection />

         <FAQSection />
        
      </main>
      <Footer />
    </div>
  )
}