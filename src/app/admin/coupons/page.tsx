"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, X, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { couponQueries } from "@/lib/queries";
import { toast } from "sonner";
import type { ICoupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discountType: "percentage", discountValue: 0, minimumOrder: 0, maximumDiscount: 0, usageLimit: 0, expiryDate: "" });

  const fetchCoupons = () => {
    setLoading(true);
    couponQueries.getAll().then((res) => setCoupons(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async () => {
    try {
      await couponQueries.create(form);
      toast.success("Coupon created");
      setShowModal(false);
      fetchCoupons();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await couponQueries.delete(id); toast.success("Deleted"); fetchCoupons(); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button onClick={() => setShowModal(true)} className="group"><Plus className="h-4 w-4 mr-2" /> Add Coupon</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Min Order</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Usage</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={7} className="text-center py-10 text-gray-500">Loading...</td></tr> :
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono font-bold text-sm">{coupon.code}</td>
                  <td className="px-5 py-4"><Badge variant="info">{coupon.discountType}</Badge></td>
                  <td className="px-5 py-4 text-sm">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                  <td className="px-5 py-4 text-sm">₹{coupon.minimumOrder}</td>
                  <td className="px-5 py-4 text-sm">{coupon.usedCount}/{coupon.usageLimit || "∞"}</td>
                  <td className="px-5 py-4 text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between"><h2 className="font-bold text-lg">Add Coupon</h2><button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button></div>
            <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            <Select label="Type" options={[{ label: "Percentage", value: "percentage" }, { label: "Flat", value: "flat" }]} value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Value" type="number" value={form.discountValue || ""} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
              <Input label="Min Order (₹)" type="number" value={form.minimumOrder || ""} onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Max Discount (₹)" type="number" value={form.maximumDiscount || ""} onChange={(e) => setForm({ ...form, maximumDiscount: Number(e.target.value) })} />
              <Input label="Usage Limit" type="number" value={form.usageLimit || ""} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} />
            </div>
            <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <Button onClick={handleSave} fullWidth>Create Coupon</Button>
          </div>
        </div>
      )}
    </div>
  );
}