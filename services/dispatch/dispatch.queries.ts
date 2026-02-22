import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DispatchService } from "./dispatch";
import { toast } from "sonner";

export const useRiderTask = (trackingId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["rider-task", trackingId];

  // 1. FETCH QUERY
  const taskQuery = useQuery({
    queryKey,
    queryFn: () => DispatchService.getTask(trackingId),
    enabled: !!trackingId,
    retry: false, // Don't retry if 404/invalid link
  });

  // 2. CLAIM MUTATION
  const claimMutation = useMutation({
    mutationFn: DispatchService.assignRider,
    onSuccess: () => {
      toast.success("Order Claimed! Let's go.");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to claim order");
    }
  });

  // 3. PICKUP MUTATION
  const pickupMutation = useMutation({
    mutationFn: () => DispatchService.pickupOrder(trackingId),
    onSuccess: () => {
      toast.success("Pickup Confirmed!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to update status")
  });

  // 4. COMPLETE MUTATION
  const completeMutation = useMutation({
    mutationFn: (otp: string) => DispatchService.completeOrder({ trackingId, otp }),
    onSuccess: () => {
      toast.success("Delivery Completed!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Incorrect Code");
    }
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    // Actions
    claimOrder: claimMutation.mutateAsync,
    pickupOrder: pickupMutation.mutateAsync,
    completeOrder: completeMutation.mutateAsync,
    // Combined Loading State for Buttons
    isActionLoading: claimMutation.isPending || pickupMutation.isPending || completeMutation.isPending
  };
};