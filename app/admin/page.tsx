// app/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, Users, Store, Bike, CheckCircle2, XCircle, DollarSign, Wallet 
} from "lucide-react";

export default function AdminDashboard() {
  // In the future, this data will come from a React Query hook: useGetAdminAnalytics()
  const mockAnalytics = {
    revenue: 1250000,
    profit: 187500, // 15% platform fee
    totalOrders: 450,
    deliveredOrders: 412,
    failedOrders: 15,
    customers: 1200,
    vendors: 45,
    riders: 28,
  };

  const formatMoney = (amount: number) => `₦${amount.toLocaleString()}`;

  const stats = [
    { title: "Total Revenue", value: formatMoney(mockAnalytics.revenue), icon: DollarSign, color: "text-green-600" },
    { title: "Platform Profit", value: formatMoney(mockAnalytics.profit), icon: Wallet, color: "text-[#7b1e3a]" },
    { title: "Orders Processed", value: mockAnalytics.totalOrders, icon: TrendingUp, color: "text-blue-600" },
    { title: "Orders Delivered", value: mockAnalytics.deliveredOrders, icon: CheckCircle2, color: "text-green-500" },
    { title: "Orders Failed/Cancelled", value: mockAnalytics.failedOrders, icon: XCircle, color: "text-red-500" },
    { title: "Total Customers", value: mockAnalytics.customers, icon: Users, color: "text-purple-600" },
    { title: "Active Vendors", value: mockAnalytics.vendors, icon: Store, color: "text-orange-500" },
    { title: "Active Riders", value: mockAnalytics.riders, icon: Bike, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}