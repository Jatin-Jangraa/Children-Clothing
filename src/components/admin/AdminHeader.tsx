"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <Link href="/admin/dashboard" className="font-bold text-base sm:text-lg text-gray-800">
          Little Closet Admin
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-gray-700"
        >
          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">View Store</span>
          <span className="sm:hidden">Store</span>
        </Link>
      </div>
    </header>
  );
}
