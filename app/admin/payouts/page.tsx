// app/admin/payouts/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import { useGetPayouts, useMarkPayoutPaid } from "@/services/admin/admin.queries";

export default function PayoutsPage() {
  const { data: payouts, isLoading } = useGetPayouts();
  const payMutation = useMarkPayoutPaid();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#7b1e3a]" /></div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex justify-between items-start">
        <div>
          {/* 🟢 Responsive header text */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Payout Requests</h2>
          <p className="text-sm md:text-base text-gray-500">Manually transfer funds, then mark as paid here.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        {/* 🟢 Added overflow-x-auto to make the table scroll horizontally on mobile */}
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">User</TableHead>
                <TableHead className="whitespace-nowrap">Amount</TableHead>
                <TableHead className="whitespace-nowrap">Requested</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No payout requests found.</TableCell>
                </TableRow>
              ) : (
                payouts?.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="whitespace-nowrap">
                      <p className="font-bold text-gray-900">{payout.user.name}</p>
                      <p className="text-xs text-gray-500">{payout.user.role}</p>
                    </TableCell>
                    <TableCell className="font-bold text-[#7b1e3a] whitespace-nowrap">₦{payout.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">{new Date(payout.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {payout.status === "PENDING" ? (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {payout.status === "PENDING" && (
                        <Button 
                          size="sm" 
                          className="bg-[#7b1e3a] hover:bg-[#60152b]"
                          onClick={() => {
                            if(confirm("Confirm you have sent the funds manually?")) {
                              payMutation.mutate(payout.id);
                            }
                          }}
                          disabled={payMutation.isPending}
                        >
                          {payMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Mark Paid</span></>}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}