import { apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiRequest("GET", "/api/tasks");
    return response.json();
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiRequest("GET", `/api/tasks/${id}`);
    return response.json();
  },

  createTask: async (taskData: InsertTask): Promise<Task> => {
    const response = await apiRequest("POST", "/api/tasks", taskData);
    return response.json();
  },

  updateTask: async (id: number, taskData: Partial<InsertTask>): Promise<Task> => {
    const response = await apiRequest("PUT", `/api/tasks/${id}`, taskData);
    return response.json();
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/tasks/${id}`);
  },

  getTasksByAssignee: async (uid: string): Promise<Task[]> => {
    const response = await apiRequest("GET", `/api/tasks/assignedTo/${uid}`);
    return response.json();
  },

  assignTaskToUser: async (taskId: string, userId: string): Promise<void> => {
    await apiRequest("PUT", `/api/tasks/${taskId}`, {
      assignedTo: userId,
    });
  },
};
