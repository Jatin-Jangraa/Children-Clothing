"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { reviewQueries } from "@/lib/queries";

const fallbackReviews = [
  { name: "Priya S.", rating: 5, comment: "Amazing quality! My daughter looks so cute in the dresses. Will order again!", location: "Verified Buyer" },
  { name: "Rahul M.", rating: 5, comment: "Best kids clothing store online. Fabric quality is top-notch and gentle on skin.", location: "Verified Buyer" },
  { name: "Anita K.", rating: 5, comment: "Love the collection! Fast shipping and premium packaging.", location: "Verified Buyer" },
  { name: "Vikram P.", rating: 5, comment: "My kids love the comfort. Perfect fit every time!", location: "Verified Buyer" },
  { name: "Neha R.", rating: 5, comment: "Beautiful designs and very affordable. Highly recommended!", location: "Verified Buyer" },
  { name: "Sanjay T.", rating: 4, comment: "Great experience shopping here. The stitching quality speaks for itself.", location: "Verified Buyer" },
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(fallbackReviews);

  useEffect(() => {
    reviewQueries.getAll().then((res) => {
      const dbReviews = res?.data || [];
      if (dbReviews.length > 0) {
        const mapped = dbReviews.slice(0, 6).map((r: any) => ({
          name: r.customerName || "Customer",
          rating: r.rating || 5,
          comment: r.comment || r.title || "",
          location: r.isVerified ? "Verified Buyer" : "Customer",
        }));
        setReviews(mapped);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-[#FFF1DC]/30 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#4a3f35]">
            What Parents Say
          </h2>
          <p className="text-[#6b5d52] text-sm sm:text-base">Thousands of happy parents trust us</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review, idx) => (
            <div
              key={`${review.name}-${idx}`}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F6E4D1]/60 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 mb-2.5 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                ))}
              </div>
              <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD8B1] mb-2 sm:mb-3" />
              <p className="text-[#6b5d52] text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-3">{review.comment}</p>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#D97757] to-[#B85C38] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#4a3f35] text-xs sm:text-sm">{review.name}</p>
                  <p className="text-[10px] sm:text-xs text-[#8b7355]">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
