"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { settingsQuery } from "@/lib/queries";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsQuery.get().then((res) => setSettings(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsQuery.update(settings);
      toast.success("Settings saved");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!settings) return <div className="text-center py-20">Failed to load settings</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Website Settings</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h2 className="font-bold text-lg">General</h2>
        <Input label="Site Name" value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
        <Textarea label="Site Description" value={settings.siteDescription || ""} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} />
        <Input label="Logo URL" value={settings.logo || ""} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} />
        <Input label="Favicon URL" value={settings.favicon || ""} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h2 className="font-bold text-lg">Contact</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Phone" value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          <Input label="Email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
        </div>
        <Input label="Address" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h2 className="font-bold text-lg">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Facebook" value={settings.socialLinks?.facebook || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
          <Input label="Instagram" value={settings.socialLinks?.instagram || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
          <Input label="Twitter" value={settings.socialLinks?.twitter || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} />
          <Input label="YouTube" value={settings.socialLinks?.youtube || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h2 className="font-bold text-lg">Announcement Bar</h2>
        <Input label="Text" value={settings.announcementBar?.text || ""} onChange={(e) => setSettings({ ...settings, announcementBar: { ...settings.announcementBar, text: e.target.value } })} />
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.announcementBar?.isActive || false} onChange={(e) => setSettings({ ...settings, announcementBar: { ...settings.announcementBar, isActive: e.target.checked } })} className="w-4 h-4 accent-pink-500 rounded" />
          <span className="text-sm font-medium">Active</span>
        </label>
      </div>

      <Button onClick={handleSave} size="lg" isLoading={saving}><Save className="h-5 w-5 mr-2" /> Save Settings</Button>
    </div>
  );
}