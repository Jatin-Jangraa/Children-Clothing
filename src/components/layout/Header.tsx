"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Search, ShoppingBag, Heart, Menu, X, ChevronDown,
  Phone, Mail, Truck, MapPin, LogIn, User, LogOut, ChevronRight, Shield
} from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/shared/SearchModal";

const categories = [
  { name: "Boys", href: "/shop?gender=boys", subcategories: ["T-Shirts", "Shirts", "Pants", "Shorts", "Denim", "Outerwear", "Activewear", "Sleepwear"] },
  { name: "Girls", href: "/shop?gender=girls", subcategories: ["Dresses", "Tops", "Skirts", "Pants", "Ethnic Wear", "Outerwear", "Activewear", "Sleepwear"] },
  { name: "New Arrivals", href: "/shop?sort=newest" },
  { name: "Best Sellers", href: "/shop?sort=popularity" },
  { name: "Sale", href: "/shop?discount=20" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { toggleCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-center py-2 text-xs font-medium">
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-2"
        >
          <Truck className="h-3.5 w-3.5" />
          <span>Free Shipping on Orders Above ₹999 | Use Code WELCOME10 for 10% Off</span>
        </motion.div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-pink-100/20"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 lg:h-20">
            {/* Left: Mobile Menu Toggle + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-200"
                >
                  <span className="text-white font-bold text-base lg:text-xl">LC</span>
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-base lg:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                    Little Closet
                  </h1>
                  <p className="text-[10px] text-gray-400 -mt-0.5 hidden lg:block">Premium Kids Fashion</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative"
                  onMouseEnter={() => setActiveMega(cat.name)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-500 rounded-xl hover:bg-pink-50 transition-all"
                  >
                    {cat.name}
                    {cat.subcategories && <ChevronDown className="h-3.5 w-3.5" />}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {cat.subcategories && activeMega === cat.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 pt-2"
                      >
                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 min-w-[400px]">
                          <div className="grid grid-cols-2 gap-3">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop?category=${sub.toLowerCase().replace(/\s+/g, "-")}`}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition-colors group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:from-pink-200 group-hover:to-purple-200 transition-colors">
                                  <span className="text-lg">👕</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                                  {sub}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </motion.button>

              <Link href="/wishlist" className="hidden sm:block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-0 sm:right-0 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </motion.button>

              {/* Auth Button */}
              {session ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={36}
                        height={36}
                        className="w-8 h-8 lg:w-9 lg:h-9 rounded-full ring-2 ring-pink-200"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                      >
                        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100">
                          <p className="font-semibold text-gray-800 text-sm truncate">{session.user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/checkout"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 rounded-xl transition-all"
                          >
                            <ChevronRight className="h-4 w-4" />
                            My Orders
                          </Link>
                          {session.user?.role === "admin" && (
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                            >
                              <Shield className="h-4 w-4" />
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signIn("google")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg shadow-pink-200/50 hover:shadow-xl transition-all"
                >
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-5">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LC</span>
                    </div>
                    <span className="font-bold text-gray-800">Menu</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Mobile Auth Section */}
                {session ? (
                  <div className="flex items-center gap-3 p-3.5 mb-5 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100/50">
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="" width={40} height={40} className="w-10 h-10 rounded-full ring-2 ring-white" unoptimized />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <button onClick={() => signOut()} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-2xl shadow-lg shadow-pink-200/50 active:scale-[0.98] transition-all"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in with Google
                  </button>
                )}

                {/* Navigation Links */}
                <div className="space-y-0.5">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <Link
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"
                      >
                        {cat.name}
                        {cat.subcategories && <ChevronRight className="h-4 w-4 text-gray-400" />}
                      </Link>
                      {cat.subcategories && (
                        <div className="pl-4 space-y-0.5 mt-0.5 mb-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              href={`/shop?category=${sub.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-3 py-2 text-xs text-gray-500 hover:text-pink-500 hover:bg-pink-50/50 rounded-lg transition-colors"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-1">
                  <a href="tel:+919876543210" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-blue-500" />
                    </div>
                    +91 98765 43210
                  </a>
                  <a href="mailto:hello@littlecloset.in" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-500" />
                    </div>
                    hello@littlecloset.in
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
