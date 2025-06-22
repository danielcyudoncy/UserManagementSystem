import { apiRequest } from "@/lib/queryClient";
import type { User, InsertUser } from "@shared/schema";

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiRequest("GET", "/api/users");
    return response.json();
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json();
  },

  getUserByUid: async (uid: string): Promise<User> => {
    const response = await apiRequest("GET", `/api/users/uid/${uid}`);
    return response.json();
  },

  createUser: async (userData: InsertUser): Promise<User> => {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json();
  },

  updateUser: async (id: number, userData: Partial<InsertUser>): Promise<User> => {
    const response = await apiRequest("PUT", `/api/users/${id}`, userData);
    return response.json();
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/users/${id}`);
  },

  deleteUserByUid: async (uid: string): Promise<void> => {
    await apiRequest("DELETE", `/api/users/uid/${uid}`);
  },

  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiRequest("GET", `/api/users?role=${role}`);
    return response.json();
  },
};
