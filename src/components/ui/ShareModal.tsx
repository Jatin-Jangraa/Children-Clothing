"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Twitter,
  Facebook,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils";
import { toast } from "sonner";
import type { IProduct } from "@/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
}

export default function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);

  if (!isOpen) return null;

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productUrl = `${siteUrl}/product/${product.slug}`;
  const productImage = product.thumbnail || product.images?.[0]?.url || "";
  const shareText = `Check out ${product.name} (${formatPrice(product.price)}) on Little Closet!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success("Link copied with product image preview!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    setIsSharingNative(true);
    try {
      if (navigator.share) {
        // Try sharing with file if image is accessible
        let shareData: ShareData = {
          title: product.name,
          text: `${shareText}\n${productUrl}`,
          url: productUrl,
        };

        if (navigator.canShare && productImage && !productImage.startsWith("data:")) {
          try {
            const res = await fetch(productImage);
            const blob = await res.blob();
            const file = new File([blob], `${product.slug}.jpg`, { type: blob.type || "image/jpeg" });
            if (navigator.canShare({ files: [file] })) {
              shareData = {
                title: product.name,
                text: shareText,
                url: productUrl,
                files: [file],
              };
            }
          } catch {
            // fallback to URL only if image fetch is blocked by CORS
          }
        }

        await navigator.share(shareData);
        toast.success("Shared successfully!");
        onClose();
      } else {
        handleCopyLink();
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        handleCopyLink();
      }
    } finally {
      setIsSharingNative(false);
    }
  };

  const shareChannels = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] text-white hover:bg-[#20ba59]",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${product.name}\nPrice: ${formatPrice(product.price)}\n\nCheck image & details here: ${productUrl}`
      )}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] text-white hover:bg-[#0f62cf]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      color: "bg-black text-white hover:bg-stone-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out ${product.name} on Little Closet!`
      )}&url=${encodeURIComponent(productUrl)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-[#229ED9] text-white hover:bg-[#1c8ec4]",
      url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(
        `${product.name} - ${formatPrice(product.price)}`
      )}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-stone-700 text-white hover:bg-stone-800",
      url: `mailto:?subject=${encodeURIComponent(
        `Look at this: ${product.name}`
      )}&body=${encodeURIComponent(
        `I thought you would love this product:\n\n${product.name} (${formatPrice(product.price)})\n\nView with pictures: ${productUrl}`
      )}`,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#D97757]" />
              <h3 className="font-semibold text-stone-900 text-base">Share Product</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Rich Product Preview Card (Shows the image with the link) */}
            <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-3 flex gap-3.5 items-center">
              {productImage ? (
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 shadow-xs bg-white">
                  <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="w-16 h-20 rounded-lg bg-stone-200 flex items-center justify-center shrink-0">
                  <Share2 className="w-6 h-6 text-stone-400" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 block truncate">
                  {product.brand || "Little Closet"}
                </span>
                <p className="font-semibold text-stone-900 text-sm truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-stone-900">{formatPrice(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Image preview included in shared link</span>
                </div>
              </div>
            </div>

            {/* Quick Share Channels */}
            <div>
              <p className="text-xs font-semibold text-stone-600 mb-2.5">Share via</p>
              <div className="grid grid-cols-5 gap-2">
                {shareChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.name}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 transition-all text-center group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${channel.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-medium text-stone-600 group-hover:text-stone-900 truncate max-w-full">
                        {channel.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Native Share button (Mobile / Supported OS) */}
            {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={isSharingNative}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{isSharingNative ? "Opening Share..." : "Share with Apps / Devices"}</span>
              </button>
            )}

            {/* Copy Link Input Bar */}
            <div>
              <p className="text-xs font-semibold text-stone-600 mb-1.5">Direct Product Link</p>
              <div className="flex items-center gap-2 bg-[#F7F5F2] border border-stone-200 rounded-xl p-1.5 pl-3">
                <input
                  type="text"
                  readOnly
                  value={productUrl}
                  className="bg-transparent text-xs text-stone-700 flex-1 outline-hidden select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
