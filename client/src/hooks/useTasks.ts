import { useQuery, useMutation } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import { queryClient } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: taskService.getAllTasks,
  });
}

export function useTask(id: number) {
  return useQuery<Task>({
    queryKey: ["/api/tasks", id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
}

export function useTasksByAssignee(uid: string) {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks", "assignedTo", uid],
    queryFn: () => taskService.getTasksByAssignee(uid),
    enabled: !!uid,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (taskData: InsertTask) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertTask> }) =>
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useAssignTask() {
  return useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
      taskService.assignTaskToUser(taskId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
}
