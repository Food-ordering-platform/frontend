// types/admin.type.ts

export interface AdminAnalytics {
  revenue: number;
  profit: number;
  totalOrders: number;
  deliveredOrders: number;
  failedOrders: number;
  customers: number;
  vendors: number;
  onlineRiders:number
  activeDeliveries:number
  riders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "RIDER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
}

export interface AdminPayout {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  category: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
    email: string;
  };
}

// Add this interface to your existing file
export interface AdminChartData {
  month: string;
  Revenue: number;
  Profit: number;
}