"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://qr-menue-backend.onrender.com/api";

interface AdminContextType {
  categories: any[];
  menuItems: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/menu`)
      ]);
      setCategories(catsRes.data);
      setMenuItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminContext.Provider value={{ categories, menuItems, loading, refreshData: fetchData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
