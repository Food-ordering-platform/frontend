// app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Loader2 } from "lucide-react";
import { useGetAllUsers, useApproveUser, useDeleteUser } from "@/services/admin/admin.queries";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("VENDOR");
  const { data: users, isLoading } = useGetAllUsers(activeTab);
  const approveMutation = useApproveUser();
  const deleteMutation = useDeleteUser();

  const UserTable = () => {
    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#7b1e3a]" /></div>;
    if (!users || users.length === 0) return <div className="p-8 text-center text-gray-500">No users found in this category.</div>;

    return (
      <Card className="shadow-sm">
        {/* 🟢 Added overflow-x-auto to make the table scroll horizontally on mobile */}
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Joined</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.isVerified ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap space-x-2">
                    {!user.isVerified && (
                      <Button 
                        size="sm" 
                        className="bg-[#7b1e3a] hover:bg-[#60152b] mb-1 sm:mb-0" 
                        onClick={() => approveMutation.mutate(user.id)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Approve</span>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={() => {
                          if(confirm("Are you sure you want to delete this user?")) deleteMutation.mutate(user.id)
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div>
        {/* 🟢 Responsive header text */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-sm md:text-base text-gray-500">Approve, manage, and remove users across the platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* 🟢 Added flex-wrap for smaller screens so the tabs don't squish */}
        <TabsList className="bg-gray-100 flex flex-wrap h-auto w-full justify-start">
          <TabsTrigger value="VENDOR" className="data-[state=active]:text-[#7b1e3a] flex-1 sm:flex-none">Vendors</TabsTrigger>
          <TabsTrigger value="RIDER" className="data-[state=active]:text-[#7b1e3a] flex-1 sm:flex-none">Riders</TabsTrigger>
          <TabsTrigger value="CUSTOMER" className="data-[state=active]:text-[#7b1e3a] flex-1 sm:flex-none">Customers</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <UserTable />
        </div>
      </Tabs>
    </div>
  );
}