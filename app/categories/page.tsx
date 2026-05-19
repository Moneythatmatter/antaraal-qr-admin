"use client";

import React, { useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Save, X, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";

const API_BASE_URL = "https://qr-menue-backend.onrender.com/api";

export default function CategoriesPage() {
  const { categories, menuItems, refreshData, loading } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/categories/${editingCategory._id}`, { name: categoryName });
      } else {
        await axios.post(`${API_BASE_URL}/categories`, { name: categoryName });
      }
      setCategoryName("");
      setEditingCategory(null);
      setShowModal(false);
      refreshData();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Items in this category will remain but become uncategorized.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
      refreshData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">

        <button
          onClick={() => { setCategoryName(""); setEditingCategory(null); setShowModal(true); }}
          className="hidden md:flex bg-primary text-white px-6 py-3 rounded-2xl font-bold items-center gap-2 hover:bg-zinc-900 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className={cn(
        "grid gap-6",
        categories.length === 0 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {loading ? (
          <div className="col-span-full p-20 text-center text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutGrid size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No categories found. Start by adding one!</p>
          </div>
        ) : (
          categories.map((cat) => {
            // Count items in this category
            const itemCount = menuItems.filter(item =>
              item.category?._id === cat._id || item.category === cat._id
            ).length;

            return (
              <motion.div
                layout
                key={cat._id}
                className="group bg-white p-4 md:p-6 rounded-3xl md:rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="flex flex-row md:flex-col h-full items-center md:items-start gap-4 md:gap-0">
                  <div className="flex justify-between items-start md:mb-6 w-auto md:w-full">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-serif font-semibold text-xl md:text-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                      {cat.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-lg md:text-xl text-zinc-900 mb-0.5 md:mb-1 group-hover:text-primary transition-colors truncate">{cat.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] md:text-[10px] text-zinc-400 uppercase font-black tracking-widest">Category</span>
                      <div className="h-1 w-1 rounded-full bg-zinc-200" />
                      <span className="text-[9px] md:text-[10px] text-primary font-black bg-primary/5 px-2 py-0.5 rounded-md lining-nums">
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                  </div>

                  {/* Actions - Bottom right on mobile, Top right on desktop */}
                  <div className="flex items-center gap-1 md:absolute md:top-6 md:right-6">
                    <button
                      onClick={() => {
                        setCategoryName(cat.name);
                        setEditingCategory(cat);
                        setShowModal(true);
                      }}
                      className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Edit className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-semibold text-zinc-900 tracking-tight leading-none mb-2">
                    {editingCategory ? "Edit" : "New"} Category
                  </h3>
                  <p className="text-gray-500 text-sm">Enter the name for your category</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Category Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-bold text-lg text-zinc-900 placeholder:text-zinc-300"
                    placeholder="e.g. Signature Cocktails"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-zinc-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-zinc-900 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save size={20} />
                    {editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => { setCategoryName(""); setEditingCategory(null); setShowModal(true); }}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 z-40 transition-transform"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
