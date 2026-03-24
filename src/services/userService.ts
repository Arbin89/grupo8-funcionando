import { apiRequest } from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
}

export const getUsers = async (): Promise<User[]> => {
  return await apiRequest("/users");
};  

export const createUser = async (userData: {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
  status: string;
}) => {
  return await apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (
  id: number,
  userData: {
    name: string;
    email: string;
    username: string;
    role: string;
    status: string;
  }
) => {
  return await apiRequest(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id: number) => {
  return await apiRequest(`/users/${id}`, {
    method: "DELETE",
  });
};