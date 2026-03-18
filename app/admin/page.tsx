// app/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Store, Bike, CheckCircle2, XCircle, DollarSign, Wallet, Loader2 } from "lucide-react";
import { useGetAdminAnalytics } from "@/services/admin/admin.queries";

export default function AdminDashboard() {
  const { data: analytics, isLoading, isError } = useGetAdminAnalytics();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" /></div>;
  }

  if (isError || !analytics) {
    return <div className="text-red-500 p-4">Failed to load analytics data.</div>;
  }

  const formatMoney = (amount: number) => `₦${amount.toLocaleString()}`;

  const stats = [
    { title: "Total Revenue", value: formatMoney(analytics.revenue), icon: DollarSign, color: "text-green-600" },
    { title: "Platform Profit", value: formatMoney(analytics.profit), icon: Wallet, color: "text-[#7b1e3a]" },
    { title: "Orders Processed", value: analytics.totalOrders, icon: TrendingUp, color: "text-blue-600" },
    { title: "Orders Delivered", value: analytics.deliveredOrders, icon: CheckCircle2, color: "text-green-500" },
    { title: "Orders Failed/Cancelled", value: analytics.failedOrders, icon: XCircle, color: "text-red-500" },
    { title: "Total Customers", value: analytics.customers, icon: Users, color: "text-purple-600" },
    { title: "Active Vendors", value: analytics.vendors, icon: Store, color: "text-orange-500" },
    { title: "Active Riders", value: analytics.riders, icon: Bike, color: "text-teal-500" },
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