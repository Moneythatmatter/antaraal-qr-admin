"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Layers, UtensilsCrossed } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { AnimatePresence, motion } from "framer-motion";

export const Header = () => {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { categories, menuItems } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/categories")) return "categories";
    if (pathname.startsWith("/menu")) return "menu";
    if (pathname.startsWith("/qr")) return "qr";
    return "dashboard";
  };

  const title = getTitle();

  const categorySuggestions = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemSuggestions = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSuggestions = searchQuery.length > 0 && (categorySuggestions.length > 0 || itemSuggestions.length > 0);

  return (
    <header className="h-24 bg-[#17281e] relative border-b border-white/10 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* <Image src="/background.png" alt="Header Background" fill className="object-cover opacity-40 absolute inset-0" priority /> */}

      <div className="flex items-center gap-3 md:hidden relative z-10">
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
          <Image src="/images/buddha.png" alt="Logo" width={40} height={40} className="object-cover w-full h-full" priority />
        </div>
        <div>
          <h1 className="font-serif font-semibold text-lg tracking-tight leading-none text-white">Antaraal <span className="text-white/60">Resort</span></h1>
          <p className="text-[7px] font-black text-white/40 uppercase tracking-[0.4em] leading-none mt-1">A Village Resort</p>
        </div>
      </div>

      <div className="hidden md:block relative z-10">
        <h2 className="text-3xl font-serif font-semibold capitalize tracking-tight text-white">{title}</h2>
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/60 mt-1">Overview</p>
      </div>

      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        <div className="relative hidden sm:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
          <input
            type="text"
            placeholder="Quick search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-12 pr-6 py-3 bg-white/10 border border-white/10 rounded-2xl w-48 lg:w-72 focus:ring-4 focus:ring-white/10 focus:bg-white/20 transition-all text-sm font-bold shadow-inner outline-none text-white placeholder:text-white/40"
          />

          <AnimatePresence>
            {showSuggestions && hasSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10 p-2 z-50 max-h-[60vh] overflow-y-auto no-scrollbar backdrop-blur-xl"
              >
                {categorySuggestions.length > 0 && (
                  <div className="p-3">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 px-2">Categories</p>
                    {categorySuggestions.map(cat => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          router.push(`/categories`);
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-zinc-950 transition-all">
                          <Layers size={14} />
                        </div>
                        <span className="font-serif font-bold text-white text-sm">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {itemSuggestions.length > 0 && (
                  <div className="p-3 pt-0">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 px-2">Dishes</p>
                    {itemSuggestions.map(item => (
                      <button
                        key={item._id}
                        onClick={() => {
                          router.push(`/menu/${item._id}`);
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left p-2 hover:bg-white/5 rounded-xl flex items-center gap-4 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden border border-white/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <UtensilsCrossed size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-white text-sm">{item.name}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">₹{item.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="relative p-3 text-white/40 hover:text-white transition-colors hover:bg-white/10 rounded-2xl">
          <Bell size={22} />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-white rounded-full border-2 border-zinc-900 shadow-sm"></span>
        </button>

        <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl hover:scale-105 transition-transform cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};
