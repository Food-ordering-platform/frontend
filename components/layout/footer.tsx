import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-950 text-white border-t-4 border-[#7b1e3a]">
      <div className="container mx-auto px-6 py-12">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo Image */}
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/5 p-1">
                 <Image 
                    src="/official_logo.svg" 
                    alt="ChowEazy Logo"
                    fill
                    className="object-cover"
                 />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[#7b1e3a] transition-colors">
                Chow<span className="text-[#7b1e3a]">eazy</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              We bring the chow come meet you. Experience premium food delivery from the finest vendors in Warri. Sharp sharp.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-[#7b1e3a] hover:text-white transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-[#7b1e3a] hover:text-white transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="bg-white/5 p-2 rounded-full text-gray-400 hover:bg-[#7b1e3a] hover:text-white transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#7b1e3a] transition-colors flex items-center gap-2">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-gray-400 hover:text-[#7b1e3a] transition-colors flex items-center gap-2">
                  <span>Find Restaurants</span>
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-400 hover:text-[#7b1e3a] transition-colors flex items-center gap-2">
                  <span>Become a Vendor</span>
                </Link>
              </li>
              <li>
                <Link href="/ride" className="text-gray-400 hover:text-[#7b1e3a] transition-colors flex items-center gap-2">
                  <span>Ride for ChowEazy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-[#7b1e3a] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#7b1e3a] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#7b1e3a] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#7b1e3a] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-l-4 border-[#7b1e3a] pl-3">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#7b1e3a] shrink-0 mt-0.5" />
                <span className="text-gray-400">Warri, Delta State,<br/>Nigeria.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#7b1e3a] shrink-0" />
                <span className="text-gray-400">+234 812 345 6789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#7b1e3a] shrink-0" />
                <span className="text-gray-400">support@choweazy.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
                <p className="text-gray-500 text-xs">
                © {currentYear} ChowEazy. All rights reserved.
                </p>
                <p className="text-gray-600 text-[10px] mt-1">
                    A Naturenest Global Company.
                </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-xs font-medium">
              <Link href="/privacy" className="text-gray-500 hover:text-[#7b1e3a] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#7b1e3a] transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-[#7b1e3a] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}