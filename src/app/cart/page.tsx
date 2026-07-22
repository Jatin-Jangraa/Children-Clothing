"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";

export default function CartPage() {
  const router = useRouter();
  const { openCart } = useCartStore();
  const hasOpened = useRef(false);
  
  useEffect(() => {
    if (!hasOpened.current) {
      hasOpened.current = true;
      openCart();
    }
    router.back();
  }, [openCart, router]);
  
  return null;
}
