"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import { categoryQueries } from "@/lib/queries";
import { toast } from "sonner";
import type { ICategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", icon: "", isActive: true });

  const fetchCategories = () => {
    setLoading(true);
    categoryQueries
      .getAll({ includeAll: true })
      .then((res) => setCategories(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      if (editCategory) {
        await categoryQueries.update(editCategory._id, form);
        toast.success("Category updated");
      } else {
        await categoryQueries.create(form);
        toast.success("Category created");
      }
      setShowModal(false);
      setForm({ name: "", description: "", image: "", icon: "", isActive: true });
      setEditCategory(null);
      fetchCategories();
    } catch {
      toast.error("Failed to save category");
    }
  };

  const toggleStatus = async (cat: ICategory) => {
    try {
      await categoryQueries.update(cat._id, { isActive: !cat.isActive });
      toast.success(`Category ${!cat.isActive ? "activated" : "deactivated"}`);
      fetchCategories();
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryQueries.delete(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button
          onClick={() => {
            setShowModal(true);
            setEditCategory(null);
            setForm({ name: "", description: "", image: "", icon: "", isActive: true });
          }}
          className="group"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
        ) : (
          categories.map((cat) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                    <h3 className="font-bold text-gray-900">{cat.name}</h3>
                  </div>
                  <Badge variant={cat.isActive ? "success" : "danger"}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {cat.description || "No description"}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-mono">/{cat.slug}</p>
              </div>

              <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t">
                <button
                  onClick={() => toggleStatus(cat)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                  title={cat.isActive ? "Deactivate" : "Activate"}
                >
                  {cat.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => {
                    setEditCategory(cat);
                    setForm({
                      name: cat.name,
                      description: cat.description || "",
                      image: cat.image || "",
                      icon: cat.icon || "",
                      isActive: cat.isActive ?? true,
                    });
                    setShowModal(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-blue-500 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">{editCategory ? "Edit" : "Add"} Category</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Boys Clothing"
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of this category"
            />
            <Input
              label="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
            <Input
              label="Icon / Emoji"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. 👦"
            />
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-pink-500 rounded"
              />
              <span className="text-sm font-medium">Active (Visible in store)</span>
            </label>
            <Button onClick={handleSave} fullWidth>
              {editCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
