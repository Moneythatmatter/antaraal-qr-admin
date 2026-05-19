"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Edit,
  Trash2,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Save,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const API_BASE_URL = "https://qr-menue-backend.onrender.com/api";

export default function MenuItemDetail() {
  const params = useParams();
  const router = useRouter();
  const { categories, refreshData } = useAdmin();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/menu/${params.id}`);
      const data = res.data;
      setItem(data);

      // Init form
      setName(data.name);
      setPrice(data.price.toString());
      setCategory(data.category?._id || data.category || "");
      setDescription(data.description || "");
      setImage(data.image || "");
      setIsAvailable(data.isAvailable);
    } catch (error) {
      console.error("Error fetching item details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        name,
        price: Number(price),
        category,
        description,
        image,
        isAvailable
      };
      await axios.put(`${API_BASE_URL}/menu/${params.id}`, updatedData);
      setIsEditMode(false);
      fetchItem();
      refreshData(); // Sync with global state
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/menu/${params.id}`);
      refreshData();
      router.push("/menu");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-black text-gray-300 mb-4">DISH NOT FOUND</h3>
        <Button variant="outline" onClick={() => router.push("/menu")}>Back to Menu</Button>
      </div>
    );
  }

  return (
    <div className="max-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/menu" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">Menu Catalog</Link>
        <ChevronRight size={14} className="text-gray-200" />
        <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">{item.name}</span>
      </div>

      <Card className="p-0 border-none overflow-hidden bg-transparent shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl border border-gray-50 overflow-hidden">
          {/* Image Section */}
          <div className="relative h-[400px] lg:h-auto bg-gray-50">
            {(isEditMode ? image : item.image) ? (
              <img src={isEditMode ? image : item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-100">
                <UtensilsCrossed size={120} />
              </div>
            )}
            <div className="absolute top-8 left-8">
              <button
                onClick={() => isEditMode ? setIsEditMode(false) : router.back()}
                className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl text-zinc-700 shadow-2xl hover:bg-white transition-all active:scale-95 group"
              >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            {!item.isAvailable && !isEditMode && (
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-red-500 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl scale-110">Sold Out</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={handleUpdate}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif font-semibold text-zinc-900 tracking-tight uppercase">Edit Masterpiece</h2>
                    <button type="button" onClick={() => setIsEditMode(false)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <X size={32} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-lg"
                      >
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium h-32 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm text-zinc-600 italic"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  <div className="flex items-center gap-3 py-4">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="ml-3 text-sm font-black text-zinc-700 uppercase tracking-widest">Available now</span>
                    </label>
                  </div>

                  <Button type="submit" size="xl" className="w-full py-6">
                    <Save size={24} /> Sync Changes
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="view-content"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 block">{item.category?.name || "Featured Item"}</span>
                      <h1 className="text-4xl md:text-5xl font-serif font-semibold text-zinc-900 tracking-tight leading-tight mb-4 break-words">{item.name}</h1>

                      <div className="flex flex-col items-start gap-3 mt-1">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.1em] shadow-sm",
                          item.isAvailable ? "bg-primary/5 text-primary border border-primary/10" : "bg-red-50 text-red-600 border border-red-100"
                        )}>
                          {item.isAvailable ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {item.isAvailable ? "Live & Serving" : "Sold Out"}
                        </div>

                        <button
                          onClick={async () => {
                            try {
                              const newStatus = !item.isAvailable;
                              await axios.put(`${API_BASE_URL}/menu/${item._id}`, { ...item, isAvailable: newStatus });
                              fetchItem();
                              refreshData();
                            } catch (error) {
                              console.error("Toggle error", error);
                            }
                          }}
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                          <div className={cn(
                            "w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                            item.isAvailable ? "bg-primary" : "bg-zinc-300"
                          )}>
                            <div className={cn(
                              "w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all duration-300 shadow-sm",
                              item.isAvailable ? "left-[26px]" : "left-[2px]"
                            )} />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility status</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-3xl font-serif font-semibold text-primary tracking-tight bg-primary/5 px-6 py-4 rounded-[1.5rem] border border-primary/10 shadow-sm flex-shrink-0">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="py-6 border-y border-gray-50">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Culinary Profile</h3>
                    <p className="text-zinc-600 text-base font-medium leading-relaxed italic">
                      "{item.description || "No description provided for this culinary masterpiece."}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      size="lg"
                      onClick={() => setIsEditMode(true)}
                      className="flex-1 shadow-lg font-bold"
                    >
                      <Edit size={20} /> Edit Details
                    </Button>
                    <button
                      onClick={handleDelete}
                      className="p-4 rounded-[1rem] border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm group"
                    >
                      <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
}
