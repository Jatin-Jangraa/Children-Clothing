"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn } from "next-auth/react";
import { CreditCard, Lock, CheckCircle, MapPin, User, Phone, Mail, Building, Map, LogIn, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Breadcrumb } from "@/components/ui";
import { useCartStore } from "@/store";
import { formatPrice } from "@/utils";
import { checkoutSchema, type CheckoutFormData } from "@/schemas/order";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getSubtotal, getDiscount, getShipping, getGst, getTotal, coupon, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const handlePayment = async (formData: any) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsProcessing(true);
    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getTotal(),
          items: items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.product.price,
            image: item.product.thumbnail || item.product.images?.[0]?.url || "",
          })),
          customerInfo: formData,
          subtotal: getSubtotal(),
          discount: getDiscount(),
          couponCode: coupon?.code || "",
          shippingCharges: getShipping(),
          gst: getGst(),
          userId: session?.user?.id || null,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount * 100,
        currency: "INR",
        name: "Little Closet",
        description: "Kids Fashion Order",
        order_id: orderData.data.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.data.orderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success?orderId=${orderData.data.orderId}`);
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#EC4899" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <h1 className="text-3xl font-bold mt-6 mb-8">Checkout</h1>

        {/* Optional Login Banner */}
        <AnimatePresence>
          {showLoginBanner && !session && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Sign in for a faster checkout</p>
                  <p className="text-xs text-gray-500">Your details will be filled automatically</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => signIn("google")}>
                  Sign In
                </Button>
                <button
                  onClick={() => setShowLoginBanner(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logged in indicator */}
        {session && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">
              Signed in as <span className="font-medium">{session.user?.email}</span>
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(handlePayment)} className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-pink-500" /> Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" icon={<User className="h-4 w-4" />} placeholder="John Doe" error={errors.name?.message as string} {...register("name")} />
                <Input label="Phone" icon={<Phone className="h-4 w-4" />} placeholder="+91 98765 43210" error={errors.phone?.message as string} {...register("phone")} />
                <Input label="Email" icon={<Mail className="h-4 w-4" />} placeholder="john@example.com" className="md:col-span-2" error={errors.email?.message as string} {...register("email")} />
                <Input label="Address" icon={<Map className="h-4 w-4" />} placeholder="123, Street Name" className="md:col-span-2" error={errors.address?.message as string} {...register("address")} />
                <Input label="City" icon={<Building className="h-4 w-4" />} placeholder="Mumbai" error={errors.city?.message as string} {...register("city")} />
                <Input label="State" placeholder="Maharashtra" error={errors.state?.message as string} {...register("state")} />
                <Input label="PIN Code" placeholder="400001" error={errors.pinCode?.message as string} {...register("pinCode")} />
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(getSubtotal())}</span></div>
                {coupon && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(getDiscount())}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{getShipping() === 0 ? "Free" : formatPrice(getShipping())}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GST (12%)</span><span>{formatPrice(getGst())}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isProcessing} className="mt-6 group">
                <CreditCard className="h-5 w-5 mr-2" /> Pay {formatPrice(getTotal())}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock className="h-3.5 w-3.5" /> Secured by Razorpay
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </Layout>
  );
}
