"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutDashboard as GridIcon,
  List as ListIcon,
  UtensilsCrossed,
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";

const API_BASE_URL = "https://qr-menue-backend.onrender.com/api";

export default function MenuPage() {
  const { menuItems, categories, refreshData, loading } = useAdmin();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "images">("grid");
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      name: itemName,
      price: Number(itemPrice),
      category: itemCategory,
      description: itemDescription,
      image: itemImage
    };

    try {
      if (editingItem) {
        await axios.put(`${API_BASE_URL}/menu/${editingItem._id}`, itemData);
      } else {
        await axios.post(`${API_BASE_URL}/menu`, itemData);
      }
      resetForm();
      setShowModal(false);
      refreshData();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemPrice("");
    setItemCategory("");
    setItemDescription("");
    setItemImage("");
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/menu/${id}`);
      refreshData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category?._id === activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center gap-2 md:gap-4 w-full pt-2">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white border border-zinc-100 rounded-[1rem] md:rounded-2xl text-sm md:text-base focus:ring-4 focus:ring-primary/10 outline-none shadow-sm text-zinc-900 font-medium transition-all"
          />
        </div>

        {/* Controls Container */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="p-3 md:px-5 md:py-4 bg-white border border-zinc-100 rounded-[1rem] md:rounded-[1.25rem] shadow-sm text-zinc-500 hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-2"
            >
              {viewMode === "grid" ? <GridIcon size={18} className="md:w-5 md:h-5" /> : viewMode === "list" ? <ListIcon size={18} className="md:w-5 md:h-5" /> : <UtensilsCrossed size={18} className="md:w-5 md:h-5" />}
              <ChevronDown size={14} className={cn("transition-transform", showViewDropdown && "rotate-180")} />
            </button>

            <AnimatePresence>
              {showViewDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowViewDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 overflow-hidden flex flex-col p-2"
                  >
                    <button onClick={() => { setViewMode("grid"); setShowViewDropdown(false); }} className={cn("flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm", viewMode === "grid" ? "text-primary bg-primary/5" : "text-zinc-500 hover:bg-primary/5 hover:text-zinc-900")}>
                      <GridIcon size={16} /> Grid View
                    </button>
                    <button onClick={() => { setViewMode("list"); setShowViewDropdown(false); }} className={cn("flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm", viewMode === "list" ? "text-primary bg-primary/5" : "text-zinc-500 hover:bg-primary/5 hover:text-zinc-900")}>
                      <ListIcon size={16} /> List View
                    </button>
                    <button onClick={() => { setViewMode("images"); setShowViewDropdown(false); }} className={cn("flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm", viewMode === "images" ? "text-primary bg-primary/5" : "text-zinc-500 hover:bg-primary/5 hover:text-zinc-900")}>
                      <UtensilsCrossed size={16} /> Gallery
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Create Button */}
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="hidden md:flex bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-[1rem] md:rounded-[1.25rem] font-bold items-center justify-center gap-2 md:gap-3 hover:bg-zinc-900 transition-all shadow-xl shadow-primary/20 flex-shrink-0 whitespace-nowrap"
          >
            <Plus size={20} className="md:h-6 md:w-6" /> <span className="hidden lg:inline">Create New Dish</span><span className="lg:hidden">New Dish</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            activeCategory === "all" ? "bg-zinc-900 text-white shadow-lg" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
          )}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
              activeCategory === cat._id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className={cn(
        "grid gap-6",
        viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
          viewMode === "list" ? "grid-cols-1" :
            "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
      )}>
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <UtensilsCrossed size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">No dishes found matching your criteria</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item._id}
              className={cn(
                "bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 relative",
                viewMode === "list" && "flex items-center p-4 gap-6"
              )}
            >
              <Link href={`/menu/${item._id}`} className="contents">
                <div className={cn(
                  "bg-gray-50 relative overflow-hidden flex-shrink-0 flex items-center justify-center transition-all duration-500",
                  viewMode === "grid" ? "h-64" :
                    viewMode === "list" ? "w-24 h-24 rounded-3xl" :
                      "aspect-square"
                )}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <UtensilsCrossed size={viewMode === "images" ? 24 : 48} className="text-gray-200" />
                  )}
                  {viewMode !== "list" && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-2xl font-black text-primary shadow-xl text-sm hidden lining-nums">
                      ₹{item.price}
                    </div>
                  )}
                </div>

                <div className={cn(
                  "flex-1",
                  viewMode === "grid" ? "p-8" :
                    viewMode === "list" ? "pr-8 flex items-center justify-between" :
                      "p-4 text-center"
                )}>
                  <div className={cn(viewMode === "list" && "flex-1")}>
                    <span className={cn(
                      "text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block",
                      viewMode === "images" && "hidden"
                    )}>
                      {item.category?.name || "Uncategorized"}
                    </span>
                    <h4 className={cn(
                      "font-serif font-semibold text-zinc-900 tracking-tight leading-tight line-clamp-1 truncate",
                      viewMode === "list" ? "text-xl" :
                        viewMode === "grid" ? "text-2xl mb-1" :
                          "text-xs"
                    )}>
                      {item.name}
                    </h4>
                    {viewMode === "grid" && (
                      <>
                        <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-80 h-10 mb-3">
                          {item.description || "No description provided."}
                        </p>
                        <div className="font-black text-primary text-lg lining-nums">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>
                  {viewMode === "list" && <span className="text-2xl font-black text-primary ml-8 lining-nums">₹{item.price}</span>}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="bg-white w-full max-w-4xl rounded-t-[2.5rem] sm:rounded-[3rem] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              <div className="md:w-5/12 bg-gray-50 p-6 md:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
                <div className="w-full aspect-square bg-white rounded-[2rem] md:rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden relative group shadow-inner">
                  {itemImage ? (
                    <>
                      <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setItemImage("")} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <UtensilsCrossed size={64} className="text-gray-100 mx-auto mb-4" />
                      <p className="text-xs font-black text-gray-300 uppercase tracking-widest text-center">Paste image URL below</p>
                    </div>
                  )}
                </div>
                <div className="w-full mt-10 space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Image URL</label>
                  <input
                    type="text"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    className="w-full px-5 py-3 text-xs bg-white border border-zinc-100 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-zinc-600 italic"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div className="md:w-7/12 p-6 md:p-12 flex flex-col flex-shrink-0">
                <div className="flex justify-between items-start mb-8 md:mb-10">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-serif font-semibold text-zinc-900 tracking-tight leading-none mb-1 md:mb-2">
                      {editingItem ? "Edit" : "New"} Dish
                    </h3>
                    <p className="text-gray-500 font-medium text-sm md:text-base">Define your culinary creation</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 md:p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <X size={24} className="md:w-7 md:h-7" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6 md:space-y-8 flex-1">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:bg-white outline-none transition-all text-base md:text-lg font-bold text-zinc-900"
                      placeholder="e.g. Hot Coffee, Tea"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={itemPrice}
                        onChange={(e) => setItemPrice(e.target.value)}
                        className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:bg-white outline-none transition-all text-base md:text-lg font-bold text-zinc-900"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category</label>
                      <select
                        required
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                        className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:bg-white outline-none transition-all text-base md:text-lg font-bold text-zinc-900"
                      >
                        <option value="">Choose...</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Description</label>
                    <textarea
                      rows={4}
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:bg-white outline-none transition-all text-sm md:text-base font-medium text-zinc-700 resize-none h-24 md:h-32"
                      placeholder="Describe the flavors, ingredients, and soul of this dish..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6 md:pt-10 mt-auto pb-4 md:pb-0">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-4 md:px-8 md:py-5 border border-gray-100 rounded-2xl font-bold bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-zinc-600 transition-all text-base md:text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-4 md:px-8 md:py-5 bg-primary text-white rounded-2xl font-bold hover:bg-zinc-900 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg"
                    >
                      <Save size={20} className="md:w-6 md:h-6" />
                      {editingItem ? "Update" : "Launch"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => { resetForm(); setShowModal(true); }}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 z-40 transition-transform"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

function ViewToggle({ active, icon, onClick }: { active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl transition-all duration-300",
        active ? "bg-amber-500 text-white shadow-lg" : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
      )}
    >
      {icon}
    </button>
  );
}
