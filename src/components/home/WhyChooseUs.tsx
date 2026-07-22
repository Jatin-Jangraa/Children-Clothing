"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Headphones, CreditCard, Sparkles } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999", color: "from-blue-500 to-indigo-500" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure via Razorpay", color: "from-green-500 to-emerald-500" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy", color: "from-amber-500 to-orange-500" },
  { icon: Headphones, title: "24/7 Support", desc: "We're here to help", color: "from-purple-500 to-violet-500" },
  { icon: CreditCard, title: "Online Payment", desc: "Razorpay secure gateway", color: "from-pink-500 to-rose-500" },
  { icon: Sparkles, title: "Premium Quality", desc: "Handpicked collections", color: "from-cyan-500 to-blue-500" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-gray-900">
            Why <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Little Closet</span>?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">We make shopping for your little ones a delightful experience</p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-2.5 sm:mb-4 shadow-lg`}>
                <feature.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-0.5 sm:mb-1">{feature.title}</h3>
              <p className="text-[10px] sm:text-sm text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
