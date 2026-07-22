"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, such as your name, email, phone number, and shipping address when you place an order. We also collect usage data to improve our services." },
  { title: "How We Use Your Information", content: "We use your information to process orders, send order updates, improve our website, and send promotional communications (with your consent)." },
  { title: "Information Sharing", content: "We do not sell your personal information. We share data only with payment processors (Razorpay) and shipping partners to fulfill your orders." },
  { title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. All payment data is encrypted and processed securely." },
  { title: "Cookies", content: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings in your browser." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. Contact us at hello@littlecloset.in for any data-related requests." },
  { title: "Contact Us", content: "For privacy-related inquiries, please contact us at hello@littlecloset.in." },
];

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Privacy Policy" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <h2 className="text-xl font-bold mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
