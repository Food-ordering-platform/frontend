import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // <--- CRITICAL: Enables Cookies for Session Auth
});

// Add a request interceptor to include the token if it exists (Optional fallback)
// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Only run this in the browser
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



