// app/admin/payouts/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle } from "lucide-react";

export default function PayoutsPage() {
  const mockPayouts = [
    { id: "P1", name: "Burger King Warri", type: "Vendor", amount: 45000, bank: "GTBank", account: "0123456789", status: "PENDING", date: "Today, 10:00 AM" },
    { id: "P2", name: "David The Rider", type: "Rider", amount: 12500, bank: "Opay", account: "8012345678", status: "PAID", date: "Yesterday, 2:00 PM" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payout Requests</h2>
          <p className="text-gray-500">Manually transfer funds, then mark as paid here.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Bank Details</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayouts.map((payout) => (
              <TableRow key={payout.id}>
                <TableCell>
                  <p className="font-bold text-gray-900">{payout.name}</p>
                  <p className="text-xs text-gray-500">{payout.type}</p>
                </TableCell>
                <TableCell className="font-bold text-[#7b1e3a]">₦{payout.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{payout.bank}</p>
                  <p className="text-xs text-gray-500 font-mono">{payout.account}</p>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{payout.date}</TableCell>
                <TableCell>
                  {payout.status === "PENDING" ? (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {payout.status === "PENDING" && (
                    <Button size="sm" className="bg-[#7b1e3a] hover:bg-[#60152b]">
                      <CheckCircle className="h-4 w-4 mr-1" /> Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}