import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItems,
} from "./restaurants"
import { Restaurant, MenuItem, ApiResponse } from "../../types/restuarants.type"
import { getMenuItemById } from "@/lib/data-service"

// ✅ Query: Fetch all restaurants
export const useRestaurants = () => {
  return useQuery<ApiResponse<Restaurant[]>, Error>({
    queryKey: ["restaurants"],
    queryFn: getAllRestaurants,
  })
}

// ✅ Query: Fetch a single restaurant by ID
export const useRestaurantById = (id: string) => {
  return useQuery<ApiResponse<Restaurant>, Error>({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
  })
}

// ✅ Mutation: Update restaurant info
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Restaurant> }) =>
      updateRestaurant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] })
      queryClient.invalidateQueries({ queryKey: ["restaurant"] })
    },
  })
}

// ✅ Mutation: Create menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      restaurantId,
      data,
    }: {
      restaurantId: string
      data: Partial<MenuItem>
    }) => createMenuItem(restaurantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant", variables.restaurantId] })
    },
  })
}

export const useMenuItemsByRestaurantId = (restaurantId: string) => {
  return useQuery<ApiResponse<MenuItem[]>, Error>({
    queryKey: ["menuItems", restaurantId],
    queryFn: () => getMenuItems(restaurantId), // <-- note the function wrapper
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 5,
  })
}

// ✅ Mutation: Update menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuItem> }) =>
      updateMenuItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] }) // refresh restaurant info
      queryClient.invalidateQueries({ queryKey: ["menu", variables.id] }) // optional if you track individual menu
    },
  })
}

// ✅ Mutation: Delete menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] }) // refresh restaurant menus
    },
  })
}
