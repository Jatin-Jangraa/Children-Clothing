"use client";

import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4"
        >
          <span className="text-white font-bold text-2xl">LC</span>
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
        />
      </div>
    </div>
  );
}
