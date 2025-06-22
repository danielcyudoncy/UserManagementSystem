import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { queryClient } from "@/lib/queryClient";
import type { User, InsertUser } from "@shared/schema";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: userService.getAllUsers,
  });
}

export function useUser(id: number) {
  return useQuery<User>({
    queryKey: ["/api/users", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

export function useUserByUid(uid: string) {
  return useQuery<User>({
    queryKey: ["/api/users", "uid", uid],
    queryFn: () => userService.getUserByUid(uid),
    enabled: !!uid,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (userData: InsertUser) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertUser> }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useDeleteUserByUid() {
  return useMutation({
    mutationFn: (uid: string) => userService.deleteUserByUid(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}
