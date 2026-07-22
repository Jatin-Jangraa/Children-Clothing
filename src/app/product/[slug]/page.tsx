"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, Check, ThumbsUp, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Breadcrumb, ProductCard, Skeleton } from "@/components/ui";
import { formatPrice, calculateDiscount } from "@/utils";
import { useCartStore, useWishlistStore } from "@/store";
import { productQueries, reviewQueries } from "@/lib/queries";
import { toast } from "sonner";
import type { IProduct } from "@/types";

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (params.slug) {
      setLoading(true);
      productQueries.getBySlug(params.slug as string)
        .then((res) => {
          const p = res.data?.[0];
          if (p) {
            setProduct(p);
            setSelectedSize(p.sizes?.[0] || "");
            setSelectedColor(p.colors?.[0]?.name || "");
            productQueries.getAll({ category: typeof p.category === 'object' ? p.category._id : p.category, limit: 4 }).then((r) => {
              setRelatedProducts((r.data || []).filter((item: IProduct) => item._id !== p._id).slice(0, 4));
            });
            reviewQueries.getByProduct(p._id).then((r) => {
              setReviews(r.data || []);
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [params.slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewForm.name || !reviewForm.email || !reviewForm.title || !reviewForm.comment) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await reviewQueries.create({
        product: product._id,
        customerName: reviewForm.name,
        customerEmail: reviewForm.email,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        isApproved: false,
      });
      toast.success("Review submitted! It will appear after approval.");
      setShowReviewForm(false);
      setReviewForm({ name: "", email: "", rating: 5, title: "", comment: "" });
      setProduct({ ...product, reviewCount: product.reviewCount + 1 });
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    addItem({ product, quantity, size: selectedSize, color: selectedColor });
    openCart();
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stock <= 0) { toast.error("Out of stock"); return; }
    addItem({ product, quantity, size: selectedSize, color: selectedColor });
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-pink-500 hover:text-pink-600">← Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const discount = calculateDiscount(product.price, product.mrp);
  const inWishlist = isInWishlist(product._id);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          {/* Images */}
          <div>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-4">
              <Image
                src={product.images?.[selectedImage]?.url || product.thumbnail || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#E11D48] text-white text-sm font-bold rounded-full shadow-sm">
                  {discount}% OFF
                </span>
              )}
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-sm uppercase tracking-wider" style={{ left: discount > 0 ? 'auto' : undefined, right: discount > 0 ? '1rem' : undefined }}>
                  New In
                </span>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === i ? "border-pink-500" : "border-transparent"}`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm text-pink-500 font-medium mb-1">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const filled = i < Math.floor(product.rating);
                      const half = !filled && i < Math.ceil(product.rating) && product.rating % 1 >= 0.3;
                      return (
                        <div key={i} className="relative w-4 h-4">
                          <Star className="absolute inset-0 w-4 h-4 text-gray-200 fill-gray-200" />
                          {filled && <Star className="absolute inset-0 w-4 h-4 text-amber-400 fill-amber-400" />}
                          {half && (
                            <div className="absolute inset-0 w-1/2 overflow-hidden">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                  <span className="text-sm font-semibold text-green-600">Save {formatPrice(product.mrp - product.price)}</span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Color: <span className="font-normal text-gray-500">{selectedColor}</span></h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200"}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Size: <span className="font-normal text-gray-500">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${selectedSize === size ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Quantity</h3>
              <div className="flex items-center gap-3 bg-gray-100 w-fit rounded-xl p-1">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center"><Minus className="h-4 w-4" /></motion.button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center"><Plus className="h-4 w-4" /></motion.button>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <><Check className="h-4 w-4 text-green-500" /><span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span></>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 group" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { toggleItem(product._id); toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!"); }}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors ${inWishlist ? "border-pink-500 bg-pink-50 text-pink-500" : "border-gray-200 hover:border-pink-300"}`}
              >
                <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />
              </motion.button>
            </div>

            <Button size="lg" variant="secondary" fullWidth onClick={handleBuyNow} disabled={product.stock <= 0}>
              Buy Now
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              {[{ icon: Truck, label: "Free Shipping" }, { icon: Shield, label: "Secure Payment" }, { icon: RotateCcw, label: "7 Day Returns" }].map((f) => (
                <div key={f.label} className="text-center">
                  <f.icon className="h-5 w-5 mx-auto text-pink-500 mb-1" />
                  <span className="text-xs text-gray-500">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Product Info */}
            <div className="space-y-3 pt-4 border-t text-sm">
              {product.material && <div className="flex"><span className="text-gray-500 w-28">Material:</span><span>{product.material}</span></div>}
              {product.ageGroup && <div className="flex"><span className="text-gray-500 w-28">Age Group:</span><span>{product.ageGroup}</span></div>}
              {product.gender && <div className="flex"><span className="text-gray-500 w-28">Gender:</span><span className="capitalize">{product.gender}</span></div>}
              {product.sku && <div className="flex"><span className="text-gray-500 w-28">SKU:</span><span>{product.sku}</span></div>}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-10">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-center mb-5">
                <p className="text-4xl font-bold text-gray-900">{product.rating > 0 ? product.rating : "—"}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-1.5">{product.reviewCount} reviews</p>
              </div>
              <div className="space-y-2.5">
                {ratingBreakdown.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-2.5">
                    <span className="text-xs font-medium text-gray-500 w-3">{star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-gray-400 w-5 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div>
              {reviews.length === 0 && !showReviewForm && (
                <p className="text-gray-400 text-sm py-8 text-center">No reviews yet. Be the first to review this product!</p>
              )}

              <AnimatePresence>
                {showReviewForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleReviewSubmit}
                    className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your name *"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                      />
                      <input
                        type="email"
                        placeholder="Email address *"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-2 block">Your rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                            className="p-0.5"
                          >
                            <Star className={`w-6 h-6 transition-colors ${s <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                          </button>
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{reviewForm.rating}/5</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Review title *"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
                    />
                    <textarea
                      placeholder="Write your review here... *"
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={submitting} className="gap-2">
                        <Send className="w-4 h-4" />
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {reviews.length > 0 && (
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-100 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
                            {review.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800">{review.customerName}</p>
                              {review.isVerified && (
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
                              ))}
                              <span className="text-[11px] text-gray-400 ml-1">
                                {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800 mt-3">{review.title}</h4>
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-500 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
