"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { reviewQueries } from "@/lib/queries";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    reviewQueries.getByProduct("").then((res) => {
      setReviews(res.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id: string) => {
    try { await reviewQueries.approve(id); toast.success("Approved"); fetchReviews(); } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await reviewQueries.delete(id); toast.success("Deleted"); fetchReviews(); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="space-y-3">
        {loading ? <p className="text-gray-500">Loading...</p> :
          reviews.length === 0 ? <p className="text-gray-500">No reviews yet</p> :
          reviews.map((review: any) => (
            <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {review.customerName?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{review.customerName}</span>
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />)}</div>
                  {!review.isApproved && <Badge variant="warning">Pending</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{review.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{review.comment}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!review.isApproved && (
                  <button onClick={() => handleApprove(review._id)} className="p-2 hover:bg-green-50 rounded-lg"><Check className="h-4 w-4 text-green-500" /></button>
                )}
                <button onClick={() => handleDelete(review._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}