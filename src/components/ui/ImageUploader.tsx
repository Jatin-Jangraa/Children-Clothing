"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, GripVertical, Plus } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: { url: string; alt: string; publicId?: string }[];
  onChange: (images: { url: string; alt: string; publicId?: string }[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({ images, onChange, maxImages = 10, folder = "cloth-store/products" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const formData = new FormData();
      toUpload.forEach((file) => formData.append("files", file));
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        onChange([...images, ...data.data]);
        toast.success(`${data.data.length} image(s) uploaded`);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Product Images ({images.length}/{maxImages})</label>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-pink-500 bg-pink-50"
            : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              Drag & drop images here, or <span className="text-pink-500">browse</span>
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB each</p>
          </div>
        )}
      </div>

      {/* Image Previews */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {images.map((img, index) => (
              <motion.div
                key={img.url + index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
              >
                <img
                  src={img.url}
                  alt={img.alt || `Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  {/* Move buttons */}
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="p-1 bg-white/90 rounded-lg text-gray-600 hover:text-pink-500"
                      >
                        <GripVertical className="h-3.5 w-3.5 rotate-90" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="p-1 bg-white/90 rounded-lg text-gray-600 hover:text-pink-500"
                      >
                        <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                      </button>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Index badge */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-lg">
                      THUMBNAIL
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Add more button */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-pink-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs">Add More</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
