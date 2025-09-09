import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Heart, Truck } from "lucide-react"

const features = [
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "Get your favorite meals delivered in under 30 minutes with our optimized delivery network.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your payments and personal information are protected with bank-level security.",
  },
  {
    icon: Heart,
    title: "Quality Guaranteed",
    description: "We partner only with top-rated restaurants to ensure every meal meets our high standards.",
  },
  {
    icon: Truck,
    title: "Real-time Tracking",
    description: "Track your order from kitchen to doorstep with live updates and accurate delivery times.",
  },
]

export function FeaturesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Why Choose <span className="text-gradient-red">FoodOrder</span>?
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            We're committed to delivering not just food, but an exceptional experience that keeps you coming back.
          </p>
        </div>

        <div className="responsive-grid responsive-grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-red-light text-white group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
