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
  const [activeTab, setActiveTab] = useState("VENDOR"); // Default to VENDOR
  const { data: users, isLoading } = useGetAllUsers(activeTab);
  const approveMutation = useApproveUser();
  const deleteMutation = useDeleteUser();

  const UserTable = () => {
    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#7b1e3a]" /></div>;
    if (!users || users.length === 0) return <div className="p-8 text-center text-gray-500">No users found in this category.</div>;

    return (
      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {!user.isVerified && (
                    <Button 
                      size="sm" 
                      className="bg-[#7b1e3a] hover:bg-[#60152b]" 
                      onClick={() => approveMutation.mutate(user.id)}
                      disabled={approveMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
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
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-500">Approve, manage, and remove users across the platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="VENDOR" className="data-[state=active]:text-[#7b1e3a]">Vendors</TabsTrigger>
          <TabsTrigger value="RIDER" className="data-[state=active]:text-[#7b1e3a]">Riders</TabsTrigger>
          <TabsTrigger value="CUSTOMER" className="data-[state=active]:text-[#7b1e3a]">Customers</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <UserTable />
        </div>
      </Tabs>
    </div>
  );
}