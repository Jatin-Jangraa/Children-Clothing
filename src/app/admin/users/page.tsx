"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, ShieldOff, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: "user" | "admin";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole as "user" | "admin" } : u));
        toast.success(`User ${newRole === "admin" ? "promoted to admin" : "demoted to user"}`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success("User deleted");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500 text-sm">Manage user roles and permissions</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.role === "admin" ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleRole(user._id, user.role)}
                          disabled={updatingId === user._id}
                          className={`p-2 rounded-lg transition-colors ${
                            user.role === "admin"
                              ? "text-orange-500 hover:bg-orange-50"
                              : "text-purple-500 hover:bg-purple-50"
                          } disabled:opacity-50`}
                          title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                        >
                          {user.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
