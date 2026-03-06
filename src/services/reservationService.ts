import { apiRequest } from "./api";

export interface Reservation {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  notes: string;
  status: string;
  created_at: string;
}

// Obtener todas las reservaciones
export const getReservations = async (): Promise<Reservation[]> => {
  return await apiRequest("/reservations");
};

// Crear una reservación
export const createReservation = async (reservationData: {
  customer_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  notes: string;
  status: string;
}) => {
  return await apiRequest("/reservations", {
    method: "POST",
    body: JSON.stringify(reservationData),
  });
};

// Actualizar una reservación
export const updateReservation = async (
  id: number,
  reservationData: {
    customer_name: string;
    email: string;
    phone: string;
    reservation_date: string;
    reservation_time: string;
    people: number;
    notes: string;
    status: string;
  }
) => {
  return await apiRequest(`/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(reservationData),
  });
};

// Eliminar una reservación
export const deleteReservation = async (id: number) => {
  return await apiRequest(`/reservations/${id}`, {
    method: "DELETE",
  });
};