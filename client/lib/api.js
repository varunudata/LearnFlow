import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
});

// Request interceptor for adding the auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("learnflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("learnflow_token");
        localStorage.removeItem("learnflow_user");
        // We shouldn't force redirect here to avoid infinite loops on public pages
        // but it's standard to clear tokens.
      }
    }
    return Promise.reject(error);
  }
);

export default api;
