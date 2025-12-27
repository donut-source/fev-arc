"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface WorkbenchItem {
  id: string;
  title: string;
  description: string;
  businessDescription?: string;
  type: string;
  category: string;
  dataOwner: string;
  steward: string;
  techStack: string[];
  gameTitle: string;
  genre: string;
  trustScore: number;
  platform?: string;
  teamName?: string;
  tags: string[];
  addedAt: Date;
}

interface WorkbenchContextType {
  items: WorkbenchItem[];
  addItem: (item: Omit<WorkbenchItem, "addedAt">) => void;
  removeItem: (id: string) => void;
  clearWorkbench: () => void;
  isInWorkbench: (id: string) => boolean;
  itemCount: number;
}

const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined);

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WorkbenchItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("data-marketplace-workbench");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert addedAt strings back to Date objects
        const itemsWithDates = parsed.map((item: WorkbenchItem & { addedAt: string }) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error("Failed to load workbench from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("data-marketplace-workbench", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<WorkbenchItem, "addedAt">) => {
    setItems((prev) => {
      // Check if item already exists
      if (prev.some((existing) => existing.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: new Date() }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearWorkbench = () => {
    setItems([]);
  };

  const isInWorkbench = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const value = {
    items,
    addItem,
    removeItem,
    clearWorkbench,
    isInWorkbench,
    itemCount: items.length,
  };

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench() {
  const context = useContext(WorkbenchContext);
  if (context === undefined) {
    throw new Error("useWorkbench must be used within a WorkbenchProvider");
  }
  return context;
}
