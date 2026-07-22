"use client";

import { useState, useEffect } from "react";
import { Users, Mail } from "lucide-react";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers").then((r) => r.json()).then((res) => setSubscribers(res.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscribers ({subscribers.length})</h1>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? <tr><td colSpan={2} className="text-center py-10 text-gray-500">Loading...</td></tr> :
              subscribers.length === 0 ? <tr><td colSpan={2} className="text-center py-10 text-gray-500">No subscribers yet</td></tr> :
              subscribers.map((sub: any) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {sub.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}