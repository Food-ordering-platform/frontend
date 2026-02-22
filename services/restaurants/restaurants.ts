import { ApiResponse, Restaurant, MenuItem } from "@/types/restuarants.type"
import api from "../axios"

// Fetch all restaurants
export const getAllRestaurants = async (): Promise<ApiResponse<Restaurant[]>> => {
  try {
    const response = await api.get<ApiResponse<Restaurant[]>>("/restaurant")
    return response.data
  } catch (error: any) {
    console.error("Fetch restaurant error", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch restaurants")
  }
}

// Get particular restaurant
export const getRestaurantById = async (
  id: string
): Promise<ApiResponse<Restaurant>> => {
  try {
    const response = await api.get<ApiResponse<Restaurant>>(`/restaurant/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Fetch restaurant by ID error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch restaurant")
  }
}

// ✅ 2. Update restaurant info
export const updateRestaurant = async (
  id: string,
  data: Partial<Restaurant>
): Promise<ApiResponse<Restaurant>> => {
  try {
    const response = await api.put<ApiResponse<Restaurant>>(`/restaurant/${id}`, data)
    return response.data
  } catch (error: any) {
    console.error("Update restaurant error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to update restaurant")
  }
}




// ✅ 3. Create menu item
export const createMenuItem = async (
  restaurantId: string,
  data: Partial<MenuItem>
): Promise<ApiResponse<MenuItem>> => {
  try {
    const response = await api.post<ApiResponse<MenuItem>>(
      `/restaurant/${restaurantId}/menu`,
      data
    )
    return response.data
  } catch (error: any) {
    console.error("Create menu item error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to create menu item")
  }
}

//Get menu items for a restuarant
export const getMenuItems = async (restaurantId: string): Promise<ApiResponse<MenuItem[]>> => {
  try {
    const response = await api.get<ApiResponse<MenuItem[]>>(`/restaurant/${restaurantId}/menu`)
    return response.data
  } catch (error: any) {
    console.error("Menu fetch error for restaurant", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to fetch menu items")
  }
}


// ✅ 4. Update menu item
export const updateMenuItem = async (
  id: string,
  data: Partial<MenuItem>
): Promise<ApiResponse<MenuItem>> => {
  try {
    const response = await api.put<ApiResponse<MenuItem>>(`/menu/${id}`, data)
    return response.data
  } catch (error: any) {
    console.error("Update menu item error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to update menu item")
  }
}

// ✅ 5. Delete menu item
export const deleteMenuItem = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete<ApiResponse<null>>(`/menu/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Delete menu item error:", error.response?.data || error.message)
    throw new Error(error.response?.data?.message || "Failed to delete menu item")
  }
}
