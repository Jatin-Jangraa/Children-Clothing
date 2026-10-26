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
    settingsQuery.get().then((res) => {
      const data = res.data || {};
      // Ensure default values are populated if missing
      if (!data.announcementBar) {
        data.announcementBar = {
          text: "Free Shipping on Orders Above ₹999 | Use Code WELCOME10 for 10% Off",
          isActive: true,
        };
      }
      if (!data.countdownTimer) {
        data.countdownTimer = {
          tagline: "Limited Time Offer",
          heading: "Summer Sale Up to 50% Off",
          subheading: "Hurry! This deal ends soon",
          hours: 23,
          minutes: 59,
          seconds: 41,
          isActive: true,
        };
      }
      setSettings(data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsQuery.update(settings);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading settings...</div>;
  if (!settings) return <div className="text-center py-20">Failed to load settings</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage announcement banner, countdown timer, hero text, and general site info.</p>
        </div>
        <Button onClick={handleSave} size="lg" isLoading={saving}>
          <Save className="h-5 w-5 mr-2" /> Save Settings
        </Button>
      </div>

      {/* 1. Announcement Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">Top Announcement Bar</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcementBar?.isActive ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcementBar: {
                    ...(settings.announcementBar || {}),
                    isActive: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-pink-500 rounded"
            />
            <span className="text-sm font-medium">Show Announcement Bar</span>
          </label>
        </div>
        <Input
          label="Announcement Text"
          placeholder="Free Shipping on Orders Above ₹999 | Use Code WELCOME10 for 10% Off"
          value={settings.announcementBar?.text || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              announcementBar: {
                ...(settings.announcementBar || {}),
                text: e.target.value,
              },
            })
          }
        />
      </div>

      {/* 2. Limited Time Offer / Countdown Timer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">Limited Time Offer / Countdown Timer</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.countdownTimer?.isActive ?? true}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  countdownTimer: {
                    ...(settings.countdownTimer || {}),
                    isActive: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 accent-pink-500 rounded"
            />
            <span className="text-sm font-medium">Show Countdown Banner</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Tagline / Badge"
            placeholder="Limited Time Offer"
            value={settings.countdownTimer?.tagline || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                countdownTimer: {
                  ...(settings.countdownTimer || {}),
                  tagline: e.target.value,
                },
              })
            }
          />
          <Input
            label="Sale Heading"
            placeholder="Summer Sale Up to 50% Off"
            value={settings.countdownTimer?.heading || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                countdownTimer: {
                  ...(settings.countdownTimer || {}),
                  heading: e.target.value,
                },
              })
            }
          />
        </div>

        <Input
          label="Subheading / Deal Note"
          placeholder="Hurry! This deal ends soon"
          value={settings.countdownTimer?.subheading || ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              countdownTimer: {
                ...(settings.countdownTimer || {}),
                subheading: e.target.value,
              },
            })
          }
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Timer Initial Countdown (Hours : Mins : Secs)</label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Hours"
              type="number"
              min={0}
              max={999}
              value={settings.countdownTimer?.hours ?? 23}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  countdownTimer: {
                    ...(settings.countdownTimer || {}),
                    hours: Number(e.target.value),
                  },
                })
              }
            />
            <Input
              label="Minutes"
              type="number"
              min={0}
              max={59}
              value={settings.countdownTimer?.minutes ?? 59}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  countdownTimer: {
                    ...(settings.countdownTimer || {}),
                    minutes: Number(e.target.value),
                  },
                })
              }
            />
            <Input
              label="Seconds"
              type="number"
              min={0}
              max={59}
              value={settings.countdownTimer?.seconds ?? 41}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  countdownTimer: {
                    ...(settings.countdownTimer || {}),
                    seconds: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* 3. Hero Banner Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-gray-900">Homepage Hero Banner Text</h2>
        <Input
          label="Badge Text"
          value={settings.heroBanner?.badgeText || ""}
          onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, badgeText: e.target.value } })}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Heading Line 1"
            value={settings.heroBanner?.headingLine1 || ""}
            onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, headingLine1: e.target.value } })}
          />
          <Input
            label="Heading Line 2"
            value={settings.heroBanner?.headingLine2 || ""}
            onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, headingLine2: e.target.value } })}
          />
        </div>
        <Textarea
          label="Description"
          value={settings.heroBanner?.description || ""}
          onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, description: e.target.value } })}
        />
      </div>

      {/* 4. General Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-gray-900">General Information</h2>
        <Input label="Site Name" value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
        <Textarea label="Site Description" value={settings.siteDescription || ""} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} />
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Logo URL" value={settings.logo || ""} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} />
          <Input label="Favicon URL" value={settings.favicon || ""} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} />
        </div>
      </div>

      {/* 5. Contact Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-gray-900">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Phone" value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          <Input label="Email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
        </div>
        <Input label="Address" value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
        {/* Floating Contact Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Input label="WhatsApp Number" value={settings.whatsappNumber || ""} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showCallButton ?? true}
              onChange={(e) => setSettings({ ...settings, showCallButton: e.target.checked })}
              className="w-4 h-4 accent-pink-500 rounded"
            />
            Show Call Button
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.showWhatsappButton ?? true}
              onChange={(e) => setSettings({ ...settings, showWhatsappButton: e.target.checked })}
              className="w-4 h-4 accent-pink-500 rounded"
            />
            Show WhatsApp Button
          </label>
        </div>
      </div>

      {/* 6. Social Links */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-bold text-lg text-gray-900">Social Media Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Facebook" value={settings.socialLinks?.facebook || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
          <Input label="Instagram" value={settings.socialLinks?.instagram || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
          <Input label="Twitter" value={settings.socialLinks?.twitter || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} />
          <Input label="YouTube" value={settings.socialLinks?.youtube || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })} />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} size="lg" isLoading={saving}>
          <Save className="h-5 w-5 mr-2" /> Save Settings
        </Button>
      </div>
    </div>
  );
}
