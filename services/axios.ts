import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // 🟢 CRITICAL: This allows Axios to send and receive the HttpOnly Refresh Cookie
  withCredentials: true, 
});

// Request Interceptor (Attaches the VIP Pass)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken"); // Renamed to accessToken
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

// Response Interceptor (The Silent Refresher)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Expired) AND we haven't retried this exact request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Silently ask the backend for a new access token
        // The HttpOnly cookie is automatically sent because of `withCredentials: true`
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // 2. Save the new VIP pass to local storage
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken);
        }

        // 3. Update the failed request with the new token and retry it!
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh token is ALSO dead (past 30 days), kick them out completely
        console.error("Session completely expired");
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login"; 
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;