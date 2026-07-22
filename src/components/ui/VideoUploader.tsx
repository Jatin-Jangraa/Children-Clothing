"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Video, Play } from "lucide-react";
import { toast } from "sonner";

interface VideoUploaderProps {
  videoUrl: string;
  thumbnailUrl: string;
  onVideoChange: (url: string, publicId?: string) => void;
  onThumbnailChange: (url: string) => void;
  folder?: string;
}

export default function VideoUploader({
  videoUrl,
  thumbnailUrl,
  onVideoChange,
  onThumbnailChange,
  folder = "cloth-store/videos",
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video must be under 100MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", folder);
      formData.append("type", "video");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        onVideoChange(data.data[0].url, data.data[0].publicId);
        toast.success("Video uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleThumbUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "cloth-store/thumbnails");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        onThumbnailChange(data.data[0].url);
        toast.success("Thumbnail uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleVideoUpload(e.target.files)}
          className="hidden"
        />

        {videoUrl ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
            <video src={videoUrl} controls className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={() => { onVideoChange(""); }}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => videoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-pink-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-gray-50"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                <p className="text-sm text-gray-500">Uploading video...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Video className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                  Click to upload a <span className="text-pink-500">video</span>
                </p>
                <p className="text-xs text-gray-400">MP4, WebM, MOV up to 100MB</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
        <input
          ref={thumbInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleThumbUpload(e.target.files)}
          className="hidden"
        />

        {thumbnailUrl ? (
          <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
            <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
            <button
              type="button"
              onClick={() => onThumbnailChange("")}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => thumbInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-pink-300 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-gray-50"
          >
            {uploadingThumb ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload <span className="text-pink-500">thumbnail</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
