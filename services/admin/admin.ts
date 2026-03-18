// services/admin/admin.ts
import api from "../axios";
import { AdminAnalytics, AdminUser, AdminPayout } from "@/types/admin.type";

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const { data } = await api.get("/admin/analytics");
  return data.data;
};

export const getAllUsers = async (role?: string): Promise<AdminUser[]> => {
  const url = role ? `/admin/users?role=${role}` : "/admin/users";
  const { data } = await api.get(url);
  return data.data;
};

export const approveUser = async (id: string): Promise<AdminUser> => {
  const { data } = await api.patch(`/admin/users/${id}/approve`);
  return data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

export const getPayouts = async (): Promise<AdminPayout[]> => {
  const { data } = await api.get("/admin/payouts");
  return data.data;
};

export const markPayoutPaid = async (id: string): Promise<void> => {
  await api.patch(`/admin/payouts/${id}/pay`);
};