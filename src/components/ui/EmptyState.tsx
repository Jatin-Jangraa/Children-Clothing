"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel = "Browse Products",
  actionHref = "/shop",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-6">
        {icon || <Package className="h-10 w-10 text-pink-400" />}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <Link href={actionHref}>
        <Button>{actionLabel}</Button>
      </Link>
    </motion.div>
  );
}
