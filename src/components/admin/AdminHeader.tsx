"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="font-bold text-lg">Little Closet Admin</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
          <ExternalLink className="h-4 w-4" /> View Store
        </Link>
      </div>
    </header>
  );
}