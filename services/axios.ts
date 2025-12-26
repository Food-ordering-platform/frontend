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
// 1. Request Interceptor: Attaches the Token
api.interceptors.request.use(
  (config) => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      // Debug log (remove later)
      // console.log("Attaching Token:", token); 

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session Expired or Invalid Token");
      // Optional: Redirect to login if needed, but be careful not to loop
      // if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default api;



