"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Boys", image: "👦", color: "from-blue-400 to-indigo-500", href: "/shop?gender=boys" },
  { name: "Girls", image: "👧", color: "from-pink-400 to-rose-500", href: "/shop?gender=girls" },
  { name: "Newborn", image: "👶", color: "from-green-400 to-emerald-500", href: "/shop?ageGroup=0-6M" },
  { name: "Footwear", image: "👟", color: "from-amber-400 to-orange-500", href: "/shop" },
  { name: "Accessories", image: "🎀", color: "from-purple-400 to-violet-500", href: "/shop" },
  { name: "Ethnic", image: "🪷", color: "from-red-400 to-pink-500", href: "/shop" },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#4a3f35]">
            Shop by Category
          </h2>
          <p className="text-[#6b5d52] text-sm sm:text-base max-w-md mx-auto">Find the perfect outfits for every occasion</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-square hover:-translate-y-2 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    {cat.image}
                  </span>
                  <h3 className="font-bold text-sm sm:text-lg">{cat.name}</h3>
                  <div className="flex items-center gap-1 mt-1.5 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm">
                    Shop <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
