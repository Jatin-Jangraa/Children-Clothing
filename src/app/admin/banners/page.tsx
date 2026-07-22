"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { bannerQueries } from "@/lib/queries";
import { toast } from "sonner";
import type { IBanner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "#", type: "hero", position: 0, isActive: true });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = () => {
    setLoading(true);
    bannerQueries.getAll().then((res) => setBanners(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSave = async () => {
    try {
      await bannerQueries.create(form);
      toast.success("Banner created");
      setShowModal(false);
      fetchBanners();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await bannerQueries.delete(id); toast.success("Deleted"); fetchBanners(); } catch { toast.error("Failed"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");
      formData.append("folder", "cloth-store/banners");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.data.url });
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Banner</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-500">Loading...</p> :
          banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {banner.image && (
                <div className="relative h-40 bg-gray-100">
                  <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="400px" />
                </div>
              )}
              <div className="p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm">{banner.title}</h3>
                  <p className="text-xs text-gray-500">{banner.subtitle}</p>
                  <Badge className="mt-2">{banner.type}</Badge>
                </div>
                <button onClick={() => handleDelete(banner._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex justify-between"><h2 className="font-bold text-lg">Add Banner</h2><button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button></div>
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Banner Image</label>
              {form.image ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image src={form.image} alt="Banner preview" fill className="object-cover" sizes="400px" />
                  <button
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-pink-300 bg-gray-50 hover:bg-pink-50/50 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  {uploading ? (
                    <div className="h-6 w-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Click to upload image</span>
                    </>
                  )}
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            <Input label="Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            <Select label="Type" options={[{ label: "Hero", value: "hero" }, { label: "Promo", value: "promo" }, { label: "Offer", value: "offer" }, { label: "Popup", value: "popup" }, { label: "Video", value: "video" }]} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            <Input label="Position" type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
            <Button onClick={handleSave} fullWidth>Create Banner</Button>
          </div>
        </div>
      )}
    </div>
  );
}