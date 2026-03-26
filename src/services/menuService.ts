import { apiRequest } from "./api";

export type MenuItem = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    emoji: string;
    image_url: string;
    available: boolean;
    created_at: string;
};

export type MenuItemPayload = {
    name: string;
    description: string;
    price: number;
    category: string;
    emoji: string;
    image_url: string;
    available: boolean;
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
    return await apiRequest("/menu");
};

export const createMenuItem = async (data: MenuItemPayload): Promise<MenuItem> => {
    const res = await apiRequest("/menu", { method: "POST", body: JSON.stringify(data) });
    return res.item;
};

export const updateMenuItem = async (id: number, data: MenuItemPayload): Promise<MenuItem> => {
    const res = await apiRequest(`/menu/${id}`, { method: "PUT", body: JSON.stringify(data) });
    return res.item;
};

export const deleteMenuItem = async (id: number): Promise<void> => {
    await apiRequest(`/menu/${id}`, { method: "DELETE" });
};
