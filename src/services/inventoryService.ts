import { apiRequest } from "./api";

// ─── Tipos ───────────────────────────────────────

export interface InventoryCategory {
  id: number;
  name: string;
  created_at: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category_id: number | null;
  category_name: string | null;
  stock_available: number;
  stock_minimum: number;
  unit_price: number;
  status: "activo" | "inactivo";
  created_at: string;
}

export type InventoryItemPayload = {
  name: string;
  category_id: number | null;
  stock_available: number;
  stock_minimum: number;
  unit_price: number;
  status: "activo" | "inactivo";
};

// ─── Categorías ──────────────────────────────────

export const getCategories = (): Promise<InventoryCategory[]> =>
  apiRequest("/inventory/categories");

export const createCategory = (name: string): Promise<{ message: string; category: InventoryCategory }> =>
  apiRequest("/inventory/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const deleteCategory = (id: number): Promise<{ message: string }> =>
  apiRequest(`/inventory/categories/${id}`, { method: "DELETE" });

// ─── Items ───────────────────────────────────────

export const getItems = (): Promise<InventoryItem[]> =>
  apiRequest("/inventory/items");

export const createItem = (payload: InventoryItemPayload): Promise<{ message: string; item: InventoryItem }> =>
  apiRequest("/inventory/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateItem = (
  id: number,
  payload: InventoryItemPayload
): Promise<{ message: string; item: InventoryItem }> =>
  apiRequest(`/inventory/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteItem = (id: number): Promise<{ message: string }> =>
  apiRequest(`/inventory/items/${id}`, { method: "DELETE" });
