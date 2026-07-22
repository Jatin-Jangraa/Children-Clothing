"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?sort=popularity" },
    { label: "Boys Collection", href: "/shop?gender=boys" },
    { label: "Girls Collection", href: "/shop?gender=girls" },
    { label: "Sale", href: "/shop?discount=20" },
  ],
  help: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Size Guide", href: "/faq" },
    { label: "Track Order", href: "/faq" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2">Join Our Kids Fashion Club</h3>
              <p className="text-white/80 text-sm sm:text-base">Get exclusive offers, new arrivals & styling tips</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-pink-500 font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 text-sm"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">LC</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Little Closet</h2>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              Premium children&apos;s clothing where style meets comfort. Dress your little ones in the finest fashion.
            </p>
            <div className="space-y-2 sm:space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-400 hover:text-pink-400 transition-colors">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> +91 98765 43210
              </a>
              <a href="mailto:hello@littlecloset.in" className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-400 hover:text-pink-400 transition-colors">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> hello@littlecloset.in
              </a>
              <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-400">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Shop</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Help</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-sm sm:text-lg mb-3 sm:mb-4">Policies</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-pink-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} Little Closet. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -2 }}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-800 text-gray-400 hover:text-pink-400 hover:bg-gray-700 transition-all"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
