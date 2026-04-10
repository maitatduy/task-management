import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  // In dev, Vite proxies /api -> http://localhost:5000/api
  // In prod, set VITE_API_URL to the production API server URL
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // This is critical for HttpOnly cookies
});

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // We could dispatch an event here to trigger a logout if a 401 occurs,
    // but the component level handling is also fine.
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - maybe token expired");
      // Optionally redirect to login, handled primarily by protected routes and state.
    }
    return Promise.reject(error);
  }
);

export default apiClient;
