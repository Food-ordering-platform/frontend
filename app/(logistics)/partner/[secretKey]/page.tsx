"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Wallet, Clock, Bell, Package, Star, 
  Share2, Phone, Utensils, HelpCircle,
  User, Store, ArrowRight, Building2, CreditCard, CheckCircle2, Landmark
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

export default function PartnerDashboard() {
  // --- RICH MOCK DATA ---
  const [data] = useState({
    partnerName: "Sefute Logistics",
    availableBalance: 45200,
    pendingBalance: 3000,
    stats: { totalJobs: 142, hoursOnline: 8.5, rating: 4.9 },
    activeOrders: [
      { 
        id: "ORD-9921", trackingId: "task-abc-111", status: "PREPARING", deliveryFee: 1500, 
        vendor: { name: "Mama Tega Kitchen", address: "Warri", phone: "08012345678" },
        customer: { name: "John Doe", address: "Effurun", phone: "09012345678" },
        items: ["2x Jollof Rice", "1x Plantain"]
      },
      { 
        id: "ORD-9922", trackingId: "task-abc-222", status: "OUT_FOR_DELIVERY", deliveryFee: 1200, 
        vendor: { name: "KFC Effurun", address: "Effurun", phone: "08122223333" },
        customer: { name: "Sarah Smith", address: "Airport Rd", phone: "07055554444" },
        items: ["Chicken Bucket", "Pepsi"]
      }
    ]
  });

  const [isPending, setIsPending] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({ bankName: "", accountNumber: "", accountName: "" });

  const handlePayoutSubmit = () => {
    if (data.availableBalance < 1000) return toast.error("Minimum withdrawal is ₦1,000");
    if (!bankDetails.accountNumber || bankDetails.accountNumber.length < 10) return toast.error("Invalid Account Number");
    setIsPending(true);
    setTimeout(() => {
      toast.success("Payout Request Sent! Funds will arrive in 24hrs.");
      setIsPending(false); setPayoutOpen(false);
    }, 2000);
  };

  const copyRiderLink = (trackingId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/ride/${trackingId}`)
      .then(() => toast.success("Job Link Copied!"))
      .catch(() => toast.error("Failed to copy."));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 font-sans">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-full border border-gray-100"><img src="/placeholder-logo.png" alt="ChowEazy" className="h-8 w-auto object-contain" /></div>
          <div className="h-5 w-[1px] bg-gray-200"></div>
          <div><p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Partner</p><h1 className="text-sm font-bold text-gray-900 leading-tight">{data.partnerName}</h1></div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-gray-100"><Bell className="h-5 w-5 text-gray-600" /></Button>
      </div>

      <div className="p-5 space-y-6">
        {/* WALLET CARD */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary to-[#a01c2f] text-white shadow-xl shadow-primary/30 p-6 h-52 flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="h-8 w-11 rounded-md bg-yellow-400/20 border border-yellow-400/40 relative overflow-hidden flex items-center justify-center"><div className="w-full h-[1px] bg-yellow-400/30"></div></div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></div><span className="text-[10px] font-bold uppercase">Active</span></div>
          </div>
          <div className="relative z-10 mt-2"><p className="text-white/70 text-xs font-medium tracking-wide mb-1">Total Available Balance</p><h1 className="text-4xl font-extrabold tracking-tight tabular-nums">₦{data.availableBalance.toLocaleString()}</h1></div>
          <div className="relative z-10 flex justify-between items-end"><p className="text-xs font-mono text-white/60 tracking-widest">**** **** 8821</p><div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><img src="/placeholder-logo.png" className="h-4 w-auto brightness-200 contrast-200 grayscale opacity-90" /></div></div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center"><p className="text-xs text-gray-400 font-medium mb-1">Total Jobs</p><div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-xl"><Package className="h-4 w-4 text-blue-500" /> {data.stats.totalJobs}</div></div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center"><p className="text-xs text-gray-400 font-medium mb-1">Hours</p><div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-xl"><Clock className="h-4 w-4 text-purple-500" /> {data.stats.hoursOnline}</div></div>
           <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center"><p className="text-xs text-gray-400 font-medium mb-1">Rating</p><div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-xl"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {data.stats.rating}</div></div>
        </div>

        {/* LIVE ACTIVITY FEED */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">Live Activity</h3>
          <div className="space-y-4">
            {data.activeOrders.map((order) => (
              <Sheet key={order.id}>
                <SheetTrigger asChild>
                  <Card className="group p-0 hover:bg-gray-50 transition-colors border-gray-100 shadow-sm cursor-pointer overflow-hidden">
                    <div className="bg-gray-50/50 p-3 border-b border-gray-100 flex justify-between items-center"><span className="text-xs font-bold text-gray-500">#{order.id.slice(-4)}</span><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status.replace(/_/g, " ")}</span></div>
                    <div className="p-4"><div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-4"><div className="relative"><div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 border-2 border-white"></div><p className="text-xs text-gray-400 font-bold uppercase">Pickup</p><p className="text-sm font-bold text-gray-900">{order.vendor.name}</p></div><div className="relative"><div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-white"></div><p className="text-xs text-primary font-bold uppercase">Dropoff</p><p className="text-sm font-bold text-gray-900">{order.customer.name}</p></div></div></div>
                  </Card>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] px-0"><div className="px-6 pt-4 pb-2"><SheetHeader className="text-left mb-4"><SheetTitle>Order #{order.id.slice(-4)}</SheetTitle></SheetHeader><Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl mb-6 shadow-md shadow-green-200 transition-transform active:scale-95" onClick={() => copyRiderLink(order.trackingId)}><Share2 className="mr-2 h-4 w-4" /> Share Job with Rider</Button></div></SheetContent>
              </Sheet>
            ))}
          </div>
        </div>
      </div>

      {/* --- FLOATING ACTION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-30 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex gap-3">
          
          {/* 🔥 PAYOUT MODAL (Redesigned) 🔥 */}
          <Sheet open={payoutOpen} onOpenChange={setPayoutOpen}>
            <SheetTrigger asChild>
              <Button className="flex-1 bg-gray-900 text-white shadow-lg shadow-gray-900/20 hover:bg-black h-12 rounded-xl text-sm font-bold transition-transform active:scale-[0.98]">
                Request Payout
              </Button>
            </SheetTrigger>
            
            <SheetContent side="bottom" className="rounded-t-[28px] p-0 overflow-hidden">
              {/* Modal Header Style */}
              <div className="bg-gray-50/80 border-b border-gray-100 p-6 pb-4">
                <SheetHeader className="text-left">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Landmark className="h-6 w-6 text-primary" />
                  </div>
                  <SheetTitle className="text-2xl font-extrabold text-gray-900">Withdraw Funds</SheetTitle>
                  <SheetDescription className="text-gray-500">
                    Transfer earnings to your bank account.
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-8">
                {/* Hero Amount Display */}
                <div className="text-center">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Available Balance</p>
                   <h2 className="text-5xl font-black text-primary tracking-tight flex items-center justify-center gap-1">
                     <span className="text-3xl self-start mt-2">₦</span>
                     {data.availableBalance.toLocaleString()}
                   </h2>
                </div>

                {/* Bank Details Form with Icons */}
                <div className="space-y-5">
                   <div className="space-y-2">
                      <Label htmlFor="bank" className="text-xs font-bold uppercase text-gray-500 ml-1">Bank Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="bank" placeholder="e.g. GTBank, Zenith" 
                          value={bankDetails.bankName} onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                          className="pl-12 h-14 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium text-base"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="account" className="text-xs font-bold uppercase text-gray-500 ml-1">Account Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="account" placeholder="0123456789" type="tel" maxLength={10}
                          value={bankDetails.accountNumber} onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                          className="pl-12 h-14 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-mono text-xl font-bold tracking-widest"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-500 ml-1">Account Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input 
                          id="name" placeholder="Account Holder Name" 
                          value={bankDetails.accountName} onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                          className="pl-12 h-14 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all font-medium text-base"
                        />
                      </div>
                   </div>
                </div>

                {/* Submit Button */}
                <Button 
                  className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl transition-transform active:scale-[0.98]"
                  onClick={handlePayoutSubmit} disabled={isPending}
                >
                  {isPending ? "Processing..." : `Confirm Withdrawal of ₦${data.availableBalance.toLocaleString()}`}
                </Button>
                
                <p className="text-center text-xs text-gray-400 font-medium">
                  Processed within 24 hours (Mon-Fri).
                </p>
              </div>
            </SheetContent>
          </Sheet>
          {/* -------------------- */}

          <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200 p-0 flex items-center justify-center">
             <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}