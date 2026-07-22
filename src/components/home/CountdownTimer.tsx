"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

export default function CountdownTimer() {
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-10 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 sm:p-8 lg:p-12"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 text-white">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm mb-2.5 sm:mb-3">
                <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Limited Time Offer
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2">Summer Sale Up to 50% Off</h2>
              <p className="text-white/80 text-sm sm:text-base">Hurry! This deal ends soon</p>
            </div>
            <div className="flex gap-2.5 sm:gap-3">
              {[
                { value: pad(time.hours), label: "Hours" },
                { value: pad(time.minutes), label: "Mins" },
                { value: pad(time.seconds), label: "Secs" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-1">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold">{item.value}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/70">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
