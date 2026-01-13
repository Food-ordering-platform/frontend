import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-950 text-white border-t-4 border-[#7b1e3a]">
      <div className="container mx-auto px-6 py-16">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Image */}
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-0.5">
                 <Image 
                    src="/official_logo.svg" 
                    alt="ChowEazy Logo"
                    fill
                    className="object-cover"
                 />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Chow<span className="text-[#7b1e3a]">eazy</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">
              We bring the chow come meet you. Experience premium food delivery from the finest vendors in Warri. Sharp sharp.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="bg-neutral-800 p-2.5 rounded-full text-white hover:bg-[#7b1e3a] transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-neutral-800 p-2.5 rounded-full text-white hover:bg-[#7b1e3a] transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-neutral-800 p-2.5 rounded-full text-white hover:bg-[#7b1e3a] transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200 flex items-center gap-2">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200 flex items-center gap-2">
                  <span>Find Restaurants</span>
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200 flex items-center gap-2">
                  <span>Become a Vendor</span>
                </Link>
              </li>
              <li>
                <Link href="/ride" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200 flex items-center gap-2">
                  <span>Ride for ChowEazy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Support</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white hover:pl-1 transition-all duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Contact Us</h4>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#7b1e3a] shrink-0 mt-0.5" />
                <span className="text-gray-300">Warri, Delta State,<br/>Nigeria.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#7b1e3a] shrink-0" />
                <span className="text-gray-300">+234 812 345 6789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#7b1e3a] shrink-0" />
                <span className="text-gray-300">support@choweazy.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <p className="text-gray-400 text-xs">
                © {currentYear} ChowEazy. All rights reserved.
              </p>
              <p className="text-gray-500 text-[10px] mt-1">
                 A Naturenest Global Company.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}