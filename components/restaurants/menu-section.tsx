import type { Restaurant, MenuItem } from "@/lib/types"
import { MenuItemCard } from "@/components/menu/menu-item-card"

interface MenuSectionProps {
  restaurant: Restaurant
  menuItems: MenuItem[]
}

export function MenuSection({ restaurant, menuItems }: MenuSectionProps) {
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Menu</h2>

      {categories.map((category) => {
        const categoryItems = menuItems.filter((item) => item.category === category)

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">{category}</h3>
            <div className="space-y-4">
              {categoryItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
