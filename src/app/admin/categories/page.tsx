"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { categoryQueries } from "@/lib/queries";
import { toast } from "sonner";
import type { ICategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", icon: "" });

  const fetchCategories = () => {
    setLoading(true);
    categoryQueries.getAll().then((res) => setCategories(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSave = async () => {
    try {
      if (editCategory) {
        await categoryQueries.update(editCategory._id, form);
        toast.success("Category updated");
      } else {
        await categoryQueries.create(form);
        toast.success("Category created");
      }
      setShowModal(false);
      setForm({ name: "", description: "", image: "", icon: "" });
      setEditCategory(null);
      fetchCategories();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await categoryQueries.delete(id);
      toast.success("Deleted");
      fetchCategories();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => { setShowModal(true); setEditCategory(null); setForm({ name: "", description: "", image: "", icon: "" }); }} className="group"><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-500">Loading...</p> :
          categories.map((cat) => (
            <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.description || "No description"}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditCategory(cat); setForm({ name: cat.name, description: cat.description, image: cat.image, icon: cat.icon }); setShowModal(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="h-4 w-4 text-blue-500" /></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">{editCategory ? "Edit" : "Add"} Category</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            <Input label="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon emoji or text" />
            <Button onClick={handleSave} fullWidth>{editCategory ? "Update" : "Create"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}