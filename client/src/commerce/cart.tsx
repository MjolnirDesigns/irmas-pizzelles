import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FlavorId, PackSize } from "@shared/catalog";

export interface CommerceLine {
  flavor: FlavorId;
  packSize: PackSize;
  quantity: number;
}

interface CommerceCartValue {
  lines: CommerceLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  addLine: (line: Omit<CommerceLine, "quantity">, quantity?: number) => void;
  setQuantity: (flavor: FlavorId, packSize: PackSize, quantity: number) => void;
  removeLine: (flavor: FlavorId, packSize: PackSize) => void;
  clear: () => void;
  totalItems: number;
}

const CommerceCartContext = createContext<CommerceCartValue | undefined>(undefined);
const STORAGE_KEY = "irmas-asynd-cart-v1";

function readStored(): CommerceLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CommerceLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        (line.flavor === "anise" || line.flavor === "vanilla") &&
        (line.packSize === "6" || line.packSize === "12") &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0 &&
        line.quantity <= 12,
    );
  } catch {
    return [];
  }
}

export function CommerceCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CommerceLine[]>(readStored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addLine = useCallback((line: Omit<CommerceLine, "quantity">, quantity = 1) => {
    setLines((current) => {
      const index = current.findIndex((item) => item.flavor === line.flavor && item.packSize === line.packSize);
      if (index === -1) {
        return [...current, { ...line, quantity: Math.min(12, Math.max(1, quantity)) }];
      }
      const next = [...current];
      next[index] = {
        ...next[index],
        quantity: Math.min(12, next[index].quantity + quantity),
      };
      return next;
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((flavor: FlavorId, packSize: PackSize, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) {
        return current.filter((line) => !(line.flavor === flavor && line.packSize === packSize));
      }
      return current.map((line) =>
        line.flavor === flavor && line.packSize === packSize
          ? { ...line, quantity: Math.min(12, quantity) }
          : line,
      );
    });
  }, []);

  const removeLine = useCallback((flavor: FlavorId, packSize: PackSize) => {
    setLines((current) => current.filter((line) => !(line.flavor === flavor && line.packSize === packSize)));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const totalItems = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);

  const value = useMemo(
    () => ({ lines, open, setOpen, addLine, setQuantity, removeLine, clear, totalItems }),
    [lines, open, addLine, setQuantity, removeLine, clear, totalItems],
  );

  return <CommerceCartContext.Provider value={value}>{children}</CommerceCartContext.Provider>;
}

export function useCommerceCart() {
  const context = useContext(CommerceCartContext);
  if (!context) throw new Error("useCommerceCart must be used within CommerceCartProvider");
  return context;
}
