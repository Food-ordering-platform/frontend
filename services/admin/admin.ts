// services/admin/admin.ts
import { LoginData } from "@/types/auth.type";
import api from "../axios";
import { AdminAnalytics, AdminUser, AdminPayout, AdminChartData, LogisticsCompany, CreateLogisticsCompanyData } from "@/types/admin.type";

export const loginAdmin = async (credentials: LoginData) => {
  const { data } = await api.post("/admin/login", credentials);
  return data;
};

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const { data } = await api.get("/admin/analytics");
  return data.data;
};

export const getAdminChartAnalytics = async (): Promise<AdminChartData[]> => {
  const { data } = await api.get("/admin/analytics/chart");
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

export const getLogisticsCompanies = async (): Promise<LogisticsCompany[]> => {
  const { data } = await api.get("/admin/logistics");
  return data.data;
};

export const createLogisticsCompany = async (companyData: CreateLogisticsCompanyData): Promise<LogisticsCompany> => {
  const { data } = await api.post("/admin/logistics", companyData);
  return data.data;
};

export const downloadCompanySettlement = async (companyId: string): Promise<void> => {
  const res = await api.get(`/admin/logistics/${companyId}/settlement`, {
    responseType: 'blob', // 🟢 CRITICAL: Tells Axios we are downloading a file
  });
  
  // Create a physical download link in the browser
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  
  // Set the filename dynamically
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `Settlement_${companyId.substring(0,5)}_${today}.xlsx`);
  
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const markCompanyPaid = async (companyId: string): Promise<void> => {
  await api.post(`/admin/logistics/${companyId}/mark-paid`);
};