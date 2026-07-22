"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";
import { Heart, Star, Users, Award, Truck, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Parents" },
  { icon: Star, value: "4.9/5", label: "Customer Rating" },
  { icon: Award, value: "500+", label: "Products" },
  { icon: Truck, value: "50K+", label: "Orders Delivered" },
];

const values = [
  { icon: Heart, title: "Passion for Quality", desc: "Every piece is crafted with love using the finest fabrics." },
  { icon: Shield, title: "Safety First", desc: "All materials are tested and certified safe for children." },
  { icon: Star, title: "Trendy Designs", desc: "Stay ahead with our latest fashion collections." },
  { icon: Users, title: "Community", desc: "Building a community of happy, stylish families." },
];

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "About Us" }]} />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Little Closet</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We&apos;re on a mission to make every child look and feel their best. Founded in 2020, Little Closet has grown
            from a small dream into India&apos;s beloved children&apos;s fashion destination.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <stat.icon className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Little Closet was born from a simple idea: every child deserves to dress in style without compromising on comfort. What started as a small online store has blossomed into a beloved brand trusted by thousands of parents across India.</p>
              <p>We work closely with manufacturers who share our commitment to quality, safety, and sustainability. Each garment goes through rigorous quality checks before it reaches your little one.</p>
              <p>Our design team draws inspiration from global trends while keeping the Indian sensibility at heart. From everyday basics to festive collections, we have something for every occasion.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="aspect-square rounded-3xl bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center text-8xl">
            👨‍👩‍👧‍👦
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
