"use client";

import Header from "./Header";
import Footer from "./Footer";
import FloatingButtons from "@/components/shared/FloatingButtons";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
