// app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2 } from "lucide-react";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("vendors");

  // Mock data for frontend implementation
  const mockUsers = [
    { id: "1", name: "Mama Put Extravaganza", email: "mama@test.com", role: "VENDOR", isVerified: false, date: "2026-03-18" },
    { id: "2", name: "John Doe", email: "john@rider.com", role: "RIDER", isVerified: true, date: "2026-03-15" },
    { id: "3", name: "Alice Smith", email: "alice@customer.com", role: "CUSTOMER", isVerified: true, date: "2026-03-10" },
  ];

  const handleApprove = (id: string) => {
    console.log("Approve user:", id);
    // Future: approveMutation.mutate(id)
  };

  const UserTable = ({ roleFilter }: { roleFilter: string }) => {
    const filteredUsers = mockUsers.filter(u => u.role === roleFilter);

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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {!user.isVerified && (
                    <Button size="sm" className="bg-[#7b1e3a] hover:bg-[#60152b]" onClick={() => handleApprove(user.id)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100">
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
          <TabsTrigger value="vendors" className="data-[state=active]:text-[#7b1e3a]">Vendors</TabsTrigger>
          <TabsTrigger value="riders" className="data-[state=active]:text-[#7b1e3a]">Riders</TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:text-[#7b1e3a]">Customers</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="vendors"><UserTable roleFilter="VENDOR" /></TabsContent>
          <TabsContent value="riders"><UserTable roleFilter="RIDER" /></TabsContent>
          <TabsContent value="customers"><UserTable roleFilter="CUSTOMER" /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}