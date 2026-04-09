"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, Download, CreditCard, Loader2, Plus } from "lucide-react";
import { 
  useGetLogisticsCompanies, 
  useCreateLogisticsCompany, 
  useDownloadSettlement, 
  useMarkCompanyPaid 
} from "@/services/admin/admin.queries";

export default function LogisticsManagementPage() {
  const { data: companies, isLoading } = useGetLogisticsCompanies();
  const createMutation = useCreateLogisticsCompany();
  const downloadMutation = useDownloadSettlement();
  const markPaidMutation = useMarkCompanyPaid();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    managerEmail: "",
    bankName: "",
    accountNumber: "",
    showEarningsToRiders: false,
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setFormData({ name: "", managerEmail: "", bankName: "", accountNumber: "", showEarningsToRiders: false });
      }
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Logistics Partners</h2>
          <p className="text-sm md:text-base text-gray-500">Manage fleet companies, download weekly settlements, and clear balances.</p>
        </div>

        {/* 🟢 Add Company Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7b1e3a] hover:bg-[#60152b]">
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Logistics Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCompany} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Swift Logistics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Manager Email</Label>
                <Input id="email" type="email" required value={formData.managerEmail} onChange={(e) => setFormData({...formData, managerEmail: e.target.value})} placeholder="manager@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank Name</Label>
                  <Input id="bank" required value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. OPay" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account Number</Label>
                  <Input id="account" required value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} placeholder="1234567890" />
                </div>
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Earnings to Riders?</Label>
                  <p className="text-xs text-gray-500">Turn OFF if the company pays a fixed salary.</p>
                </div>
                <Switch 
                  checked={formData.showEarningsToRiders} 
                  onCheckedChange={(checked) => setFormData({...formData, showEarningsToRiders: checked})} 
                />
              </div>
              <Button type="submit" className="w-full bg-[#7b1e3a] hover:bg-[#60152b]" disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Company"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🟢 The Data Table */}
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Company Info</TableHead>
                <TableHead>Invite Code</TableHead>
                <TableHead>Riders</TableHead>
                <TableHead>Settings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="animate-spin text-[#7b1e3a] mx-auto h-6 w-6" />
                  </TableCell>
                </TableRow>
              ) : companies?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-gray-500">No logistics partners registered yet.</TableCell>
                </TableRow>
              ) : (
                companies?.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-500">{company.managerEmail}</div>
                      <div className="text-xs text-gray-500">{company.bankName} - {company.accountNumber}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-gray-50">{company.inviteCode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">{company._count?.riders || 0} Active</Badge>
                    </TableCell>
                    <TableCell>
                      {company.showEarningsToRiders ? (
                        <span className="text-xs text-green-600 font-medium">Earnings Visible</span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">Earnings Hidden</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mb-1 sm:mb-0"
                        onClick={() => downloadMutation.mutate(company.id)}
                        disabled={downloadMutation.isPending}
                      >
                        <Download className="h-4 w-4 mr-1" /> Excel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if(confirm(`Are you sure you want to mark ${company.name} as paid? This will zero-out their balance.`)) {
                            markPaidMutation.mutate(company.id);
                          }
                        }}
                        disabled={markPaidMutation.isPending}
                      >
                        <CreditCard className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Mark Paid</span>
                      </Button>
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