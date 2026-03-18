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
    // 🟢 Added px-4 md:px-0 so it doesn't touch the screen edges on mobile
    <div className="space-y-6 pb-10 px-4 md:px-0">
      <div>
        {/* 🟢 Responsive text sizing */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-500 text-xs md:text-sm">Real-time metrics for the ChowEazy platform.</p>
      </div>
      
      {/* 🟢 The Stats Grid: Changed to grid-cols-2 on mobile instead of 1 so it doesn't take up the whole screen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="shadow-sm border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-4">
                {/* 🟢 Smaller text on mobile to fit the 2-column layout */}
                <CardTitle className="text-xs md:text-sm font-semibold text-gray-500 truncate mr-2">{stat.title}</CardTitle>
                <div className={`p-1.5 md:p-2 rounded-full bg-gray-50 ${stat.color} bg-opacity-10 shrink-0`}>
                  <Icon className={`h-3 w-3 md:h-4 md:w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
                {/* 🟢 Shrunk the numbers slightly on mobile to prevent text wrapping */}
                <div className="text-lg md:text-2xl font-black text-gray-900 truncate">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* The Analytics Charts */}
      {/* 🟢 Stack vertically on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-8">
        
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-bold">Revenue & Profit Growth</CardTitle>
            <CardDescription className="text-xs md:text-sm">Last 6 Months</CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-6 md:pt-0">
            {isChartLoading ? (
              <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-300 h-8 w-8" />
              </div>
            ) : (
              // 🟢 Slightly shorter chart on mobile
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {/* 🟢 Adjusted left margin so mobile values like "₦150k" don't get cut off the screen */}
                  <BarChart data={chartData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      formatter={(value: number) => [`₦${value.toLocaleString()}`, undefined]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Bar dataKey="Revenue" fill="#1f2937" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Profit" fill="#7b1e3a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users & Fleet Status Panel */}
        <Card className="shadow-sm border-gray-200 flex flex-col">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-bold">Users & Fleet Status</CardTitle>
            <CardDescription className="text-xs md:text-sm">Live platform activity</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 md:p-6 md:pt-0 pt-0">
             
             {/* Total User Breakdown */}
             <div className="space-y-4 md:space-y-5 pt-2">
                <div className="flex items-center justify-between text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-purple-600"></div>
                    <span className="font-medium text-gray-700">Customers</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.customers}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-orange-500"></div>
                    <span className="font-medium text-gray-700">Vendors</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.vendors}</span>
                </div>
                <div className="flex items-center justify-between text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-teal-500"></div>
                    <span className="font-medium text-gray-700">Total Fleet</span>
                  </div>
                  <span className="font-bold text-gray-900">{analytics.riders}</span>
                </div>
             </div>

             {/* Live Fleet Status Section */}
             <div className="mt-6 md:mt-auto pt-5 md:pt-6 border-t border-gray-100">
                <h4 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">Live Rider Activity</h4>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between text-sm md:text-base">
                     <div className="flex items-center gap-3">
                       <div className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-green-500"></span>
                       </div>
                       <span className="font-medium text-gray-700">Available Online</span>
                     </div>
                     <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs md:text-sm">{analytics.onlineRiders}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm md:text-base">
                     <div className="flex items-center gap-3">
                       <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-blue-500"></div>
                       <span className="font-medium text-gray-700">Out for Delivery</span>
                     </div>
                     <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs md:text-sm">{analytics.activeDeliveries}</span>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}