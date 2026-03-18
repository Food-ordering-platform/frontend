// services/admin/admin.queries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-utils";
import * as adminService from "./admin";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminService.loginAdmin,
    // We handle onSuccess directly inside the component so we can use the Next.js router 
    // and your AuthContext's checkAuth function.
  });
};

export const useGetAdminAnalytics = () => {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: adminService.getAdminAnalytics,
  });
};

export const useGetAllUsers = (role?: string) => {
  return useQuery({
    queryKey: ["adminUsers", role],
    queryFn: () => adminService.getAllUsers(role),
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.approveUser,
    onSuccess: () => {
      toast.success("User approved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useGetPayouts = () => {
  return useQuery({
    queryKey: ["adminPayouts"],
    queryFn: adminService.getPayouts,
  });
};

export const useMarkPayoutPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.markPayoutPaid,
    onSuccess: () => {
      toast.success("Payout marked as paid");
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] }); // Refetch profit/revenue
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};