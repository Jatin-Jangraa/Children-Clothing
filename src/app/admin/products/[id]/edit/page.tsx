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
import { GENDERS, AGE_GROUPS, PRODUCT_SIZES } from "@/constants";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; alt: string; publicId?: string }[]>([]);

  useEffect(() => {
    Promise.all([
      productQueries.getById(params.id as string),
      categoryQueries.getAll(),
    ])
      .then(([productRes, catRes]) => {
        const product = productRes.data || {};
        setForm(product);
        setImages(product.images || []);
        setCategories(catRes.data || []);

        const initialAges =
          product.ageGroups && product.ageGroups.length > 0
            ? product.ageGroups
            : product.ageGroup
            ? product.ageGroup.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
        setSelectedAges(initialAges);
        setSelectedSizes(product.sizes || []);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const toggleAge = (age: string) => {
    setSelectedAges((prev) => {
      const updated = prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age];
      setForm((f: any) => ({
        ...f,
        ageGroups: updated,
        ageGroup: updated.join(", "),
      }));
      return updated;
    });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const updated = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size];
      setForm((f: any) => ({ ...f, sizes: updated }));
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const imageData = images.map((img) => ({ url: img.url, alt: img.alt }));
      const thumbnail = images.length > 0 ? images[0].url : "";
      await productQueries.update(params.id as string, {
        ...form,
        ageGroups: selectedAges,
        ageGroup: selectedAges.join(", "),
        sizes: selectedSizes,
        images: imageData,
        thumbnail,
      });
      toast.success("Product updated!");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Product Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Basic Information</h2>
          <Input
            label="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Brand"
              value={form.brand || ""}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <Select
              label="Category"
              options={categories.map((c) => ({ label: c.name, value: c._id }))}
              value={form.category?._id || form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              label="Subcategory"
              value={form.subcategory || ""}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Target Audience & Multi-Age Groups</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              options={GENDERS.map((g) => ({
                label: g.charAt(0).toUpperCase() + g.slice(1),
                value: g,
              }))}
              value={form.gender || "unisex"}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />
            <Input
              label="Material"
              value={form.material || ""}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Groups (Select one or more)
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((age) => {
                const isSelected = selectedAges.includes(age);
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => toggleAge(age)}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#D97757] text-white border-[#D97757] shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
            {selectedAges.length > 0 && (
              <p className="text-xs text-stone-500 mt-1.5">
                Current: <span className="font-semibold text-stone-800">{selectedAges.join(", ")}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-pink-500 text-white border-pink-500 shadow-xs"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <Input
              label="MRP (₹)"
              type="number"
              value={form.mrp || ""}
              onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
            />
            <Input
              label="Discount (%)"
              type="number"
              value={form.discount || 0}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Stock"
            type="number"
            value={form.stock || 0}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Status</h2>
          <div className="flex flex-wrap gap-4">
            {(
              [
                "isFeatured",
                "isTrending",
                "isBestSeller",
                "isNewArrival",
                "isActive",
                "showInHero",
              ] as const
            ).map((flag) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[flag] || false}
                  onChange={(e) => setForm({ ...form, [flag]: e.target.checked })}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
                <span className="text-sm font-medium">
                  {flag === "showInHero"
                    ? "Show in Hero Section (Home)"
                    : flag.replace(/([A-Z])/g, " $1").replace(/^is/, "")}
                </span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" isLoading={isSubmitting}>
          <Save className="h-5 w-5 mr-2" /> Update Product
        </Button>
      </form>
    </div>
  );
}
