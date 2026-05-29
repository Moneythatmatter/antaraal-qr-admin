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
import { API_BASE_URL } from "@/lib/api";
import { DietIcon, DietTypeSelect } from "@/components/DietTypeSelect";

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
  const [dietType, setDietType] = useState<"veg" | "non-veg">("veg");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      main.style.overflow = "hidden";
      return () => {
        main.style.overflow = "";
      };
    }
  }, []);

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
      setDietType(data.dietType === "non-veg" ? "non-veg" : "veg");
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
        dietType,
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
    <div className="flex flex-col h-[calc(100dvh-6rem-5.5rem)] md:h-[calc(100dvh-6rem-7rem)] min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex shrink-0 items-center gap-2 pb-4 text-sm text-gray-400">
        <Link href="/menu" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">Menu Catalog</Link>
        <ChevronRight size={14} className="text-gray-200" />
        <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">{item.name}</span>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-none bg-transparent p-0 shadow-none">
        <div className="grid h-full min-h-0 grid-cols-1 bg-white lg:grid-cols-2 rounded-[3rem] border border-gray-50 shadow-2xl overflow-hidden">
          {/* Image — fixed, does not scroll */}
          <div className="relative h-48 shrink-0 overflow-hidden bg-gray-50 lg:h-full lg:min-h-0">
            {(isEditMode ? image : item.image) ? (
              <img
                src={isEditMode ? image : item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-100">
                <UtensilsCrossed size={120} />
              </div>
            )}
            <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-10">
              <button
                onClick={() => isEditMode ? setIsEditMode(false) : router.back()}
                className="p-3 lg:p-4 bg-white/90 backdrop-blur-xl rounded-2xl text-zinc-700 shadow-2xl hover:bg-white transition-all active:scale-95 group"
              >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            {!item.isAvailable && !isEditMode && (
              <div className="absolute inset-0 z-[1] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
                <span className="bg-red-500 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl">Sold Out</span>
              </div>
            )}
          </div>

          {/* Form / details — scrollable only */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-5 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {isEditMode ? (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={handleUpdate}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif font-semibold text-zinc-900 tracking-tight uppercase">Edit Masterpiece</h2>
                    <button type="button" onClick={() => setIsEditMode(false)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                      <X size={22} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all font-semibold text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Category</label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all font-semibold text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Veg / Non-Veg</label>
                    <DietTypeSelect value={dietType} onChange={setDietType} />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all text-xs font-medium h-20 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-0.5">Image URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium text-xs text-zinc-600 italic"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      <span className="ml-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest">Available now</span>
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full py-3 text-sm">
                    <Save size={18} /> Sync Changes
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="view-content"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-5">
                    <div className="flex-1 min-w-0 pr-3">
                      <span className="text-[11px] font-black text-primary uppercase tracking-[0.28em] mb-2 block">{item.category?.name || "Featured Item"}</span>
                      <h1 className="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 tracking-tight leading-tight mb-3 break-words">{item.name}</h1>

                      <div className="flex flex-col items-start gap-2.5 mt-1">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] shadow-sm border",
                          item.dietType === "non-veg"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-green-50 text-green-700 border-green-100"
                        )}>
                          <DietIcon type={item.dietType === "non-veg" ? "non-veg" : "veg"} />
                          {item.dietType === "non-veg" ? "Non-Veg" : "Veg"}
                        </div>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.1em] shadow-sm",
                          item.isAvailable ? "bg-primary/5 text-primary border border-primary/10" : "bg-red-50 text-red-600 border border-red-100"
                        )}>
                          {item.isAvailable ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                          {item.isAvailable ? "Live & Serving" : "Sold Out"}
                        </div>

                        <button
                          onClick={async () => {
                            try {
                              const newStatus = !item.isAvailable;
                              await axios.put(`${API_BASE_URL}/menu/${item._id}`, { isAvailable: newStatus });
                              fetchItem();
                              refreshData();
                            } catch (error) {
                              console.error("Toggle error", error);
                            }
                          }}
                          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                        >
                          <div className={cn(
                            "w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner",
                            item.isAvailable ? "bg-primary" : "bg-zinc-300"
                          )}>
                            <div className={cn(
                              "w-[18px] h-[18px] bg-white rounded-full absolute top-[3px] transition-all duration-300 shadow-sm",
                              item.isAvailable ? "left-[23px]" : "left-[3px]"
                            )} />
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility status</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl font-serif font-semibold text-primary tracking-tight bg-primary/5 px-5 py-3 rounded-2xl border border-primary/10 shadow-sm flex-shrink-0">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="py-5 border-y border-gray-50">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Culinary Profile</h3>
                    <p className="text-zinc-600 text-[15px] font-medium leading-relaxed italic">
                      "{item.description || "No description provided for this culinary masterpiece."}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      size="lg"
                      onClick={() => setIsEditMode(true)}
                      className="flex-1 shadow-lg font-bold py-3.5"
                    >
                      <Edit size={18} /> Edit Details
                    </Button>
                    <button
                      onClick={handleDelete}
                      className="p-3.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm group"
                    >
                      <Trash2 size={22} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
