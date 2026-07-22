"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import ImageUploader from "@/components/ui/ImageUploader";
import { productQueries, categoryQueries } from "@/lib/queries";
import { GENDERS, AGE_GROUPS } from "@/constants";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [images, setImages] = useState<{ url: string; alt: string; publicId?: string }[]>([]);

  useEffect(() => {
    Promise.all([
      productQueries.getById(params.id as string),
      categoryQueries.getAll(),
    ]).then(([productRes, catRes]) => {
      const product = productRes.data || {};
      setForm(product);
      setImages(product.images || []);
      setCategories(catRes.data || []);
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const imageData = images.map((img) => ({ url: img.url, alt: img.alt }));
      const thumbnail = images.length > 0 ? images[0].url : "";
      await productQueries.update(params.id as string, { ...form, images: imageData, thumbnail });
      toast.success("Product updated!");
      router.push("/admin/products");
    } catch { toast.error("Failed to update"); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-xl"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Product Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Basic Information</h2>
          <Input label="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Brand" value={form.brand || ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Select label="Category" options={categories.map((c) => ({ label: c.name, value: c._id }))} value={form.category?._id || form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input label="Subcategory" value={form.subcategory || ""} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Input label="MRP (₹)" type="number" value={form.mrp || ""} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })} />
            <Input label="Discount (%)" type="number" value={form.discount || 0} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
          </div>
          <Input label="Stock" type="number" value={form.stock || 0} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Status</h2>
          <div className="flex flex-wrap gap-4">
            {(["isFeatured", "isTrending", "isBestSeller", "isNewArrival", "isActive"] as const).map((flag) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[flag] || false} onChange={(e) => setForm({ ...form, [flag]: e.target.checked })} className="w-4 h-4 accent-pink-500 rounded" />
                <span className="text-sm font-medium">{flag.replace(/([A-Z])/g, " $1").replace(/^is/, "")}</span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" isLoading={isSubmitting}><Save className="h-5 w-5 mr-2" /> Update Product</Button>
      </form>
    </div>
  );
}
