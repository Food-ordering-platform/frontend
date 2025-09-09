// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// class ApiClient {
//   private baseURL: string
//   private token: string | null = null

//   constructor(baseURL: string) {
//     this.baseURL = baseURL
//     // Get token from localStorage if available
//     if (typeof window !== "undefined") {
//       this.token = localStorage.getItem("auth_token")
//     }
//   }

//   setToken(token: string) {
//     this.token = token
//     if (typeof window !== "undefined") {
//       localStorage.setItem("auth_token", token)
//     }
//   }

//   clearToken() {
//     this.token = null
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("auth_token")
//     }
//   }

//   private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${this.baseURL}${endpoint}`
//     const headers: HeadersInit = {
//       "Content-Type": "application/json",
//       ...options.headers,
//     }

//     if (this.token) {
//       headers.Authorization = `Bearer ${this.token}`
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//     })

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ error: "Network error" }))
//       throw new Error(error.error || `HTTP ${response.status}`)
//     }

//     return response.json()
//   }

//   // Auth methods
//   async login(email: string, password: string) {
//     const response = await this.request<{
//       token: string
//       user: any
//     }>("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     })

//     this.setToken(response.token)
//     return response
//   }

//   async register(userData: {
//     name: string
//     email: string
//     password: string
//     phone?: string
//     address?: string
//   }) {
//     const response = await this.request<{
//       token: string
//       user: any
//     }>("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(userData),
//     })

//     this.setToken(response.token)
//     return response
//   }

//   // Restaurant methods
//   async getRestaurants(filters?: { cuisine?: string; search?: string }) {
//     const params = new URLSearchParams()
//     if (filters?.cuisine) params.append("cuisine", filters.cuisine)
//     if (filters?.search) params.append("search", filters.search)

//     const queryString = params.toString()
//     return this.request<any[]>(`/restaurants${queryString ? `?${queryString}` : ""}`)
//   }

//   async getRestaurant(id: number) {
//     return this.request<any>(`/restaurants/${id}`)
//   }

//   // Order methods
//   async createOrder(orderData: {
//     restaurantId: number
//     items: any[]
//     deliveryAddress: string
//     specialInstructions?: string
//   }) {
//     return this.request<any>("/orders", {
//       method: "POST",
//       body: JSON.stringify(orderData),
//     })
//   }

//   async getOrders() {
//     return this.request<any[]>("/orders")
//   }

//   async getOrder(id: number) {
//     return this.request<any>(`/orders/${id}`)
//   }

//   async updateOrderStatus(id: number, status: string) {
//     return this.request<any>(`/orders/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     })
//   }
// }

// export const apiClient = new ApiClient(API_BASE_URL)
