import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // ✅ Explicitly enable cookies if your backend needs them (based on your comments)
  // withCredentials: true, 
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session Expired or Invalid Token");
      
      // ✅ FIX: Actually clear the bad token so the app stops trying to use it
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Optional: Redirect to login immediately to be safe
        // window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;