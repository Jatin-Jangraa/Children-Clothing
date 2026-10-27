"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import ImageUploader from "@/components/ui/ImageUploader";
import { productSchema, type ProductFormData } from "@/schemas/product";
import { productQueries, categoryQueries } from "@/lib/queries";
import { GENDERS, AGE_GROUPS, BRANDS, PRODUCT_SIZES, COLORS } from "@/constants";
import { toast } from "sonner";

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [images, setImages] = useState<{ url: string; alt: string; publicId?: string }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      gender: "unisex",
      sizes: [],
      colors: [],
      features: [],
      careInstructions: [],
      tags: [],
      images: [],
      videos: [],
      stock: 0,
      discount: 0,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      isNewArrival: true,
      isActive: true,
      showInHero: false,
    },
  });

  useEffect(() => {
    categoryQueries.getAll().then((res) => setCategories(res.data || []));
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const slug = data.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
      const sku = `${data.brand.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      const imageData = images.map((img) => ({ url: img.url, alt: img.alt }));
      const thumbnail = images.length > 0 ? images[0].url : "";
      await productQueries.create({
        ...data,
        slug,
        sku,
        ageGroups: selectedAges.length > 0 ? selectedAges : (data.ageGroups || []),
        ageGroup: selectedAges.length > 0 ? selectedAges.join(", ") : (data.ageGroup || ""),
        colors: selectedColors.length > 0 ? selectedColors : data.colors,
        images: imageData,
        thumbnail,
      });
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) =>
      prev.find((c) => c.name === color.name) ? prev.filter((c) => c.name !== color.name) : [...prev, color]
    );
  };

  const toggleAge = (age: string) => {
    setSelectedAges((prev) => {
      const updated = prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age];
      setValue("ageGroups", updated);
      setValue("ageGroup", updated.join(", "));
      return updated;
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold">Create Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Product Images</h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Basic Information</h2>
          <Input label="Product Name" placeholder="e.g., Cotton Summer Dress" error={errors.name?.message} {...register("name")} />
          <Textarea label="Description" placeholder="Detailed product description..." error={errors.description?.message} {...register("description")} />
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Brand" placeholder="Little Closet" error={errors.brand?.message} {...register("brand")} />
            <Select label="Category" options={categories.map((c) => ({ label: c.name, value: c._id }))} placeholder="Select category" error={errors.category?.message} {...register("category")} />
            <Input label="Subcategory" placeholder="e.g., Dresses" {...register("subcategory")} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Pricing & Stock</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" placeholder="999" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
            <Input label="MRP (₹)" type="number" placeholder="1499" error={errors.mrp?.message} {...register("mrp", { valueAsNumber: true })} />
            <Input label="Discount (%)" type="number" placeholder="0" {...register("discount", { valueAsNumber: true })} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Stock" type="number" placeholder="100" {...register("stock", { valueAsNumber: true })} />
            <Input label="Material" placeholder="e.g., Cotton" error={errors.material?.message} {...register("material")} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Target Audience</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Select label="Gender" options={GENDERS.map((g) => ({ label: g.charAt(0).toUpperCase() + g.slice(1), value: g }))} {...register("gender")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Groups (Select all applicable ages)
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
                Selected: <span className="font-semibold text-stone-800">{selectedAges.join(", ")}</span>
              </p>
            )}
            {errors.ageGroup && selectedAges.length === 0 && (
              <p className="text-xs text-red-500 mt-1">{errors.ageGroup.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_SIZES.map((size) => (
                <label key={size} className="flex items-center">
                  <input type="checkbox" value={size} {...register("sizes")} className="sr-only peer" />
                  <span className="px-3 py-1.5 border rounded-lg text-sm cursor-pointer transition-all peer-checked:bg-pink-500 peer-checked:text-white peer-checked:border-pink-500">{size}</span>
                </label>
              ))}
            </div>
            {errors.sizes && <p className="text-xs text-red-500 mt-1">{errors.sizes.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button key={color.name} type="button" onClick={() => toggleColor(color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColors.find((c) => c.name === color.name) ? "border-pink-500 ring-2 ring-pink-200 scale-110" : "border-gray-200"}`}
                  style={{ backgroundColor: color.hex }} title={color.name} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">Status Flags</h2>
          <div className="flex flex-wrap gap-4">
            {((["isFeatured", "isTrending", "isBestSeller", "isNewArrival", "isActive", "showInHero"] as const)).map((flag) => (
              <label key={flag} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(flag)} className="w-4 h-4 accent-pink-500 rounded" />
                <span className="text-sm font-medium">
                  {flag === "showInHero" ? "Show in Hero Section (Home)" : flag.replace(/([A-Z])/g, " $1").replace(/^is/, "")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-lg">SEO</h2>
          <Input label="SEO Title" placeholder="SEO optimized title" {...register("seoTitle")} />
          <Textarea label="SEO Description" placeholder="SEO description..." {...register("seoDescription")} />
        </div>

        <Button type="submit" size="lg" isLoading={isSubmitting} className="group">
          <Save className="h-5 w-5 mr-2" /> Create Product
        </Button>
      </form>
    </div>
  );
}
