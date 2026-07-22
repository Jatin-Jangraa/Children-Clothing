"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  { name: "Priya S.", rating: 5, comment: "Amazing quality! My daughter looks so cute in the dresses. Will order again!", location: "Mumbai" },
  { name: "Rahul M.", rating: 5, comment: "Best kids clothing store online. Fabric quality is top-notch.", location: "Delhi" },
  { name: "Anita K.", rating: 4, comment: "Love the collection! Fast shipping and great packaging.", location: "Bangalore" },
  { name: "Vikram P.", rating: 5, comment: "My kids love the comfort. Perfect fit every time!", location: "Pune" },
  { name: "Neha R.", rating: 5, comment: "Beautiful designs and very affordable. Highly recommended!", location: "Chennai" },
  { name: "Sanjay T.", rating: 4, comment: "Great experience shopping here. The quality speaks for itself.", location: "Hyderabad" },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            What Parents <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Say</span>
          </h2>
          <p className="text-gray-500">Thousands of happy parents trust us</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
              <Quote className="h-8 w-8 text-pink-200 mb-3" />
              <p className="text-gray-600 mb-4 leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
