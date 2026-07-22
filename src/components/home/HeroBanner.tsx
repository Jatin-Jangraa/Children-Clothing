"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroBanner() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50" />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-pink-600 mb-4 sm:mb-6 shadow-sm border border-pink-100/50"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              New Summer Collection 2025
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6 text-gray-900"
            >
              Dress Your
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Little Stars
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md leading-relaxed"
            >
              Premium children&apos;s clothing that combines comfort, quality, and the latest trends.
              Make every moment special.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/shop">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button variant="outline" size="lg">
                  New Arrivals
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-6 sm:gap-8 mt-8 sm:mt-12"
            >
              {[
                { value: "10K+", label: "Happy Parents" },
                { value: "500+", label: "Products" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="w-full h-64 rounded-3xl overflow-hidden shadow-xl shadow-pink-200/50 relative">
                  <Image src="https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=650&fit=crop" alt="Girls clothing" fill className="object-cover" sizes="300px" />
                </div>
                <div className="w-full h-40 rounded-3xl overflow-hidden shadow-xl shadow-purple-200/50 relative">
                  <Image src="https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=500&h=400&fit=crop" alt="Baby onesies" fill className="object-cover" sizes="300px" />
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="space-y-4 pt-8"
              >
                <div className="w-full h-40 rounded-3xl overflow-hidden shadow-xl shadow-indigo-200/50 relative">
                  <Image src="https://images.unsplash.com/photo-1598731470675-fd2af8f004c6?w=500&h=400&fit=crop" alt="Boys t-shirt" fill className="object-cover" sizes="300px" />
                </div>
                <div className="w-full h-64 rounded-3xl overflow-hidden shadow-xl shadow-amber-200/50 relative">
                  <Image src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=650&fit=crop" alt="Kids fashion" fill className="object-cover" sizes="300px" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
