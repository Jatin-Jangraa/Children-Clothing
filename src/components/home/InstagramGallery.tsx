"use client";

import { motion } from "framer-motion";
import { Instagram, Heart } from "lucide-react";

const galleryItems = [
  { emoji: "👗", color: "from-pink-300 to-rose-400" },
  { emoji: "👦", color: "from-blue-300 to-indigo-400" },
  { emoji: "🎀", color: "from-purple-300 to-violet-400" },
  { emoji: "🧸", color: "from-amber-300 to-orange-400" },
  { emoji: "👧", color: "from-rose-300 to-pink-400" },
  { emoji: "👟", color: "from-green-300 to-emerald-400" },
];

export default function InstagramGallery() {
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full text-xs sm:text-sm font-medium text-pink-600 mb-3 sm:mb-4">
            <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            @littlecloset
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900">Follow Us on Instagram</h2>
          <p className="text-gray-500 text-sm sm:text-base">Tag us for a chance to be featured</p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
              <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl">
                {item.emoji}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
