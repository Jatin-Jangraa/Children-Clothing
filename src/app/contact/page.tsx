"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Breadcrumb, Button, Input, Textarea } from "@/components/ui";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data) setSettings(res.data);
      })
      .catch(() => {});
  }, []);

  const phone = settings?.phone || "+91 11111 11111";
  const email = settings?.email || "hello@littlecloset.in";
  const address = settings?.address || "Mumbai, Maharashtra, India";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent. Our team will contact you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Contact Us" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-gray-500">We&apos;d love to hear from you</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Phone, title: "Call Us", detail: phone, sub: "Mon-Sat, 10AM-7PM", href: `tel:${phone.replace(/\s+/g, "")}` },
            { icon: Mail, title: "Email Us", detail: email, sub: "We reply within 24 hours", href: `mailto:${email}` },
            { icon: MapPin, title: "Visit Us", detail: address, sub: "Headquarters", href: "#" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D97757] to-[#B85C38] flex items-center justify-center mx-auto mb-4 text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              {item.href && item.href !== "#" ? (
                <a href={item.href} className="text-gray-800 font-medium hover:text-[#D97757] transition-colors block">
                  {item.detail}
                </a>
              ) : (
                <p className="text-gray-800 font-medium">{item.detail}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Name" placeholder="Your name" required />
              <Input label="Email" type="email" placeholder="your@email.com" required />
            </div>
            <Input label="Subject" placeholder="How can we help?" required />
            <Textarea label="Message" placeholder="Tell us more about your question or order..." rows={5} required />
            <Button type="submit" size="lg" className="group" isLoading={isSubmitting}>
              <Send className="h-4 w-4 mr-2" /> Send Message
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
