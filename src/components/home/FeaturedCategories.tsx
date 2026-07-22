"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Boys", image: "👦", color: "from-blue-400 to-indigo-500", href: "/shop?gender=boys" },
  { name: "Girls", image: "👧", color: "from-pink-400 to-rose-500", href: "/shop?gender=girls" },
  { name: "Newborn", image: "👶", color: "from-green-400 to-emerald-500", href: "/shop?age=0-3M" },
  { name: "Footwear", image: "👟", color: "from-amber-400 to-orange-500", href: "/shop" },
  { name: "Accessories", image: "🎀", color: "from-purple-400 to-violet-500", href: "/shop" },
  { name: "Ethnic", image: "🪷", color: "from-red-400 to-pink-500", href: "/shop" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            Shop by <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">Find the perfect outfits for every occasion</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={cat.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative overflow-hidden rounded-3xl aspect-square"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <motion.span
                      className="text-5xl mb-3"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {cat.image}
                    </motion.span>
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      Shop <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
