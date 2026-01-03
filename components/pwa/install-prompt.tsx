"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Share, Plus, Download } from "lucide-react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    // @ts-ignore
    const isApp = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isApp);

    if (isApp) return; // Stop here if already installed

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. ANDROID / DESKTOP: Listen for the "beforeinstallprompt" event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
      setDeferredPrompt(e); // Stash the event so we can trigger it later
      
      // Delay opening the drawer slightly for better UX
      setTimeout(() => setOpen(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. IOS: Show prompt if on iOS (since iOS doesn't fire beforeinstallprompt)
    if (isIosDevice) {
      setTimeout(() => setOpen(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Handle the "Install" button click for Android
  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setOpen(false); // Close drawer on success
    }
  };

  // Don't render anything if app is installed OR if we haven't detected a valid install method yet
  if (isStandalone || (!isIOS && !deferredPrompt)) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center text-xl font-bold">Install ChowEazy</DrawerTitle>
          <DrawerDescription className="text-center text-gray-600">
            {isIOS 
              ? "Install our app for a better experience and faster ordering."
              : "Add ChowEazy to your home screen for quick access."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6">
          {isIOS ? (
            /* IOS INSTRUCTIONS (Manual) */
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Share className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">1. Tap the Share button</p>
                  <p className="text-sm text-gray-500">Look for the share icon in your browser bar.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Plus className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. Select "Add to Home Screen"</p>
                  <p className="text-sm text-gray-500">Scroll down or swipe left to find it.</p>
                </div>
              </div>
            </div>
          ) : (
            /* ANDROID ACTION (One-Click) */
            <div className="flex flex-col items-center gap-4">
               <div className="bg-green-100 p-4 rounded-full mb-2">
                  <Download className="h-8 w-8 text-green-600" />
               </div>
               <Button 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                onClick={handleAndroidInstall}
               >
                 Install App Now
               </Button>
               <p className="text-xs text-gray-400 text-center">
                 No download required. Uses almost no storage.
               </p>
            </div>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Maybe Later</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}