"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import VideoUploader from "@/components/ui/VideoUploader";
import { toast } from "sonner";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    type: "homepage",
    position: 0,
    isActive: true,
  });

  const fetchVideos = () => {
    setLoading(true);
    fetch("/api/videos")
      .then((r) => r.json())
      .then((res) => setVideos(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", url: "", thumbnail: "", type: "homepage", position: 0, isActive: true });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (video: any) => {
    setForm({
      title: video.title || "",
      description: video.description || "",
      url: video.url || "",
      thumbnail: video.thumbnail || "",
      type: video.type || "homepage",
      position: video.position || 0,
      isActive: video.isActive !== false,
    });
    setEditingId(video._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    if (!form.url) {
      toast.error("Please upload a video");
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/videos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Video updated");
      } else {
        await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Video added");
      }
      setShowModal(false);
      resetForm();
      fetchVideos();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      await fetch(`/api/videos/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchVideos();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Videos</h1>
          <p className="text-gray-500 text-sm">Upload and manage videos from Cloudinary</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-400 col-span-3 text-center py-12">No videos yet. Click "Add Video" to upload one.</p>
        ) : (
          videos.map((video: any) => (
            <div key={video._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              {video.thumbnail ? (
                <div className="h-40 bg-gray-100 relative">
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-pink-500 border-b-8 border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
              ) : video.url ? (
                <div className="h-40 bg-gray-900">
                  <video src={video.url} className="w-full h-full object-cover" muted />
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No preview</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{video.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{video.type}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full ${video.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {video.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(video)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </button>
                    <button onClick={() => handleDelete(video._id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowModal(false); resetForm(); }} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">{editingId ? "Edit Video" : "Add Video"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <VideoUploader
              videoUrl={form.url}
              thumbnailUrl={form.thumbnail}
              onVideoChange={(url) => setForm({ ...form, url })}
              onThumbnailChange={(url) => setForm({ ...form, thumbnail: url })}
            />

            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Video title"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Video description (optional)"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Type"
                options={[
                  { label: "Homepage", value: "homepage" },
                  { label: "Product", value: "product" },
                  { label: "Promo", value: "promo" },
                ]}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              <Input
                label="Position"
                type="number"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-pink-500 rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>

            <Button onClick={handleSave} fullWidth>
              {editingId ? "Update Video" : "Add Video"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
