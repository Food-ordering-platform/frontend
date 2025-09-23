"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, UtensilsCrossed, Truck, CheckCircle2 } from "lucide-react"

const steps = [
  {
    icon: Smartphone,
    title: "Browse & choose",
    description: "Explore top restaurants and discover your next favorite meal.",
  },
  {
    icon: UtensilsCrossed,
    title: "Customize order",
    description: "Add special instructions and pick exactly what you want.",
  },
  {
    icon: Truck,
    title: "Track delivery",
    description: "Follow your courier in real time from kitchen to door.",
  },
  {
    icon: CheckCircle2,
    title: "Enjoy",
    description: "Sit back, relax, and savor your meal. Bon appétit!",
  },
]

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From discovery to delivery in minutes. Simple, fast, delightful.
          </p>
        </div>

        <div className="responsive-grid responsive-grid-cols-4">
          {steps.map((s, i) => (
            <Card key={i} className="bg-card border-border/60">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-red-light text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                <p className="text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


