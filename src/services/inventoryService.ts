import { apiRequest } from "./api";

export interface InventoryCategory {
  id: number;
  name: string;
  created_at?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category_id: number | null;
  category_name: string | null;
  stock_available: number;
  stock_minimum: number;
  unit_price: number;
  status: string;
  created_at: string;
}

export interface InventoryPayload {
  name: string;
  category_name: string;
  stock_available: number;
  stock_minimum: number;
  unit_price: number;
  status: string;
}

const normalizeInventoryItem = (item: any): InventoryItem => ({
  id: Number(item.id),
  name: item.name,
  category_id:
    item.category_id === null || item.category_id === undefined
      ? null
      : Number(item.category_id),
  category_name: item.category_name ?? null,
  stock_available: Number(item.stock_available),
  stock_minimum: Number(item.stock_minimum),
  unit_price: Number(item.unit_price),
  status: item.status,
  created_at: item.created_at,
});

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const data = await apiRequest("/inventory");
  return data.map(normalizeInventoryItem);
};

export const getInventoryCategories = async (): Promise<InventoryCategory[]> => {
  return await apiRequest("/inventory/categories");
};

export const createInventoryItem = async (itemData: InventoryPayload) => {
  const data = await apiRequest("/inventory", {
    method: "POST",
    body: JSON.stringify(itemData),
  });

  return {
    ...data,
    item: normalizeInventoryItem(data.item),
  };
};

export const updateInventoryItem = async (
  id: number,
  itemData: InventoryPayload
) => {
  const data = await apiRequest(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(itemData),
  });

  return {
    ...data,
    item: normalizeInventoryItem(data.item),
  };
};

export const deleteInventoryItem = async (id: number) => {
  return await apiRequest(`/inventory/${id}`, {
    method: "DELETE",
  });
};
