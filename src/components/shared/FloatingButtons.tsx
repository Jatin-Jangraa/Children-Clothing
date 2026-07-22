"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 sm:gap-3">
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.a>
      <motion.a
        href="tel:+919876543210"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors"
      >
        <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.a>
    </div>
  );
}
