"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Store, Bike, CheckCircle2, XCircle, DollarSign, Wallet, Loader2 } from "lucide-react";
import { useGetAdminAnalytics, useGetAdminChartAnalytics } from "@/services/admin/admin.queries";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const { data: analytics, isLoading: isStatsLoading, isError: isStatsError } = useGetAdminAnalytics();
  const { data: chartData, isLoading: isChartLoading } = useGetAdminChartAnalytics();

  if (isStatsLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" /></div>;
  }

  if (isStatsError || !analytics) {
    return <div className="text-red-500 p-4">Failed to load analytics data.</div>;
  }

  const formatMoney = (amount: number) => `₦${amount.toLocaleString()}`;

  // 🟢 UPDATED: Labels changed to reflect exact "Paid" states and "Total" counts
  const stats = [
    { title: "Total Revenue", value: formatMoney(analytics.revenue), icon: DollarSign, color: "text-green-600" },
    { title: "Platform Profit", value: formatMoney(analytics.profit), icon: Wallet, color: "text-[#7b1e3a]" },
    { title: "Total Paid Orders", value: analytics.totalOrders, icon: TrendingUp, color: "text-blue-600" },
    { title: "Orders Delivered", value: analytics.deliveredOrders, icon: CheckCircle2, color: "text-green-500" },
    { title: "Orders Failed", value: analytics.failedOrders, icon: XCircle, color: "text-red-500" },
    { title: "Total Customers", value: analytics.customers, icon: Users, color: "text-purple-600" },
    { title: "Total Vendors", value: analytics.vendors, icon: Store, color: "text-orange-500" },
    { title: "Total Riders", value: analytics.riders, icon: Bike, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-500 text-sm">Real-time metrics for the ChowEazy platform.</p>
      </div>
      
      {/* The Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full bg-gray-50 ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* The Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue & Profit Growth</CardTitle>
            <CardDescription>Last 6 Months</CardDescription>
          </CardHeader>
          <CardContent>
            {isChartLoading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-300 h-8 w-8" />
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, undefined]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Revenue" fill="#1f2937" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Profit" fill="#7b1e3a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 🟢 NEW: Users & Fleet Status Panel */}
        <Card className="shadow-sm border-gray-200 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Users & Fleet Status</CardTitle>
            <CardDescription>Live platform activity</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
             
             {/* Total User Breakdown */}
             <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                    <span className="font-medium text-gray-700">Customers</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.customers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="font-medium text-gray-700">Vendors</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.vendors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                    <span className="font-medium text-gray-700">Total Fleet</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.riders}</span>
                </div>
             </div>

             {/* Live Fleet Status Section */}
             <div className="mt-auto pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Rider Activity</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       {/* Glowing dot for "Online" */}
                       <div className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                       </div>
                       <span className="font-medium text-gray-700">Available Online</span>
                     </div>
                     <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{analytics.onlineRiders}</span>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                       <span className="font-medium text-gray-700">Out for Delivery</span>
                     </div>
                     <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{analytics.activeDeliveries}</span>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}