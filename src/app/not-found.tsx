"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}
          className="text-8xl mb-8">🧸</motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you are looking for might have been moved or does not exist. Let&apos;s get you back on track!</p>
          <div className="flex justify-center gap-4">
            <Link href="/"><Button size="lg" className="group"><Home className="h-5 w-5 mr-2" /> Go Home</Button></Link>
            <Link href="/shop"><Button variant="outline" size="lg"><Search className="h-5 w-5 mr-2" /> Browse Shop</Button></Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
