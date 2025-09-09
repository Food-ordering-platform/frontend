import axios from "axios";
import { config } from "process";

// Base URL points directly to your backend
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Attach token to localStorage Automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("foodapp-token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

//Handle 401/403 globally
// Handle 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("Unauthorized request. Token might be invalid.");
    }
    return Promise.reject(error);
  }
);

export default api;