import { apiRequest } from "./api";

export type KitchenOrderItem = {
    id: number;
    kitchen_order_id: number;
    item_name: string;
    item_emoji: string;
    item_image_url: string;
    quantity: number;
    unit_price: number;
};

export type KitchenOrder = {
    id: number;
    order_number: string;
    status: "pendiente" | "en_proceso" | "lista" | "entregada";
    notes: string | null;
    created_at: string;
    items: KitchenOrderItem[];
};

export type CartItem = {
    id: number;
    name: string;
    emoji: string;
    image_url: string;
    price: number;
    quantity: number;
};

export type CreateOrderPayload = {
    items: { name: string; emoji: string; image_url: string; price: number; quantity: number }[];
    notes?: string;
    table_number?: string;
};

export const createOrder = async (payload: CreateOrderPayload): Promise<KitchenOrder> => {
    const res = await apiRequest("/kitchen/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.order;
};

export const getOrders = async (): Promise<KitchenOrder[]> => {
    return await apiRequest("/kitchen/orders");
};

export const updateOrderStatus = async (
    id: number,
    status: string
): Promise<KitchenOrder> => {
    const res = await apiRequest(`/kitchen/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
    });
    return res.order;
};
