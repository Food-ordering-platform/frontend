import { notFound } from "next/navigation"
import { getRestaurantById, getMenuItemsByRestaurantId } from "@/lib/data-service"
import { Header } from "@/components/layout/header"
import { RestaurantHeader } from "@/components/restaurants/restaurant-header"
import { MenuSection } from "@/components/restaurants/menu-section"

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await getRestaurantById(params.id)

  if (!restaurant) {
    notFound()
  }

  const menuItems = await getMenuItemsByRestaurantId(params.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <RestaurantHeader restaurant={restaurant} />
        <div className="container py-8">
          <MenuSection restaurant={restaurant} menuItems={menuItems} />
        </div>
      </main>
    </div>
  )
}
